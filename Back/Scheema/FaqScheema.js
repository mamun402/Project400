const mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const FaqSchema = mongoose.Schema({
    question: {
        type: "string",
        require: "true",
    },
    answer: {
        type: "string",
        require: "true",
    },
});
FaqSchema.plugin(uniqueValidator);
module.exports = FaqSchema;