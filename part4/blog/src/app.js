require('./db/mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const blogsRouter = require('./controllers/blog');
const usersRouter = require('./controllers/user');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHanlder);

module.exports = app;
