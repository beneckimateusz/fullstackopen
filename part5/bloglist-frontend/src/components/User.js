import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const User = () => {
  const { id } = useParams();
  const user = useSelector(state => state.users.find(u => u.id === id));
  console.log('id', id);
  console.log('user', user);

  return (
    <div>
      {user && (
        <>
          <h2>{user.name}</h2>
          <h3>added blogs</h3>
          <ul>
            {user.blogs.map(blog => (
              <li key={blog.id}>{blog.title}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default User;
