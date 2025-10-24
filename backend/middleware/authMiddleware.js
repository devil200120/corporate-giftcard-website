const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Protect routes - require authentication
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      if (!req.user.isActive) {
        res.status(401);
        throw new Error('Account is deactivated');
      }

      if (req.user.isLocked) {
        res.status(401);
        throw new Error('Account is temporarily locked');
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Admin middleware - require super_admin role
const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'super_admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Access denied. Admin privileges required.');
  }
});

// Corporate admin middleware - require corporate_admin or super_admin role
const corporateAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && (req.user.role === 'corporate_admin' || req.user.role === 'super_admin')) {
    next();
  } else {
    res.status(403);
    throw new Error('Access denied. Corporate admin privileges required.');
  }
});

// Role-based access control middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Access denied. Authentication required.');
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Access denied. Role '${req.user.role}' is not authorized for this resource.`);
    }

    next();
  };
};

// Check if user owns the resource or is admin
const ownerOrAdmin = (resourceUserField = 'user') => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Access denied. Authentication required.');
    }

    // Super admins can access any resource
    if (req.user.role === 'super_admin') {
      return next();
    }

    // Get the resource ID from params or body
    const resourceId = req.params.id || req.body.id;
    
    if (!resourceId) {
      res.status(400);
      throw new Error('Resource ID is required');
    }

    // For user resources, check if user is accessing their own data
    if (resourceUserField === 'user' && resourceId === req.user._id.toString()) {
      return next();
    }

    // For other resources, you might need to fetch the resource and check ownership
    // This is a simplified version - implement based on your specific needs
    res.status(403);
    throw new Error('Access denied. You can only access your own resources.');
  });
};

// Corporate features access control
const corporateAccess = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Access denied. Authentication required.');
  }

  // Check if user has corporate details and is approved
  if (!req.user.corporateDetails || !req.user.corporateDetails.isApproved) {
    res.status(403);
    throw new Error('Access denied. Corporate account approval required.');
  }

  next();
});

// Rate limiting for sensitive operations
const sensitiveOperation = asyncHandler(async (req, res, next) => {
  // Additional checks for sensitive operations like password reset, order cancellation, etc.
  
  // Check if user has exceeded attempts for sensitive operations
  const userAttempts = req.user.loginAttempts || 0;
  
  if (userAttempts >= 3) {
    res.status(429);
    throw new Error('Too many attempts. Please try again later.');
  }

  next();
});

// Email verification middleware
const emailVerified = asyncHandler(async (req, res, next) => {
  if (!req.user.isEmailVerified) {
    res.status(403);
    throw new Error('Email verification required. Please verify your email address.');
  }
  
  next();
});

// Optional authentication - don't throw error if no token
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      console.log('Optional auth failed:', error.message);
    }
  }

  next();
});

module.exports = {
  protect,
  admin,
  corporateAdmin,
  authorize,
  ownerOrAdmin,
  corporateAccess,
  sensitiveOperation,
  emailVerified,
  optionalAuth
};