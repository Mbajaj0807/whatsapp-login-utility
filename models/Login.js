const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  phonenumber: { type: String, required: true },
  used: { type: Boolean, default: false },
});

module.exports = mongoose.model('Login', loginSchema);
