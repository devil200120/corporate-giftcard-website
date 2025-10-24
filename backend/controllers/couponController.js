const Coupon = require('../models/Coupon');
const { validationResult } = require('express-validator');
const { createError } = require('../utils/errorHandler');
const mongoose = require('mongoose');

// @desc    Get all coupons (Admin only)
// @route   GET /api/admin/coupons
// @access  Private/Admin
const getCoupons = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      active,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    let filter = {};
    
    if (active !== undefined) {
      filter.isActive = active === 'true';
    }
    
    if (search) {
      filter.$or = [
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const coupons = await Coupon.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Coupon.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: coupons,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single coupon
// @route   GET /api/admin/coupons/:id
// @access  Private/Admin
const getCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid coupon ID', 400));
    }

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return next(createError('Coupon not found', 404));
    }

    res.status(200).json({
      success: true,
      data: coupon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new coupon
// @route   POST /api/admin/coupons
// @access  Private/Admin
const createCoupon = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError('Validation failed', 400, errors.array()));
    }

    const couponData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Generate unique code if not provided
    if (!couponData.code) {
      couponData.code = generateCouponCode();
    } else {
      couponData.code = couponData.code.toUpperCase();
    }

    // Validate date range
    if (new Date(couponData.validFrom) >= new Date(couponData.validUntil)) {
      return next(createError('Valid from date must be before valid until date', 400));
    }

    // Validate discount value
    if (couponData.discountType === 'percentage' && couponData.discountValue > 100) {
      return next(createError('Percentage discount cannot exceed 100%', 400));
    }

    const coupon = await Coupon.create(couponData);

    res.status(201).json({
      success: true,
      data: coupon,
      message: 'Coupon created successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(createError('Coupon code already exists', 400));
    }
    next(error);
  }
};

// @desc    Update coupon
// @route   PUT /api/admin/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError('Validation failed', 400, errors.array()));
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid coupon ID', 400));
    }

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return next(createError('Coupon not found', 404));
    }

    let updateData = { ...req.body };

    // Convert code to uppercase
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
    }

    // Validate date range if dates are being updated
    if (updateData.validFrom || updateData.validUntil) {
      const validFrom = updateData.validFrom ? new Date(updateData.validFrom) : coupon.validFrom;
      const validUntil = updateData.validUntil ? new Date(updateData.validUntil) : coupon.validUntil;
      
      if (validFrom >= validUntil) {
        return next(createError('Valid from date must be before valid until date', 400));
      }
    }

    // Validate discount value
    if (updateData.discountType === 'percentage' && updateData.discountValue > 100) {
      return next(createError('Percentage discount cannot exceed 100%', 400));
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedCoupon,
      message: 'Coupon updated successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(createError('Coupon code already exists', 400));
    }
    next(error);
  }
};

