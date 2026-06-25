const mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");

const BooksSchema = mongoose.Schema({
  uniqueId: {
    type: Number,
    unique: true,
    required: true,
  },
  bookname: {
    type: String,
    required: true,
  },
  authorname: {
    type: String,
    required: true,
  },
  aboutbook: {
    type: String,
    required: true,
  },
  totalbooks: {
    type: Number,
    required: true,
  },
  booktype: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
   
  },
  serialNumbers: [String], // Array of serial numbers
});

// Create a compound index for bookname and authorname to ensure they are unique together
BooksSchema.index({ bookname: 1, authorname: 1 }, { unique: true });

BooksSchema.plugin(uniqueValidator);

module.exports = BooksSchema;
