const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'lax' });

    res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt }
    });
  } catch (err) {
    console.log('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(`Login attempt for: ${email}`);
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User not found: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log(`User found: ${email}`);
    
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password match: ${isMatch}`);
    
    if (!isMatch) {
      console.log(`Password mismatch for: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000, sameSite: 'lax' }); // 1 hour
    
    console.log(`Login successful for: ${email}`);
    res.json({ 
      message: 'Login successful',
      token: token,
      user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt }
    });
  } catch (err) {
    console.log('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};





const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ id: user._id, name: user.name, email: user.email, createdAt: user.createdAt });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  
  try {
    // Validate new passwords match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Get user from token
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.log('Change password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, profile, logout, changePassword };