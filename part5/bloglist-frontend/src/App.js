import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import './App.css';
import Blog from './components/Blog/Blog';
import BlogForm from './components/BlogForm/BlogForm';
import Blogs from './components/Blogs';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable/Togglable';
import User from './components/User';
import Users from './components/Users';
import { createBlog, initializeBlogs } from './reducers/blogReducer';
import { changeNotification } from './reducers/notificationReducer';
import { login, logout, setUserFromLS } from './reducers/userReducer';
import { initializeUsers } from './reducers/usersReducer';

const App = () => {
  const notifications = useSelector(state => state.notifications);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const blogFormRef = useRef();

  useEffect(() => {
    dispatch(setUserFromLS());
  }, [dispatch]);

  useEffect(() => {
    dispatch(initializeUsers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  const handleLogin = async credentials => {
    try {
      dispatch(login(credentials));
    } catch (err) {
      dispatch(changeNotification('err', err.message, 5));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const addBlog = async blogObject => {
    try {
      dispatch(createBlog(blogObject, user));

      blogFormRef.current.toggleVisibility();
      return true;
    } catch (err) {
      dispatch(changeNotification('err', err.message, 5));
      return false;
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

  return (
    <div>
      {notifications.errorMessage && (
        <h3 className="notification notification--error">
          {notifications.errorMessage}
        </h3>
      )}
      {notifications.ackMessage && (
        <h3 className="notification notification--success">
          {notifications.ackMessage}
        </h3>
      )}

      {!user ? (
        loginForm()
      ) : (
        <div>
          <p>{user.name ? user.name : user.username} logged in</p>
          <button onClick={handleLogout}>logout</button>
          {createBlogForm()}
        </div>
      )}

      <Router>
        <div>
          <Link to="/">blogs</Link>
        </div>
        <div>
          <Link to="/users">users</Link>
        </div>

        <Switch>
          <Route path="/users/:id">
            <User />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/blogs/:id">
            <Blog />
          </Route>
          <Route path="/">
            <Blogs />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
