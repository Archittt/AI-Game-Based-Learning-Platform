const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { generateToken } = require('../utils/jwtUtils');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

exports.register = async (req, res) => {
  const { email, password, name, role, grade } = req.body;

  console.log('Register attempt:', { email, name, role, grade });

  if (!email || !password || !name || !role) {
    console.log('Missing required fields:', { email, name, role });
    return res.status(400).json({ success: false, message: 'Name, email, password, and role are required.' });
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      console.log(`Registration failed: Email already registered - ${email}`);
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    console.log(`Salt generated for ${email}`);
    const passwordHash = await bcrypt.hash(password, salt);
    console.log(`Password hashed for ${email}`);

    const newUser = await User.create({
      email: email.toLowerCase().trim(),
      passwordHash,
      name: name.trim(),
      role,
      grade
    });

    console.log(`User registered: ${email}, ID: ${newUser._id}`);

    const token = generateToken({ userId: newUser._id, role: newUser.role });

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      },
      token
    });
  } catch (err) {
    console.error('Register error:', err.message, err.stack);
    if (err.name === 'MongoServerError' && err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: 'Invalid user data.', details: err.message });
    }
    res.status(500).json({ success: false, message: 'Server error.', details: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt:', { email });

  if (!email || !password) {
    console.log('Missing email or password:', { email });
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.log(`Login failed: No user found for email ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      console.log(`Login failed: Incorrect password for email ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken({ userId: user._id, role: user.role });
    console.log(`User logged in: ${email}, ID: ${user._id}`);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err.message, err.stack);
    res.status(500).json({ success: false, message: 'Server error.', details: err.message });
  }
};