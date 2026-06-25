const mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");

const BlogSchema = mongoose.Schema({
  uniqueId: {
    type: Number,
    unique: true,
    required: true,
  },
  blogTitle: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },

  imgUrl: {
    type: String,
    required: true,
   
  },
  date: {
    type: Date,
    default: Date.now, // Set the default value to the current date and time
  },
});



BlogSchema.plugin(uniqueValidator);

module.exports = BlogSchema;