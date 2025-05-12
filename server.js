// Import express module
const express = require('express');
// Create the express app
const app = express();
const path = require('path');
// Define the port
const PORT = 3000;

// Import the database connection
const connectDB = require('./config/db');

// Connect to the database
connectDB();

require('dotenv').config();

// Enable JSON parsing
app.use(express.json());

const frontendPath = path.join(__dirname, '..', 'Phishing-Awareness-Prevention-Website.');
app.use(express.static(path.join(frontendPath, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'public', 'views', 'index.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(frontendPath, 'public', 'views', 'signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(frontendPath, 'public', 'views', 'login.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(frontendPath, 'public', 'views', 'profile.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(frontendPath, 'public', 'views', 'contact.html'));
});

app.get('/examples', (req, res) => {
    res.sendFile(path.join(frontendPath, 'public', 'views', 'examples.html'));
});

app.get('/phishing', (req, res) => {
    res.sendFile(path.join(frontendPath, 'public', 'views', 'phishing.html'));
});

app.get('/protection', (req, res) => {
    res.sendFile(path.join(frontendPath, 'public', 'views', 'protection.html'));
});

app.get('/report', (req, res) => {
    res.sendFile(path.join(frontendPath, 'public', 'views', 'report.html'));
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const searchRoutes = require('./routes/search_route');
app.use('/api/reports', searchRoutes);