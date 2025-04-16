const mongoose = require('mongoose');

// Define the schema for the users collection
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  second_name: {
    type: String,
    default: null
  },

  last_name: {
    type: String,
    required: true
  },

  second_lastname: {
    type: String,
    default: null
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  phone_number: {
    type: String,
    required: true,
    unique: true
  },

  country: {
    type: String,
    required: true
  },

  job: {
    type: String,
    required: true
  },

  two_factor_secret: {
    type: String,
    default: null
  },

  two_factor_enabled: {
    type: Boolean,
    default: false
  }
  
}, {
  timestamps: true 
});


module.exports = mongoose.model('User', UserSchema);
