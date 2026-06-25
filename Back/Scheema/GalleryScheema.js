const mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const GalleryScheema = mongoose.Schema({
  uniqueId: {
    type: Number,
    unique: true,
    required: true,
  },
    title: {
        type: String,
        required: true,
        trim: true, // Removes extra spaces before and after the string
      },
      description: {
        type: String,
        required: true,
        trim: true, // Removes extra spaces before and after the string
      },
      imgUrl: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now, // Automatically assigns the current date when the document is created
      },
});
GalleryScheema.plugin(uniqueValidator);
module.exports = GalleryScheema;
