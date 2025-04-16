// Import express module
const express = require('express');
// Create the express app
const app = express();
// Define the port
const PORT = 3000;

// Import the database connection
const connectDB = require('./config/db');

// Connect to the database
connectDB();

require('dotenv').config();

// Enable JSON parsing
app.use(express.json());

// Basic route to homepage
app.get('/', (req, res) => {
    res.send('Backend server is running');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);