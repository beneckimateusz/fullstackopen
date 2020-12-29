import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Blogs = () => {
  const blogs = useSelector(state => state.blogs);
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);

  return (
    <div className="blogs">
      <h2>blogs</h2>

      <ul>
        {sortedBlogs.map(blog => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blogs;
