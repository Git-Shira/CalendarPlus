const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    color: {
        type: String
    }
});

module.exports = mongoose.model("Category", CategorySchema);