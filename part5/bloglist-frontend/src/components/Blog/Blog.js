import PropTypes from 'prop-types';
import React, { useState } from 'react';

const Blog = ({ blog, loggedInUser, handleLike, handleRemove }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const [displayDetails, setDisplayDetails] = useState(false);
  const ownedByLoggedInUser =
    loggedInUser && loggedInUser.username === blog.user.username;

  return (
    <div style={blogStyle}>
      <div className="blog">
        <span className="blog__title">{blog.title}</span> <span className="blog__author">{blog.author}</span>
        <button onClick={() => setDisplayDetails(!displayDetails)}>
          {displayDetails ? 'hide' : 'view'}
        </button>
        {displayDetails && (
          <div className="blog__details">
            <div className="blog__details__url">{blog.url}</div>
            <div className="blog__details__likes">
              likes <span className="likes-count">{blog.likes}</span>{' '}
              <button onClick={() => handleLike(blog)}>like</button>
            </div>
            <div className="blog__details__username">{blog.user.username}</div>
            {ownedByLoggedInUser && (
              <button onClick={() => handleRemove(blog)}>remove</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object,
  handleLike: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

export default Blog;
