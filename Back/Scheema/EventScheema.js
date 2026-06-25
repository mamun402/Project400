const mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");

const EventSchema = mongoose.Schema({
  uniqueId: {
    type: Number,
    unique: true,
    required: true,
  },
  eventname: {
    type: String,
    required: true,
  },
  organizer: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  eventDate: {
    type: Date,
    required: true,
  },
  eventTime: {
    type: String,
    required: true,
  },


  imgUrl: {
    type: String,
    required: true,
  }
});

// Create a compound index for eventname and organizer to ensure uniqueness
EventSchema.index({ eventname: 1, organizer: 1 }, { unique: true });

EventSchema.plugin(uniqueValidator);

module.exports = EventSchema;
