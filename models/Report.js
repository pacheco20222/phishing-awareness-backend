const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  url: {
    type: String,
    default: null
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', ReportSchema);