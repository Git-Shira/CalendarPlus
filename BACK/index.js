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
const allowedOrigins = ['http://localhost:5173', 'https://calendar-plus-virid.vercel.app','https://calendar-plus-shira-prod.vercel.app', 'https://calendar-plus-git-main-shira-prod.vercel.app/'];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); 
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions))

// MongoDB connection setup
connectDB();

// Import and use routes
app.use("/auth", require('./Routes/authRoutes'));
app.use("/events", require('./Routes/eventRoutes'));
app.use("/categories", require('./Routes/categoryRoutes'));

// Start the server and listen on port specified in the environment variable (.env file)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));