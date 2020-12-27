require('./db/mongoose');
const {
  ApolloServer,
  gql,
  UserInputError,
  AuthenticationError,
  PubSub,
} = require('apollo-server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('./utils/config');
const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');
const DataLoader = require('dataloader');

const pubsub = new PubSub();

const batchAuthors = async keys => {
  const authors = await Author.find({
    _id: { $in: keys },
  });

  return keys.map(key =>
    authors.find(a => a._id.toString() === key.toString())
  );
};

const batchAuthorBooks = async keys => {
  const authorsBooks = await Book.find({
    author: { $in: keys },
  });

  return keys.map(
    key =>
      authorsBooks.filter(b => b.author.toString() === key.toString()).length
  );
};

const typeDefs = gql`
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!

    me: User
    recommended: [Book!]!
  }

  type Mutation {
    reset: Boolean
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author

    createUser(
      username: String!
      password: String!
      favoriteGenre: String!
    ): User
    login(username: String!, password: String!): Token
  }

  type Subscription {
    bookAdded: Book!
  }

  type Author {
    id: ID!
    name: String!
    born: Int
    bookCount: Int!
  }

  type Book {
    id: ID!
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
  }

  type User {
    id: ID!
    username: String!
    passwordHash: String!
    favoriteGenre: String!
  }

  type Token {
    value: String!
  }
`;

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: (root, args) => {
      if (Object.keys(args).length === 0) {
        return Book.find({});
      }

      const filters = {};
      if (args.genre) filters.genres = args.genre;

      try {
        return Book.find(filters);
      } catch (err) {
        throw new UserInputError(err.message, { invalidArgs: args });
      }
    },
    allAuthors: () => Author.find({}),
    me: (root, args, ctx) => ctx.user,
    recommended: (root, args, { user }) => {
      if (!user) throw new AuthenticationError('not authenticated');
      return Book.find({ genres: user.favoriteGenre });
    },
  },
  Mutation: {
    reset: async () => {
      await Book.deleteMany({});
      await Author.deleteMany({});

      return true;
    },
    addBook: async (root, args, { user }) => {
      if (!user) throw new AuthenticationError('not authenticated');

      const author = await Author.findOne({ name: args.author });

      try {
        const savedAuthor = author
          ? author
          : await new Author({ name: args.author }).save();

        const book = new Book({ ...args, author: savedAuthor._id });
        const savedBook = await book.save();


        /* can't figure out the pubsub here at all (been trying for approx. 3 hours straight) */
        // const authorForPubsub = savedAuthor._doc;
        // authorForPubsub.id = authorForPubsub._id;

        // const bookForPubsub = savedBook._doc;
        // bookForPubsub.id = bookForPubsub._id;
        // bookForPubsub.author = authorForPubsub;

        // pubsub.publish('BOOK_ADDED', { bookAdded: bookForPubsub });
        // console.log('{ bookAdded: book }', { bookAdded: book })
        return savedBook;
      } catch (err) {
        throw new UserInputError(err.message, { invalidArgs: args });
      }
    },
    editAuthor: async (root, { name, setBornTo }, { user }) => {
      if (!user) throw new AuthenticationError('not authenticated');

      const author = await Author.findOne({ name });
      if (!author) {
        return null;
      }

      try {
        author.born = setBornTo;
        const savedAuthor = await author.save();
        return savedAuthor;
      } catch (err) {
        throw new UserInputError(err.message);
      }
    },
    createUser: async (root, { username, password, favoriteGenre }) => {
      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({ username, passwordHash, favoriteGenre });

      try {
        const savedUser = await user.save();
        return savedUser;
      } catch (err) {
        throw new UserInputError(err.message);
      }
    },
    login: async (root, { username, password }) => {
      const user = await User.findOne({ username });
      const passwordMatch = user
        ? await bcrypt.compare(password, user.passwordHash)
        : false;

      if (!user || !passwordMatch) {
        throw new UserInputError('wrong credentials');
      }

      const tokenPayload = { id: user._id, username };
      return { value: jwt.sign(tokenPayload, config.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
    },
  },
  Book: {
    author: async (root, args, { loaders }) => loaders.author.load(root.author),
  },
  Author: {
    bookCount: async (root, args, { loaders }) => loaders.authorBooks.load(root._id),
  },
};

const getUser = async token => {
  if (!token.startsWith('Bearer ')) return null;

  const decodedPayload = jwt.verify(token.substring(7), config.JWT_SECRET);
  const user = await User.findById(decodedPayload.id);

  return user;
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) return connection.context;

    const token = req.headers.authorization || '';
    const user = await getUser(token);

    return {
      user,
      loaders: {
        author: new DataLoader(keys => batchAuthors(keys)),
        authorBooks: new DataLoader(keys => batchAuthorBooks(keys)),
      },
    };
  },
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`server ready at ${url} 🚀`);
  console.log(`subscriptions ready at ${subscriptionsUrl}`);
});
