
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true // This automatically creates a unique index
  },
  name: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'teacher'],
    default: 'student'
  },
  grade: {
    type: Number,
    required: function() { return this.role === 'student'; }
  }
});

module.exports = mongoose.model('User', userSchema);
