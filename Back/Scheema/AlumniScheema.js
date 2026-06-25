const mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const AlumniScheema = mongoose.Schema({
  name: {
    type: "string",
    require: "true",
  },
  uniqueId: { type: String, required: true, unique: true }, // Unique constraint
  email: {
    type: "string",
    require: "true",
    unique: "true",
  },
  mobile: {
    type: String,
    require: true,
  },

  whatsapp: {
    type: "string",
    require: "true",
  },
  linkedin: {
    type: "string",
    require: "true",
  },
  designation: {
    type: "string",
    require: "true",
  },
  currentEmployer: {
    type: "string",
    require: "true",
  },
  facebook: {
    type: "string",
    require: "true",
  },
  image: {
    type: String, // Stores the filename of the uploaded image
    required: false, // Optional field
  },
 
});
AlumniScheema.plugin(uniqueValidator);
module.exports = AlumniScheema;
