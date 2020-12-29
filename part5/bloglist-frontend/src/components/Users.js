import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Users = () => {
  const users = useSelector(state => state.users);

  return (
    <div className="users">
      <h2>users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>
              <strong>{user.name}</strong>
            </Link>
            , blogs created: <strong>{user.blogs.length}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
