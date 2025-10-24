const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { sendEmail } = require('../utils/sendEmail');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '90d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map(error => error.msg).join(', '));
  }

  const { firstName, lastName, email, password, phone } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  // Check if phone already exists
  const phoneExists = await User.findOne({ phone });
  if (phoneExists) {
    res.status(400);
    throw new Error('User with this phone number already exists');
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone
  });

  if (user) {
    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');
    user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save({ validateBeforeSave: false });

    // Send verification email
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
      const message = `
        <h2>Welcome to Corporate Gifting Platform!</h2>
        <p>Thank you for registering with us. Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
      `;

      await sendEmail({
        email: user.email,
        subject: 'Email Verification - Corporate Gifting Platform',
        message
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
    }

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification.',
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          avatar: user.avatar
        },
        token,
        refreshToken
      }
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map(error => error.msg).join(', '));
  }

  const { email, password } = req.body;

  // Find user by email and include password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Check if account is locked
  if (user.isLocked) {
    res.status(423);
    throw new Error('Account is temporarily locked due to multiple failed login attempts');
  }

  // Check if account is active
  if (!user.isActive) {
    res.status(401);
    throw new Error('Account is deactivated. Please contact support.');
  }

  // Check password
  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    // Increment login attempts
    await user.incLoginAttempts();
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Reset login attempts on successful login
  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        avatar: user.avatar,
        corporateDetails: user.corporateDetails
      },
      token,
      refreshToken
    }
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  // In a real application, you might want to blacklist the token
  // For now, we'll just send a success response
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name images price');

  res.json({
    success: true,
    data: {
      user
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { firstName, lastName, phone, addresses } = req.body;

  // Update basic fields
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (phone) user.phone = phone;
  if (addresses) user.addresses = addresses;

  // Handle avatar upload
  if (req.file) {
    try {
      // Delete old avatar if exists
      if (user.avatar && user.avatar.public_id) {
        await deleteFromCloudinary(user.avatar.public_id);
      }

      // Upload new avatar
      const result = await uploadToCloudinary(req.file.path, {
        folder: 'corporate-gifting/avatars',
        width: 300,
        height: 300,
        crop: 'fill',
        quality: 'auto'
      });

      user.avatar = {
        public_id: result.public_id,
        url: result.secure_url
      };
    } catch (error) {
      console.error('Avatar upload error:', error);
      res.status(400);
      throw new Error('Error uploading avatar');
    }
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        addresses: updatedUser.addresses
      }
    }
  });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map(error => error.msg).join(', '));
  }

  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  const isCurrentPasswordMatch = await user.matchPassword(currentPassword);
  if (!isCurrentPasswordMatch) {
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

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map(error => error.msg).join(', '));
  }

  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found with this email');
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.passwordResetExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save({ validateBeforeSave: false });

  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `
      <h2>Password Reset Request</h2>
      <p>You have requested a password reset. Please click the link below to reset your password:</p>
      <a href="${resetUrl}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p>${resetUrl}</p>
      <p>This link will expire in 10 minutes.</p>
      <p>If you did not request this reset, please ignore this email.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request - Corporate Gifting Platform',
      message
    });

    res.json({
      success: true,
      message: 'Password reset email sent successfully'
    });
  } catch (error) {
    console.error('Error sending reset email:', error);
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error('Email could not be sent');
  }
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map(error => error.msg).join(', '));
  }

  const { token, password } = req.body;

  // Hash the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }

  // Set new password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;

  await user.save();

  res.json({
    success: true,
    message: 'Password reset successful'
  });
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpire: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired verification token');
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;

  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    message: 'Email verified successfully'
  });
});

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Private
const resendVerificationEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.isEmailVerified) {
    res.status(400);
    throw new Error('Email is already verified');
  }

  // Generate new verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  user.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  await user.save({ validateBeforeSave: false });

  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    const message = `
      <h2>Email Verification</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p>${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: 'Email Verification - Corporate Gifting Platform',
      message
    });

    res.json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500);
    throw new Error('Email could not be sent');
  }
});

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401);
    throw new Error('Refresh token is required');
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      res.status(401);
      throw new Error('Invalid refresh token');
    }

    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    res.status(401);
    throw new Error('Invalid refresh token');
  }
});

// @desc    Register corporate user
// @route   POST /api/auth/corporate/register
// @access  Public
const corporateRegistration = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map(error => error.msg).join(', '));
  }

  const { 
    firstName, 
    lastName, 
    email, 
    password, 
    phone,
    companyName,
    companyEmail,
    companyPhone,
    gstNumber,
    panNumber,
    designation,
    department
  } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ 
    $or: [{ email }, { phone }] 
  });
  
  if (userExists) {
    res.status(400);
    throw new Error('User with this email or phone already exists');
  }

  // Create corporate user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    role: 'customer', // Will be upgraded to corporate_admin after approval
    corporateDetails: {
      companyName,
      companyEmail,
      companyPhone,
      gstNumber,
      panNumber,
      designation,
      department,
      isApproved: false
    }
  });

  if (user) {
    // Send notification to admin about new corporate registration
    try {
      const message = `
        <h2>New Corporate Registration</h2>
        <p>A new corporate user has registered and is pending approval:</p>
        <ul>
          <li><strong>Name:</strong> ${firstName} ${lastName}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Company:</strong> ${companyName}</li>
          <li><strong>Designation:</strong> ${designation}</li>
        </ul>
        <p>Please review and approve the registration in the admin panel.</p>
      `;

      await sendEmail({
        email: process.env.ADMIN_EMAIL,
        subject: 'New Corporate Registration - Approval Required',
        message
      });
    } catch (error) {
      console.error('Error sending admin notification:', error);
    }

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Corporate registration successful. Your account is pending approval.',
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          corporateDetails: user.corporateDetails
        },
        token,
        refreshToken
      }
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Approve corporate account
// @route   PUT /api/auth/corporate/approve/:userId
// @access  Private/Admin
const approveCorporateAccount = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { approved, approvalLimit } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!user.corporateDetails) {
    res.status(400);
    throw new Error('User is not a corporate account');
  }

  user.corporateDetails.isApproved = approved;
  user.corporateDetails.approvedBy = req.user._id;
  user.corporateDetails.approvedAt = new Date();
  
  if (approved) {
    user.role = 'corporate_admin';
    user.corporateDetails.approvalLimit = approvalLimit || 100000; // Default limit
  }

  await user.save();

  // Send email notification to user
  try {
    const message = approved
      ? `
        <h2>Corporate Account Approved!</h2>
        <p>Congratulations! Your corporate account has been approved.</p>
        <p>You now have access to corporate features including bulk ordering and special pricing.</p>
        <p>Your approval limit is ₹${user.corporateDetails.approvalLimit.toLocaleString()}</p>
      `
      : `
        <h2>Corporate Account Application</h2>
        <p>Thank you for your application. Unfortunately, your corporate account application has not been approved at this time.</p>
        <p>Please contact our support team for more information.</p>
      `;

    await sendEmail({
      email: user.email,
      subject: `Corporate Account ${approved ? 'Approved' : 'Update'} - Corporate Gifting Platform`,
      message
    });
  } catch (error) {
    console.error('Error sending approval email:', error);
  }

  res.json({
    success: true,
    message: `Corporate account ${approved ? 'approved' : 'rejected'} successfully`,
    data: {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        corporateDetails: user.corporateDetails
      }
    }
  });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  refreshToken,
  corporateRegistration,
  approveCorporateAccount
};