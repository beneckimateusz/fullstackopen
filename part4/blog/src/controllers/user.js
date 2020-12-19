const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

const isDefinedAndMinLength = (x, minlength) => x && x.length >= minlength;

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 });
  res.send(users);
});

usersRouter.post('/', async (req, res, next) => {
  const { username, name, password } = req.body;

  if (!isDefinedAndMinLength(username, 3) || !isDefinedAndMinLength(password, 3)) {
    return res.status(400).send( { error: 'username or password is missing or invalid' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username, name, passwordHash });

  try {
    const savedUser = await user.save();
    res.status(201).send(savedUser);
  } catch (err) {
    next(err);
  }
});

module.exports = usersRouter;