// @desc    Delete coupon
// @route   DELETE /api/admin/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid coupon ID', 400));
    }

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return next(createError('Coupon not found', 404));
    }

    await Coupon.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal = 0, userId } = req.body;

    if (!code) {
      return next(createError('Coupon code is required', 400));
    }

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    });

    if (!coupon) {
      return res.status(200).json({
        success: false,
        valid: false,
        message: 'Invalid or expired coupon code'
      });
    }

    // Check usage limits
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(200).json({
        success: false,
        valid: false,
        message: 'Coupon usage limit exceeded'
      });
    }

    // Check user usage limit
    if (coupon.userUsageLimit && userId) {
      const userUsage = coupon.usedBy.filter(usage => 
        usage.user.toString() === userId
      ).length;
      
      if (userUsage >= coupon.userUsageLimit) {
        return res.status(200).json({
          success: false,
          valid: false,
          message: 'You have exceeded the usage limit for this coupon'
        });
      }
    }

    // Check minimum order value
    if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
      return res.status(200).json({
        success: false,
        valid: false,
        message: `Minimum order value of $${coupon.minOrderValue} required`
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.min(
        (cartTotal * coupon.discountValue) / 100,
        coupon.maxDiscount || Infinity
      );
    } else {
      discountAmount = Math.min(coupon.discountValue, cartTotal);
    }

    res.status(200).json({
      success: true,
      valid: true,
      data: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        maxDiscount: coupon.maxDiscount,
        minOrderValue: coupon.minOrderValue
      },
      message: 'Coupon is valid'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get coupon usage statistics
// @route   GET /api/admin/coupons/:id/stats
// @access  Private/Admin
const getCouponStats = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid coupon ID', 400));
    }

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return next(createError('Coupon not found', 404));
    }

    // Calculate statistics
    const totalUsage = coupon.usedCount;
    const uniqueUsers = [...new Set(coupon.usedBy.map(usage => usage.user.toString()))].length;
    
    // Calculate usage over time (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentUsage = coupon.usedBy.filter(usage => usage.usedAt >= thirtyDaysAgo);
    
    // Group by day
    const usageByDay = {};
    recentUsage.forEach(usage => {
      const day = usage.usedAt.toISOString().split('T')[0];
      usageByDay[day] = (usageByDay[day] || 0) + 1;
    });

    // Calculate total discount given
    const Order = require('../models/Order');
    const orders = await Order.find({
      'appliedCoupon.code': coupon.code
    }).select('appliedCoupon.discountAmount');
    
    const totalDiscountGiven = orders.reduce(
      (sum, order) => sum + (order.appliedCoupon?.discountAmount || 0), 
      0
    );

    res.status(200).json({
      success: true,
      data: {
        coupon: {
          code: coupon.code,
          description: coupon.description,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue
        },
        statistics: {
          totalUsage,
          uniqueUsers,
          usageLimit: coupon.usageLimit,
          remainingUses: coupon.usageLimit ? coupon.usageLimit - totalUsage : null,
          totalDiscountGiven,
          usageByDay,
          recentUsage: recentUsage.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk create coupons
// @route   POST /api/admin/coupons/bulk
// @access  Private/Admin
const bulkCreateCoupons = async (req, res, next) => {
  try {
    const { 
      count = 10, 
      prefix = 'GIFT',
      discountType = 'percentage',
      discountValue = 10,
      validDays = 30,
      usageLimit = 1,
      minOrderValue = 0
    } = req.body;

    if (count > 1000) {
      return next(createError('Cannot create more than 1000 coupons at once', 400));
    }

    const coupons = [];
    const validFrom = new Date();
    const validUntil = new Date(Date.now() + validDays * 24 * 60 * 60 * 1000);

    for (let i = 0; i < count; i++) {
      const code = `${prefix}${generateRandomString(8)}`;
      
      coupons.push({
        code,
        description: `Bulk generated coupon - ${discountValue}${discountType === 'percentage' ? '%' : '$'} off`,
        discountType,
        discountValue,
        validFrom,
        validUntil,
        usageLimit,
        minOrderValue,
        createdBy: req.user.id
      });
    }

    const createdCoupons = await Coupon.insertMany(coupons);

    res.status(201).json({
      success: true,
      data: createdCoupons,
      message: `${count} coupons created successfully`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export coupons
// @route   GET /api/admin/coupons/export
// @access  Private/Admin
const exportCoupons = async (req, res, next) => {
  try {
    const { format = 'json', active } = req.query;

    let filter = {};
    if (active !== undefined) {
      filter.isActive = active === 'true';
    }

    const coupons = await Coupon.find(filter)
      .select('code description discountType discountValue validFrom validUntil usageLimit usedCount isActive')
      .lean();

    if (format === 'csv') {
      const csv = convertToCSV(coupons);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="coupons.csv"');
      res.send(csv);
    } else {
      res.status(200).json({
        success: true,
        data: coupons
      });
    }
  } catch (error) {
    next(error);
  }
};

// Helper functions
const generateCouponCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateRandomString = (length) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const convertToCSV = (data) => {
  const headers = ['Code', 'Description', 'Discount Type', 'Discount Value', 'Valid From', 'Valid Until', 'Usage Limit', 'Used Count', 'Active'];
  const csvContent = [
    headers.join(','),
    ...data.map(coupon => [
      coupon.code,
      `"${coupon.description}"`,
      coupon.discountType,
      coupon.discountValue,
      coupon.validFrom.toISOString().split('T')[0],
      coupon.validUntil.toISOString().split('T')[0],
      coupon.usageLimit || 'Unlimited',
      coupon.usedCount,
      coupon.isActive
    ].join(','))
  ].join('\n');
  
  return csvContent;
};

// Get coupon usage statistics
const getCouponUsage = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return next(createError(404, 'Coupon not found'));
    }

    // Get usage statistics for this coupon
    const usageStats = {
      couponId: coupon._id,
      code: coupon.code,
      totalUsageCount: coupon.usageCount || 0,
      usageLimit: coupon.usageLimit,
      usageLimitPerUser: coupon.usageLimitPerUser,
      remainingUses: coupon.usageLimit ? coupon.usageLimit - (coupon.usageCount || 0) : null,
      usagePercentage: coupon.usageLimit ? ((coupon.usageCount || 0) / coupon.usageLimit * 100).toFixed(2) : null,
      isActive: coupon.isActive,
      validFrom: coupon.validFrom,
      validUntil: coupon.validUntil,
      isExpired: new Date() > new Date(coupon.validUntil),
      discountType: coupon.discountType,
      discountValue: coupon.discountValue
    };

    res.status(200).json({
      success: true,
      data: usageStats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  getCouponStats,
  bulkCreateCoupons,
  exportCoupons,
  getCouponUsage
};