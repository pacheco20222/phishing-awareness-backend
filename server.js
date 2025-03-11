// Import express module
const express = require('express');
// Create the express app
const app = express();
// Define the port
const PORT = 3000;

// Enable JSON parsing
app.use(express.json());

// Basic route to homepage
app.get('/', (req, res) => {
    res.send('Backend server is running');
});

app.get('/api/protection-tips', (req, res) => {
    const tips = [
        { id: 1, tip: 'Never click on links in emails from unknown sources' },
        { id: 2, tip: 'Check the URL of the website before entering any sensitive information' },
        { id: 3, tip: 'Use a password manager to store and generate secure passwords' },
        { id: 4, tip: 'Enable two-factor authentication for your accounts' },
        { id: 5, tip: 'Keep your software up to date' }
    ]
    res.json(tips);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});