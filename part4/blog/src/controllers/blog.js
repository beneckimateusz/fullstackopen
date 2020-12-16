const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});

  res.send(blogs);
});

blogsRouter.post('/', async (req, res, next) => {
  try {
    const blog = new Blog(req.body);

    const savedBlog = await blog.save();
    res.status(201).send(savedBlog);
  } catch (err) {
    next(err);
  }
});

module.exports = blogsRouter;
