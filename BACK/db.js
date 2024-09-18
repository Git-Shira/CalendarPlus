const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://shirae447:sjxKo9q1nX2v9JXR@cluster0.ophzvwk.mongodb.net/",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    );
    console.log("MongoDB connection SUCCESS");
  } catch (err) {
    console.error("MongoDB connection FAIL");
    process.exit(1);
  }
};

module.exports = connectDB;