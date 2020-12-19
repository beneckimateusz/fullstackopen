const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const { auth } = require('../utils/middleware');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 });

  res.send(blogs);
});

blogsRouter.post('/', auth, async (req, res, next) => {
  const blog = new Blog({ ...req.body, user: req.user._id });
  try {
    const savedBlog = await blog.save();

    req.user.blogs = req.user.blogs.concat(blog);
    await req.user.save();

    res.status(201).send(savedBlog);
  } catch (err) {
    next(err);
  }
});

blogsRouter.put('/:id', auth, async (req, res, next) => {
  const allowedUpdates = ['title', 'author', 'url', 'likes'];

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).send({ error: 'blog not found' });
    }

    if (blog.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .send({ error: 'requesting user does not own this blog' });
    }

    for (const key of Object.keys(req.body)) {
      if (allowedUpdates.includes(key)) {
        blog[key] = req.body[key];
      }
    }

    const updatedBlog = await blog.save();
    res.send(updatedBlog);
  } catch (err) {
    next(err);
  }
});

blogsRouter.delete('/:id', auth, async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).send({ error: 'blog not found' });
    }

    if (blog.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .send({ error: 'requesting user does not own this blog' });
    }

    await blog.remove();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = blogsRouter;
