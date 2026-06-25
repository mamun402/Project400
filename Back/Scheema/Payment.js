const mongoose = require("mongoose");
const DoctorSchema = mongoose.Schema({
  username: {
    type: "string",
    require: "true",
  },
  doctor: {
    type: "string",
    require: "true",
    unique: "true",
  },
  payment: {
    type: "string",
    require: "true",
  },
});

module.exports = DoctorSchema;
