const mongoose = require('mongoose');

// Create the schema for the MongoDB collection
const responseSchema = new mongoose.Schema({
    questionNumber: {
        type: Number,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Response', responseSchema);