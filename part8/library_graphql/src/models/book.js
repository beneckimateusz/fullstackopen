const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
  },
  published: {
    type: Number,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
  },
  genres: [{ type: String }],
});

bookSchema.plugin(mongooseUniqueValidator);

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
