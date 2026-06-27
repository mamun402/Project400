const mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const AlumniScheema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  uniqueId: { type: Number, required: true, unique: true }, // Unique constraint
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  mobile: {
    type: String,
    default: "",
  },

  whatsapp: {
    type: String,
    default: "",
  },
  linkedin: {
    type: String,
    default: "",
  },
  designation: {
    type: String,
    default: "",
  },
  currentEmployer: {
    type: String,
    default: "",
  },
  facebook: {
    type: String,
    default: "",
  },
  image: {
    type: String, // Stores the filename of the uploaded image
    default: "",
  },
 
});
AlumniScheema.plugin(uniqueValidator);
module.exports = AlumniScheema;
