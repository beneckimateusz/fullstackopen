// eslint-disable-next-line no-unused-vars
const dummy = blogs => 1;

const totalLikes = blogs => blogs.reduce((sum, { likes }) => sum + likes, 0);

const favoriteBlog = blogs => maxBy(blogs, blog => blog.likes);

/* 
  Define a function called mostBlogs that receives an array of blogs as a parameter. 
  The function returns the author who has the largest amount of blogs.
  The return value also contains the number of blogs the top author has.
*/
const mostBlogs = blogs => {
  const authors = unique(blogs.map(blog => blog.author));
  const authorBlogs = authors.map(author => ({
    author,
    blogs: blogs.filter(b => b.author === author).length,
  }));

  return maxBy(authorBlogs, x => x.blogs);
};


/*
  Define a function called mostLikes that receives an array of blogs as its parameter.
  The function returns the author, whose blog posts have the largest amount of likes.
  The return value also contains the total number of likes that the author has received.
*/
const mostLikes = blogs => {
  const authors = unique(blogs.map(blog => blog.author));
  const authorLikes = authors.map(author => ({
    author,
    likes: blogs.filter(b => b.author === author).reduce((sum, blog) => sum + blog.likes, 0)
  }));
  
  return maxBy(authorLikes, x => x.likes);
};

const unique = xs => Array.from(new Set(xs));

const maxBy = (xs, fn) => {
  if (xs.length === 0) return null;
  return xs.reduce((x, y) => (fn(x) > fn(y) ? x : y));
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };