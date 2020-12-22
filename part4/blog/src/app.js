require('./db/mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const blogsRouter = require('./controllers/blog');
const usersRouter = require('./controllers/user');
const loginRouter = require('./controllers/login');
const testsRouter = require('./controllers/testing');
const middleware = require('./utils/middleware');

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testsRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHanlder);

module.exports = app;
