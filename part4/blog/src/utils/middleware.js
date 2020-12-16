const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHanlder = (err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'unknown endpoint' });
  }

  next(err);
};

module.exports = { unknownEndpoint, errorHanlder };
