const Report = require('../models/Report');

const checkReport = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ msg: 'Query is required' });
  }

  try {
    const report = await Report.findOne({
      $or: [
        { subject: { $regex: query, $options: 'i' } },
        { url: { $regex: query, $options: 'i' } }
      ]
    });

    if (report) {
      return res.json({ found: true, report });
    } else {
      return res.json({ found: false });
    }
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

module.exports = { checkReport };