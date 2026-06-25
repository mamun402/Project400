const mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const DonationSchema = mongoose.Schema({
  userId: {
    type: String,
    unique: true, // No quotes around true
  },
  
  name: {
    type: "string",
  },
  email: {
    type: "string",
  },

  paymentMethod: {
    type: "string",
  },
  mobileBankMethod: {
    type: String,
  },
  mobileBankNumber: {
    type: String,
  },
  bankAccountNumber: {
    type: "Number",
  },

  donationAmount: {
    type: "Number",
  },
  transactionId: {
    type: "string",
  },
});
DonationSchema.plugin(uniqueValidator);
module.exports = DonationSchema;
