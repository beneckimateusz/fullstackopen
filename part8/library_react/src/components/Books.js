import {
  useApolloClient,
  useQuery,
  useSubscription
} from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { includedIn, unique } from '../lib/utils';
import { ALL_BOOKS, BOOK_ADDED } from '../queries';

const Books = props => {
  const apolloClient = useApolloClient();
  const [allGenres, setAllGenres] = useState(null);
  const [genreFilter, setGenreFilter] = useState(null);
  const { error, data } = useQuery(ALL_BOOKS, {
    variables: { genre: genreFilter },
  });

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const bookAdded = subscriptionData.data.bookAdded;
      console.log('bookAdded', bookAdded)

      const { allBooks: booksInStore } = apolloClient.readQuery({
        query: ALL_BOOKS,
      });
      if (!includedIn(booksInStore, bookAdded)) {
        apolloClient.writeQuery({
          query: ALL_BOOKS,
          data: { allBooks: booksInStore.concat(bookAdded) },
        });

        window.alert(`${bookAdded.title} added!`);
      }
    },
  });

  useEffect(() => {
    if (data && !allGenres) {
      const allGenres = data.allBooks.map(b => [...b.genres]);
      const allUniqueGenres = unique(allGenres.flat());
      setAllGenres(allUniqueGenres);
      // setGenreFilter(allUniqueGenres);
    }
  }, [data, allGenres]);

  if (!props.show) return null;
  if (error) return <div>{error.message}</div>;

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data &&
            data.allBooks.map(a => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <div>
        {/* not proud of using array index at all */}
        {allGenres &&
          allGenres.map((genre, index) => (
            <button key={index} onClick={() => setGenreFilter(genre)}>
              {genre}
            </button>
          ))}
        <button onClick={() => setGenreFilter(null)}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
