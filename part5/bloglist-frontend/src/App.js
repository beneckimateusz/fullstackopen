import React, { useEffect, useRef, useState } from 'react';
import Blog from './components/Blog/Blog';
import BlogForm from './components/BlogForm/BlogForm';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);

  const [user, setUser] = useState(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [ackMessage, setAckMessage] = useState('');

  const blogFormRef = useRef();

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

  const handleLogin = async userObject => {
    try {
      const user = await loginService.login(userObject);

      localStorage.setItem('loggedInUser', JSON.stringify(user));
      blogService.setToken(user.token);

      setUser(user);

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

  const addBlog = async blogObject => {
    try {
      const savedBlog = await blogService.create(blogObject);
      setBlogs([...blogs, { ...savedBlog, user }]);

      setAckMessage(`added ${savedBlog.title} by ${savedBlog.author}`);
      setTimeout(() => setAckMessage(''), 3000);
      blogFormRef.current.toggleVisibility();
      return true;
    } catch (err) {
      setErrorMessage(err.message);
      setTimeout(() => setErrorMessage(''), 3000);
      return false;
    }
  };

  const handleLike = async blogObject => {
    blogObject.likes++;

    try {
      await blogService.upsert(blogObject);

      setAckMessage(`liked ${blogObject.title} by ${blogObject.author}`);
      setTimeout(() => setAckMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.message);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleRemove = async blogObject => {
    const removalConfirmed = window.confirm(
      `remove blog ${blogObject.title} by ${blogObject.author}`
    );
    if (!removalConfirmed) return;

    try {
      await blogService.remove(blogObject.id);
      const removedBlogIndex = blogs.findIndex(b => b.id === blogObject.id);
      if (removedBlogIndex > -1) {
        const updatedBlogs = [...blogs];
        updatedBlogs.splice(removedBlogIndex, 1);
        setBlogs(updatedBlogs);

        setAckMessage(`removed ${blogObject.title} by ${blogObject.author}`);
        setTimeout(() => setAckMessage(''), 3000);
      }
    } catch (err) {
      setErrorMessage(err.message);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const loginForm = () => (
    <Togglable buttonLabel="log in">
      <LoginForm handleLogin={handleLogin} />
    </Togglable>
  );

  const createBlogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  );

  const blogsToShow = blogs.sort((a, b) => b.likes - a.likes);

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

      {blogsToShow.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          loggedInUser={user}
          handleLike={handleLike}
          handleRemove={handleRemove}
        />
      ))}
    </div>
  );
};

export default App;
