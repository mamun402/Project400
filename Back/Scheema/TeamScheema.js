const mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const TeamScheema = mongoose.Schema({
  Name: String,
  role: String,
  Mobile: String,
  email: String,
  imgUrl: String,
  date: { type: Date, default: Date.now },
});
TeamScheema.plugin(uniqueValidator);
module.exports = TeamScheema;
