const mongoose = require('mongoose');
const config = require('../utils/config');

mongoose
  .connect(config.MONGODB_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('connected to mongodb'))
  .catch(err => console.log('failed connecting to mongodb', err.message));
