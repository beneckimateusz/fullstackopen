const mongoose = require('mongoose');
const logger = require('../utils/logger');
const config = require('../utils/config');

logger.info('Connecting to MongoDB...');

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => logger.error(err.message));
