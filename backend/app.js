const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const router = require('./routes/');
require("dotenv").config();
const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
// app.use('/api/fetchpatients', fetchPatients);
app.use("/", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));