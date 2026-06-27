const mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  uniqueId: { type: String, required: true, unique: true }, // Unique constraint
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: false,
  },

  permanentAddress: {
    type: String,
    required: false,
  },
  currentAddress: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Stores the filename of the uploaded image
    required: false, // Optional field
  },
  linkedinId: {
    type: String, // Stores the filename of the uploaded image
    required: false, // Optional field
  },
  facebook: {
    type: String, // Stores the filename of the uploaded image
    required: false, // Optional field
  },
  whatsapp: {
    type: String, // Stores the filename of the uploaded image
    required: false, // Optional field
  },
  batch: {
    type: String, // Stores the filename of the uploaded image
    required: false, // Optional field
  },
  id: {
    type: String, // Stores the filename of the uploaded image
    required: false, // Optional field
  },

    emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
    required: false,
  },
  emailVerificationExpires: {
    type: Date,
    required: false,
  },

  designation: {
    type: String,
    required: true,
    default: "unverified",
  },
  
  startDate: {
    type: Date,
    required: false, // Optional field
  },
  endDate: {
    type: Date,
    required: false, // Optional field
  },
  
  // Password change OTP fields
  passwordChangeOTP: {
    type: String,
    required: false,
  },
  passwordChangeOTPExpires: {
    type: Date,
    required: false,
  },
  passwordChangeOTPVerified: {
    type: Boolean,
    default: false,
  }
});
userSchema.plugin(uniqueValidator);
module.exports = userSchema;
