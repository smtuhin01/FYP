const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Token creator utility
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Signup controller
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password });
    const token = createToken(user._id);
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = createToken(user._id);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Forgot password controller
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No user found' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password.html?token=${token}`;
    await sendEmail(email, 'Password Reset', `Click the link to reset your password: ${resetLink}`);

    res.json({ message: 'Email sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reset password controller
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
