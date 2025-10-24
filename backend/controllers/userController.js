const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { sendEmail } = require('../utils/sendEmail');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const filter = {};
  
  // Filter by role
  if (req.query.role) {
    filter.role = req.query.role;
  }
  
  // Filter by account type
  if (req.query.accountType) {
    filter.accountType = req.query.accountType;
  }
  
  // Filter by status
  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }
  
  // Search by name or email
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    filter.$or = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { email: searchRegex },
      { 'companyInfo.companyName': searchRegex }
    ];
  }

  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('companyInfo.department', 'name')
    .lean();

  const total = await User.countDocuments(filter);
  const pages = Math.ceil(total / limit);

  res.json({
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages,
      hasNextPage: page < pages,
      hasPrevPage: page > 1
    }
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password')
    .populate('companyInfo.department', 'name description')
    .lean();

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Get user statistics
  const stats = {
    totalOrders: 0,
    totalSpent: 0,
    averageOrderValue: 0,
    lastOrderDate: null
  };

  // You can add order statistics here if needed
  // const orderStats = await Order.aggregate([...]);

  res.json({
    success: true,
    data: {
      ...user,
      statistics: stats
    }
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update allowed fields
  const allowedUpdates = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'role',
    'isActive',
    'isEmailVerified',
    'accountType',
    'companyInfo',
    'address',
    'preferences'
  ];

  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  const updatedUser = await user.save();

  // Remove password from response
  updatedUser.password = undefined;

  res.json({
    success: true,
    message: 'User updated successfully',
    data: updatedUser
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Don't allow deletion of super admin
  if (user.role === 'super_admin') {
    res.status(403);
    throw new Error('Cannot delete super admin user');
  }

  // Soft delete - just deactivate the account
  user.isActive = false;
  user.deletedAt = new Date();
  await user.save();

  res.json({
    success: true,
    message: 'User account deactivated successfully'
  });
});

// @desc    Update user profile (Self)
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update allowed profile fields
  const allowedUpdates = [
    'firstName',
    'lastName',
    'phone',
    'address',
    'preferences',
    'companyInfo'
  ];

  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  // Handle avatar upload if present
  if (req.file) {
    try {
      // Delete old avatar if exists
      if (user.avatar && user.avatar.public_id) {
        await deleteFromCloudinary(user.avatar.public_id);
      }

      // Upload new avatar
      const result = await uploadToCloudinary(req.file.path, {
        folder: 'users/avatars',
        width: 200,
        height: 200,
        crop: 'fill'
      });

      user.avatar = {
        public_id: result.public_id,
        url: result.secure_url
      };
    } catch (error) {
      console.error('Avatar upload error:', error);
      // Continue without failing the entire update
    }
  }

  const updatedUser = await user.save();

  // Remove password from response
  updatedUser.password = undefined;

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser
  });
});

// @desc    Get user profile (Self)
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('companyInfo.department', 'name description')
    .lean();

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    data: user
  });
});

// @desc    Change user password (Self)
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Verify current password
  const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordCorrect) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  // Get user's recent activity, orders, etc.
  const dashboardData = {
    recentOrders: [],
    totalOrders: 0,
    totalSpent: 0,
    savedItems: 0,
    notifications: [],
    recommendations: []
  };

  // You can populate this with actual data from Order, Cart, Wishlist models

  res.json({
    success: true,
    data: dashboardData
  });
});

// @desc    Toggle user status (Admin)
// @route   PATCH /api/users/:id/toggle-status
// @access  Private/Admin
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Don't allow deactivating super admin
  if (user.role === 'super_admin' && user.isActive) {
    res.status(403);
    throw new Error('Cannot deactivate super admin user');
  }

  user.isActive = !user.isActive;
  await user.save();

  // Send notification email
  try {
    await sendEmail({
      email: user.email,
      subject: `Account ${user.isActive ? 'Activated' : 'Deactivated'}`,
      message: `Your account has been ${user.isActive ? 'activated' : 'deactivated'} by an administrator.`
    });
  } catch (error) {
    console.error('Failed to send status change email:', error);
  }

  res.json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    data: {
      _id: user._id,
      isActive: user.isActive
    }
  });
});

// @desc    Get user activity log
// @route   GET /api/users/:id/activity
// @access  Private/Admin
const getUserActivity = asyncHandler(async (req, res) => {
  // This would typically fetch from an activity/audit log collection
  const activities = [
    {
      action: 'login',
      timestamp: new Date(),
      details: 'User logged in',
      ipAddress: req.ip
    }
    // Add more activity tracking as needed
  ];

  res.json({
    success: true,
    data: activities
  });
});

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateProfile,
  getProfile,
  changePassword,
  getDashboardData,
  toggleUserStatus,
  getUserActivity
};