const express = require("express");
const app = express();

app.use(express.json());

const cors = require("cors");
app.use(cors());

const connectDB = require("./db");
connectDB();

const authRoutes = require("./Routes/auth");
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));