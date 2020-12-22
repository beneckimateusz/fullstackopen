const Blog = require('../models/blog');
const User = require('../models/user');

const testsRouter = require('express').Router();

testsRouter.post('/reset', async (req, res) => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  res.status(204).send();
});

module.exports = testsRouter;