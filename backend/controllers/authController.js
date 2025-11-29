const User = require('../models/User');
const Business = require('../models/Business');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, msg: 'User already exists' });
    }

    // Create user
    user = await User.create({
      name,
      email,
      password,
      role,
    });

    // Create a corresponding business profile
    const business = await Business.create({
      owner: user._id,
      companyName: `${name}'s Business`, // Default company name
      botConfiguration: {},
      subscription: {},
    });

    // Link the business to the user
    user.business = business._id;
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({ success: false, msg: 'Please provide an email and password' });
  }

  // Check for user and populate their business data
  const user = await User.findOne({ email }).select('+password').populate('business');

  if (!user) {
    return res.status(401).json({ success: false, msg: 'Invalid credentials' });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({ success: false, msg: 'Invalid credentials' });
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
  });
};
