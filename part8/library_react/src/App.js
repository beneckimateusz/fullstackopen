import { useApolloClient } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import LoginForm from './components/LoginForm';
import NewBook from './components/NewBook';
import Recommended from './components/Recommended';

const App = () => {
  const apolloClient = useApolloClient();
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('library-user-token');
    if (token) {
      setToken(token);
    }
  }, []);

  const logout = () => {
    setToken(null);
    localStorage.clear();
    apolloClient.resetStore();
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage('recommended')}>recommended</button>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      {token ? (
        <>
          <Recommended show={page === 'recommended'} />
          <NewBook show={page === 'add'} />
        </>
      ) : (
        <LoginForm
          show={page === 'login'}
          setToken={setToken}
          setPage={setPage}
        />
      )}
    </div>
  );
};

export default App;
