const jwt = require('jsonwebtoken');
const AdminUser = require('../model/AdminUser');
const { asyncHandler } = require('../utils/helpers');

/**
 * @desc    Admin login
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide username and password'
    });
  }

  // Find user
  const user = await AdminUser.findByUsername(username);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check password
  const isMatch = await AdminUser.comparePassword(password, user.password);
  
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    }
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Protected
 */
exports.getMe = asyncHandler(async (req, res) => {
  const user = await AdminUser.findById(req.user.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: user
  });
});

/**
 * @desc    Change password
 * @route   PUT /api/auth/password
 * @access  Protected
 */
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide current and new password'
    });
  }

  const user = await AdminUser.findByUsername(req.user.username);
  
  const isMatch = await AdminUser.comparePassword(currentPassword, user.password);
  
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  await AdminUser.updatePassword(user.id, newPassword);

  res.json({
    success: true,
    message: 'Password updated successfully'
  });
});
