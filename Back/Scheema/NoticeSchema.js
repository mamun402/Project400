const mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const NoticeSchema = mongoose.Schema({
  uniqueId:{
    type: Number,
    unique: true,
    required: true,
  },
    noticeTitle: {
    type: "string",
    require: "true",
  },
  description: {
    type: "string",
    require: "true",
    unique: "true",
  },
  imgUrl: {
    type: String,
    required: true,
   
  },
  category:{
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
NoticeSchema.plugin(uniqueValidator);
module.exports = NoticeSchema;
