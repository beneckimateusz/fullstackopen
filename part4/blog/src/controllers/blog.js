const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});

  res.send(blogs);
});

blogsRouter.post('/', async (req, res, next) => {
  const blog = new Blog(req.body);

  try {
    const savedBlog = await blog.save();
    res.status(201).send(savedBlog);
  } catch (err) {
    next(err);
  }
});

blogsRouter.put('/:id', async (req, res, next) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.send(updatedBlog);
  } catch (err) {
    next(err);
  }
});

blogsRouter.delete('/:id', async (req, res, next) => {
  try {
    await Blog.findByIdAndRemove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = blogsRouter;
