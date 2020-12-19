const config = require('../utils/config');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHanlder = (err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'unknown endpoint' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message });
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).send({ error: 'invalid or missing token' });
  }

  next(err);
};

const auth = async (req, res, next) => {
  const token = getToken(req);

  try {
    const decodedPayload = jwt.verify(token, config.SECRET);
    if (!decodedPayload.id) {
      return res.status(401).send({ error: 'invalid token' });
    }

    const user = await User.findById(decodedPayload.id);
    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

const getToken = req => {
  const authorization = req.get('authorization');
  return authorization && authorization.startsWith('Bearer ')
    ? authorization.substring(7)
    : null;
};

module.exports = { unknownEndpoint, errorHanlder, auth };
