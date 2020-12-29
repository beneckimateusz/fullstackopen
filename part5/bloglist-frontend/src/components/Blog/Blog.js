import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { likeBlog, removeBlog } from '../../reducers/blogReducer';
import { changeNotification } from '../../reducers/notificationReducer';

const Blog = () => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const { id } = useParams();
  const blog = useSelector(state => state.blogs.find(b => b.id === id));
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const ownedByLoggedInUser = user && blog && user.username === blog.user.username;

  const handleLike = async blogObject => {
    try {
      dispatch(likeBlog(blogObject));
    } catch (err) {
      dispatch(changeNotification('err', err.message, 5));
    }
  };

  const handleRemove = async blogObject => {
    const removalConfirmed = window.confirm(
      `remove blog ${blogObject.title} by ${blogObject.author}`
    );
    if (!removalConfirmed) return;

    try {
      dispatch(removeBlog(blogObject));
    } catch (err) {
      dispatch(changeNotification('err', err.message, 5));
    }
  };

  return (
    <div style={blogStyle}>
      {blog && (
        <div className="blog">
          <h2 className="blog__title">{blog.title}</h2>{' '}
          <h3 className="blog__author">{blog.author}</h3>
          <div className="blog__details">
            <a className="blog__details__url" href={blog.url}>{blog.url}</a>
            <div className="blog__details__likes">
              likes <span className="likes-count">{blog.likes}</span>{' '}
              <button onClick={() => handleLike(blog)}>like</button>
            </div>
            <div className="blog__details__username">added by {blog.user.username}</div>
            {ownedByLoggedInUser && (
              <button onClick={() => handleRemove(blog)}>remove</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
