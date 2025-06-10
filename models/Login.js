const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  phonenumber: { type: String, required: true },
  currtime: { type: Date, default: Date.now },
  expirytime: { type: Date, default: Date.now, expires: '1h' }, // Expires after 1 hour
  loginstatus: { type: Boolean, default: false },
});

module.exports = mongoose.model('Login', loginSchema);
