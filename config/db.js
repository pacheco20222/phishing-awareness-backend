const mysql = require('mysql2');
require('dotenv').config();

// Create a connection to MySQL database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,     
    user: process.env.DB_USER,     
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME  
});

// Connect to the database
connection.connect(err => {
    if (err) {
        console.error('Database connection failed: ', err);
        process.exit(1); 
    }
    console.log('Connected to MySQL database!');
});

module.exports = connection;
