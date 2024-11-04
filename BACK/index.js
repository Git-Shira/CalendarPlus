// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require("cors");

const connectDB = require("./db");


// Initialize Express application
const app = express();
// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse cookies
app.use(cookieParser());

// CORS configuration to allow specific origins and enable credentials
const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true, 
};
app.use(cors(corsOptions))

// MongoDB connection setup
connectDB();

// Import and use routes
app.use("/auth",  require('./Routes/authRoutes'));
app.use("/events", require('./Routes/eventRoutes'));

// Start the server and listen on port specified in the environment variable (.env file)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));