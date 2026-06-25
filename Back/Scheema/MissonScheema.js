const mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");

const MissionSchema = mongoose.Schema({
  mission: { 
    type: String, 
    required: true 
  },  // Mission statement

  date: { 
    type: Date, 
    default: Date.now 
  }  // Date of creation
});

MissionSchema.plugin(uniqueValidator);
module.exports = MissionSchema;
