import React, { useEffect, useState } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [ackMessage, setAckMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const blogs = await blogService.getAll();
      setBlogs(blogs);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const userJSON = localStorage.getItem('loggedInUser');
    if (userJSON) {
      const user = JSON.parse(userJSON);
      blogService.setToken(user.token);
      setUser(user);
    }
  }, []);

  const handleLogin = async e => {
    e.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      localStorage.setItem('loggedInUser', JSON.stringify(user));
      blogService.setToken(user.token);

      setUser(user);
      setUsername('');
      setPassword('');

      setAckMessage('successfully logged in!');
      setTimeout(() => setAckMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.message);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setUser(null);
    setAckMessage('successfully logged out!');
    setTimeout(() => setAckMessage(''), 3000);
  };

  const addBlog = async (e) => {
    e.preventDefault();

    try {
      const savedBlog = await blogService.create({title, author, url});
      setBlogs([...blogs, savedBlog]);

      setAckMessage(`added ${savedBlog.title} by ${savedBlog.author}`);
      setTimeout(() => setAckMessage(''), 3000);

      setTitle('');
      setAuthor('');
      setUrl('');
    } catch (err) {
      setErrorMessage(err.message);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );

  const createBlogForm = () => (
    <div>
      <h3>create new</h3>
      <form onSubmit={addBlog}>
        <div>
          title
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div>
          author
          <input
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
          />
        </div>
        <div>
          url
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );

  return (
    <div>
      <h2>blogs</h2>
      <h3 style={{ color: 'red' }}>{errorMessage}</h3>
      <h3 style={{ color: 'green' }}>{ackMessage}</h3>

      {!user ? (
        loginForm()
      ) : (
        <div>
          <p>{user.name ? user.name : user.username} logged in</p>
          <button onClick={handleLogout}>logout</button>
          {createBlogForm()}
        </div>
      )}

      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
