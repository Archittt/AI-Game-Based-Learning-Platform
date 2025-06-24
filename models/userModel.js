
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },  
  name: { type: String, required: true, trim: true },
  role: { type: String, default: "user" }, 
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model("User", userSchema);
