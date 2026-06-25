const mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const ActiveScheema = mongoose.Schema({
    userId: { type: String, required: true, unique: true }, 
  Status: {
    type: String, required: true
    
  },
  date: { type: Date, default: Date.now }, 
});
ActiveScheema.plugin(uniqueValidator);
module.exports = ActiveScheema;
