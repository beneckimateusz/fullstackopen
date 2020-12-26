const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  favoriteGenre: {
    type: String,
    required: true,
  },
});

userSchema.plugin(mongooseUniqueValidator);

const User = mongoose.model('User', userSchema);

module.exports = User;
