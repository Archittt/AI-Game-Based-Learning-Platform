
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },  
  name: { type: String, required: true, trim: true },
  role: { type: String, enum: ['student', 'teacher', 'parent'], required: true }, 
  grade: { type: Number, min: 5, max: 10 }, // For students
  profilePicture: { type: String }, // URL, optional
  createdAt: { type: Date, default: Date.now},
  lastLogin: { type: Date },
  socialId: { type: String },
  parents:    [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // For social logins
  preferences: {
    language: { type: String, default: 'en' },
    accessibility: {
      screenReader: { type: Boolean, default: false },
      highContrast: { type: Boolean, default: false }
    }
  }
}, { timestamps: true });

// Indexes
//userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
