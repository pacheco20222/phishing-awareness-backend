// Routes related to phishing report submissions and lookups

// Import necessary modules and middleware
const express = require('express');
const router = express.Router();

// Report model to interact with MongoDB
const Report = require('../models/Report'); 

// Controller function to check if a report already exists
const { checkReport } = require('../controllers/reportController');

// Middleware to verify JWT tokens for protected routes
const verifyToken = require('../middleware/verifyToken');

// Public route to search if a phishing report already exists
router.get('/check', checkReport);

// Protected route to submit a new phishing report
router.post('/create', verifyToken, async (req, res) => {
  // Ensure required fields are present
  const { subject, details, url } = req.body;

  if (!subject || !details) {
    return res.status(400).json({ msg: 'Subject and details are required.' });
  }

  try {
    // Prevent duplicate reports by checking existing subject or URL
    const duplicate = await Report.findOne({
      $or: [
        { subject: { $regex: `^${subject}$`, $options: 'i' } },
        { url: { $regex: `^${url}$`, $options: 'i' } }
      ]
    });

    if (duplicate) {
      return res.status(409).json({ msg: 'This report already exists in our system.' });
    }

    // Create and save the new report document
    const newReport = new Report({
      subject,
      details,
      url: url || null,
      user_id: req.user.id
    });

    await newReport.save();
    res.status(201).json({ msg: 'Phishing report submitted successfully.' });
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// Export the router for use in server.js
module.exports = router;