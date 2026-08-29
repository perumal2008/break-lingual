const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  authProvider: { type: String, enum: ['google', 'github', 'email'], required: true },
  providerId: { type: String }, // To store Google/GitHub unique ID
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
