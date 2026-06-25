const mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const MemberShipSchema = mongoose.Schema({
    userId: {
        type: "string",
        unique: "true",
      },
  name: {
    type: "string",
  },

  email: {
    type: "string",
  },
  phoneNumber: {
    type: "string",
  },
  paymentMethod: {
    type: "String",
  },
  mobileBankMethod: {
    type: "String",
  },

  mobileBankNumber: {
    type: String,
  },
  bankAccountNumber: {
    type: "string",
  },
  transactionId: {
    type: "string",
  },
});
MemberShipSchema.plugin(uniqueValidator);
module.exports = MemberShipSchema;
