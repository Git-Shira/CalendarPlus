// Load environment variables from .env file
require('dotenv').config();

const express = require("express");
const authRoutes = require('./Routes/authRoutes');
const eventRoutes = require('./Routes/eventRoutes');

const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

const connectDB = require("./db");
connectDB();

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));