const config = require('../utils/config');
const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  const credentialsCorrect = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!credentialsCorrect) {
    return res.status(401).send({ error: 'invalid username or password' });
  }

  const token = jwt.sign({ id: user._id, username }, config.SECRET);

  res.send({ token, username, name: user.name });
});

module.exports = loginRouter;
