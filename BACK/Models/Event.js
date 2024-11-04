const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    title: {
        type: String,
        require: true
    },
    start: {
        type: Date,
        require: true
    },
    end: {
        type: Date,
        require: true
    },
    location: String,
    description: String,
    color: String,
});

module.exports = mongoose.model("Event", EventSchema);