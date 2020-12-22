import PropTypes from 'prop-types';
import React, { useState } from 'react';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = async e => {
    e.preventDefault();

    const wasAdded = await createBlog({ title, author, url });

    if (wasAdded)
    {
      setTitle('');
      setAuthor('');
      setUrl('');
    }
  };

  return (
    <div className="create-blog">
      <h3>create new</h3>
      <form onSubmit={addBlog}>
        <div>
          title
          <input
            type="text"
            name="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div>
          author
          <input
            type="text"
            name="author"
            value={author}
            onChange={e => setAuthor(e.target.value)}
          />
        </div>
        <div>
          url
          <input
            type="text"
            name="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
        </div>
        <button className="create-blog__submit-button" type="submit">create</button>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
