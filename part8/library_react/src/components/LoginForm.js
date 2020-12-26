import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { LOGIN } from '../queries';

const LoginForm = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login, { data }] = useMutation(LOGIN, {
    onError: err => console.error(err.message),
  });

  useEffect(() => {
    if (data) {
      setToken(data.login.value);
      localStorage.setItem('library-user-token', data.login.value);
      setPage('books');
    }
  }, [data, setToken, setPage]);

  if (!show) return null;

  const submit = event => {
    event.preventDefault();

    login({ variables: { username, password } });
  };

  return (
    <div>
      <h2>hello</h2>
      <form onSubmit={submit}>
        <div>
          username{' '}
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          password{' '}
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default LoginForm;
