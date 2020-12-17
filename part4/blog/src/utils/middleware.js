const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHanlder = (err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'unknown endpoint' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message });
  }

  next(err);
};

module.exports = { unknownEndpoint, errorHanlder };
