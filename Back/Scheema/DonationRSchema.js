const mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");

const DonationRSchema = mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  ammount: { type: Number, required: true },
  date: { type: Date, default: Date.now }, // Automatically set to the current date
});

// Applying the uniqueValidator plugin to the schema
DonationRSchema.plugin(uniqueValidator);

module.exports = DonationRSchema;
