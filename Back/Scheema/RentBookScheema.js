const mongoose = require("mongoose");

const RentBookSchema = mongoose.Schema({
  bookId: {
    type: String,
    required: true, // Fixed typo ("require" -> "required")
  },
  userId: {
    type: String,
    required: true,
  },
  rentId: { type: String }, // Unique rent ID
  status: {
    type: String,
    required: true,
  },
  bookname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    
  },
  returnDay: {
    type: Date,
  },
  returnDayNumber: {
    type: Number,
  },
  serialNumber: {
    type: String,
   
   
  },
});

// Export the schema
module.exports = RentBookSchema;
