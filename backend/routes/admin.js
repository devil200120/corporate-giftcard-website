const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Coupon = require('../models/Coupon');
const { protect, admin, authorize } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');
const { sendEmail, sendBulkEmail } = require('../utils/sendEmail');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(admin);

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  // Date ranges for calculations
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Get basic counts
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    newUsersThisMonth,
    ordersThisWeek,
    revenueToday,
    pendingOrders,
    lowStockProducts
  ] = await Promise.all([
    User.countDocuments({ role: { $ne: 'super_admin' } }),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: { $in: ['delivered', 'confirmed', 'processing', 'shipped'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),
    User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo },
      role: { $ne: 'super_admin' }
    }),
    Order.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo }
    }),
    Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: oneDayAgo },
          status: { $in: ['delivered', 'confirmed', 'processing', 'shipped'] }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),
    Order.countDocuments({ status: 'pending' }),
    Product.countDocuments({ 
      'inventory.stockQuantity': { $lt: 10 },
      isActive: true
    })
  ]);

  // Calculate growth rates
  const previousMonthUsers = await User.countDocuments({
    createdAt: { 
      $gte: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      $lt: thirtyDaysAgo
    },
    role: { $ne: 'super_admin' }
  });

  const userGrowthRate = previousMonthUsers > 0 
    ? ((newUsersThisMonth - previousMonthUsers) / previousMonthUsers * 100).toFixed(1)
    : 100;

  // Get recent activities
  const recentOrders = await Order.find()
    .populate('customer', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const recentUsers = await User.find({ role: { $ne: 'super_admin' } })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('firstName lastName email createdAt role accountType')
    .lean();

  // Monthly revenue chart data
  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(now.getFullYear(), 0, 1) }, // This year
        status: { $in: ['delivered', 'confirmed', 'processing', 'shipped'] }
      }
    },
    {
      $group: {
        _id: { month: { $month: '$createdAt' } },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { '_id.month': 1 } }
  ]);

  // Top products by sales
  const topProducts = await Order.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalSold: { $sum: '$items.quantity' },
        totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $project: {
        name: '$product.name',
        sku: '$product.sku',
        totalSold: 1,
        totalRevenue: 1
      }
    }
  ]);

  const stats = {
    overview: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      newUsersThisMonth,
      ordersThisWeek,
      revenueToday: revenueToday[0]?.total || 0,
      pendingOrders,
      lowStockProducts,
      userGrowthRate: parseFloat(userGrowthRate)
    },
    charts: {
      monthlyRevenue,
      topProducts
    },
    recentActivity: {
      orders: recentOrders,
      users: recentUsers
    }
  };

  res.json({
    success: true,
    data: stats
  });
});

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate, period = 'month' } = req.query;
  
  let dateFilter = {};
  if (startDate && endDate) {
    dateFilter = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
  } else {
    // Default to last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    dateFilter = { createdAt: { $gte: thirtyDaysAgo } };
  }

  // Sales analytics
  const salesData = await Order.aggregate([
    { $match: { ...dateFilter, status: { $in: ['delivered', 'confirmed', 'processing', 'shipped'] } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: period === 'day' ? { $dayOfMonth: '$createdAt' } : null
        },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 },
        averageOrderValue: { $avg: '$totalAmount' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);

  // User registration analytics
  const userRegistrations = await User.aggregate([
    { $match: { ...dateFilter, role: { $ne: 'super_admin' } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: period === 'day' ? { $dayOfMonth: '$createdAt' } : null
        },
        newUsers: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);

  // Category performance
  const categoryPerformance = await Order.aggregate([
    { $match: { ...dateFilter, status: { $in: ['delivered', 'confirmed', 'processing', 'shipped'] } } },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $lookup: {
        from: 'categories',
        localField: 'product.category',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    {
      $group: {
        _id: '$category._id',
        categoryName: { $first: '$category.name' },
        totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        totalOrders: { $sum: 1 },
        totalQuantity: { $sum: '$items.quantity' }
      }
    },
    { $sort: { totalRevenue: -1 } }
  ]);

  // Customer analytics
  const customerAnalytics = await User.aggregate([
    { $match: { role: 'customer' } },
    {
      $lookup: {
        from: 'orders',
        localField: '_id',
        foreignField: 'customer',
        as: 'orders'
      }
    },
    {
      $addFields: {
        totalOrders: { $size: '$orders' },
        totalSpent: {
          $sum: {
            $map: {
              input: '$orders',
              as: 'order',
              in: '$$order.totalAmount'
            }
          }
        }
      }
    },
    {
      $group: {
        _id: null,
        totalCustomers: { $sum: 1 },
        activeCustomers: {
          $sum: {
            $cond: [{ $gt: ['$totalOrders', 0] }, 1, 0]
          }
        },
        averageOrdersPerCustomer: { $avg: '$totalOrders' },
        averageSpentPerCustomer: { $avg: '$totalSpent' },
        topSpenders: {
          $push: {
            $cond: [
              { $gt: ['$totalSpent', 0] },
              {
                name: { $concat: ['$firstName', ' ', '$lastName'] },
                email: '$email',
                totalSpent: '$totalSpent',
                totalOrders: '$totalOrders'
              },
              '$$REMOVE'
            ]
          }
        }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      salesData,
      userRegistrations,
      categoryPerformance,
      customerAnalytics: customerAnalytics[0] || {}
    }
  });
});

// @desc    Get system health status
// @route   GET /api/admin/system/health
// @access  Private/Admin
const getSystemHealth = asyncHandler(async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date(),
    services: {},
    metrics: {}
  };

  try {
    // Database health
    const dbPing = await User.findOne().select('_id').lean();
    health.services.database = {
      status: dbPing ? 'healthy' : 'unhealthy',
      responseTime: Date.now()
    };

    // Memory usage
    const memUsage = process.memoryUsage();
    health.metrics.memory = {
      used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
      total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
      external: Math.round(memUsage.external / 1024 / 1024) // MB
    };

    // Uptime
    health.metrics.uptime = {
      seconds: process.uptime(),
      formatted: formatUptime(process.uptime())
    };

    // Recent errors (if you implement error logging)
    health.metrics.recentErrors = 0; // Placeholder

    // Overall status
    const allServicesHealthy = Object.values(health.services).every(
      service => service.status === 'healthy'
    );
    health.status = allServicesHealthy ? 'healthy' : 'degraded';

  } catch (error) {
    health.status = 'unhealthy';
    health.error = error.message;
  }

  res.json({
    success: true,
    data: health
  });
});

// @desc    Get audit logs
// @route   GET /api/admin/audit-logs
// @access  Private/Super Admin
const getAuditLogs = asyncHandler(async (req, res) => {
  // This would typically come from a dedicated audit log collection
  // For now, we'll return order and user creation activities as examples
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const activities = [];

  // Recent order activities
  const recentOrders = await Order.find()
    .populate('customer', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  recentOrders.forEach(order => {
    activities.push({
      id: order._id,
      action: 'order_created',
      user: order.customer,
      details: `Order #${order.orderNumber} created`,
      amount: order.totalAmount,
      timestamp: order.createdAt,
      type: 'order'
    });
  });

  // Recent user registrations
  const recentUsers = await User.find({ role: { $ne: 'super_admin' } })
    .sort({ createdAt: -1 })
    .limit(10)
    .select('firstName lastName email createdAt role')
    .lean();

  recentUsers.forEach(user => {
    activities.push({
      id: user._id,
      action: 'user_registered',
      user: user,
      details: `New ${user.role} account created`,
      timestamp: user.createdAt,
      type: 'user'
    });
  });

  // Sort by timestamp
  activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const paginatedActivities = activities.slice(skip, skip + limit);
  const total = activities.length;
  const pages = Math.ceil(total / limit);

  res.json({
    success: true,
    data: paginatedActivities,
    pagination: {
      page,
      limit,
      total,
      pages
    }
  });
});

// @desc    Send system notification to all users
// @route   POST /api/admin/notifications/broadcast
// @access  Private/Super Admin
const broadcastNotification = asyncHandler(async (req, res) => {
  const { subject, message, userType = 'all', urgent = false } = req.body;

  if (!subject || !message) {
    res.status(400);
    throw new Error('Subject and message are required');
  }

  let userFilter = { isActive: true };

  if (userType !== 'all') {
    if (userType === 'customers') {
      userFilter.role = 'customer';
    } else if (userType === 'corporate') {
      userFilter.role = 'corporate_admin';
    }
  }

  const users = await User.find(userFilter).select('email firstName');

  if (users.length === 0) {
    res.status(400);
    throw new Error('No users found matching the criteria');
  }

  const recipients = users.map(user => ({
    email: user.email,
    firstName: user.firstName
  }));

  try {
    const results = await sendBulkEmail(recipients, subject, message);
    
    res.json({
      success: true,
      message: `Notification sent to ${recipients.length} users`,
      data: {
        totalSent: results.filter(r => r.success).length,
        totalFailed: results.filter(r => !r.success).length,
        recipients: recipients.length
      }
    });
  } catch (error) {
    res.status(500);
    throw new Error('Failed to send notifications');
  }
});

// @desc    Export data
// @route   GET /api/admin/export/:type
// @access  Private/Admin
const exportData = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { format = 'json', startDate, endDate } = req.query;

  let data;
  let filename;

  const dateFilter = {};
  if (startDate && endDate) {
    dateFilter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  switch (type) {
    case 'users':
      data = await User.find({ ...dateFilter, role: { $ne: 'super_admin' } })
        .select('-password')
        .lean();
      filename = `users_export_${new Date().toISOString().split('T')[0]}`;
      break;

    case 'orders':
      data = await Order.find(dateFilter)
        .populate('customer', 'firstName lastName email')
        .populate('items.product', 'name sku')
        .lean();
      filename = `orders_export_${new Date().toISOString().split('T')[0]}`;
      break;

    case 'products':
      data = await Product.find(dateFilter)
        .populate('category', 'name')
        .lean();
      filename = `products_export_${new Date().toISOString().split('T')[0]}`;
      break;

    default:
      res.status(400);
      throw new Error('Invalid export type');
  }

  if (format === 'csv') {
    // Convert to CSV (basic implementation)
    const csv = convertToCSV(data);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}.csv`);
    res.send(csv);
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}.json`);
    res.json({
      success: true,
      data,
      exportedAt: new Date(),
      count: data.length
    });
  }
});

// Validation middleware
const broadcastValidation = [
  body('subject')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Subject must be between 3 and 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),
  body('userType')
    .optional()
    .isIn(['all', 'customers', 'corporate'])
    .withMessage('Valid user type is required'),
  body('urgent')
    .optional()
    .isBoolean()
    .withMessage('Urgent flag must be boolean')
];

// @desc    Create new product (Admin)
// @route   POST /api/admin/products
// @access  Private/Admin
const createAdminProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error('Validation failed');
  }

  const {
    name,
    description,
    shortDescription,
    sku,
    price,
    salePrice,
    category,
    brand,
    tags,
    stock,
    lowStockThreshold = 10,
    status = 'active',
    isActive = true,
    isFeatured = false,
    specifications,
    dimensions,
    corporateFeatures
  } = req.body;

  // Generate SKU if not provided
  const productSku = sku || `PROD-${Date.now()}`;

  // Handle images if provided (for FormData)
  let images = [];
  if (req.files && req.files.length > 0) {
    // Handle file uploads here if needed
    // For now, we'll accept image URLs from the body
  }
  
  if (req.body.images) {
    images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
  }

  // Parse JSON fields
  let parsedTags = [];
  if (tags) {
    parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
  }

  let parsedSpecifications = [];
  if (specifications) {
    parsedSpecifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
  }

  let parsedDimensions = {};
  if (dimensions) {
    parsedDimensions = typeof dimensions === 'string' ? JSON.parse(dimensions) : dimensions;
  }

  let parsedCorporateFeatures = {};
  if (corporateFeatures) {
    parsedCorporateFeatures = typeof corporateFeatures === 'string' ? JSON.parse(corporateFeatures) : corporateFeatures;
  }

  const productData = {
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim('-'),
    description,
    shortDescription,
    sku: productSku,
    price: { 
      regular: parseFloat(price),
      ...(salePrice && { sale: parseFloat(salePrice) })
    },
    category,
    brand,
    tags: parsedTags,
    inventory: { 
      stockQuantity: parseInt(stock),
      lowStockThreshold: parseInt(lowStockThreshold)
    },
    images,
    status,
    isActive: Boolean(isActive),
    isFeatured: Boolean(isFeatured),
    ...(parsedSpecifications.length > 0 && { specifications: parsedSpecifications }),
    ...(Object.keys(parsedDimensions).length > 0 && { dimensions: parsedDimensions }),
    ...(Object.keys(parsedCorporateFeatures).length > 0 && { corporateFeatures: parsedCorporateFeatures }),
    createdBy: req.user._id
  };

  const product = await Product.create(productData);
  await product.populate('category', 'name');

  res.status(201).json({
    success: true,
    data: product,
    message: 'Product created successfully'
  });
});

// @desc    Get all products for admin
// @route   GET /api/admin/products
// @access  Private/Admin
const getAllProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    sort = '-createdAt',
    category,
    status,
    search,
    inStock
  } = req.query;

  // Build filter
  let filter = {};
  
  if (category) {
    filter.category = category;
  }
  
  if (status) {
    filter.status = status;
  }
  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (inStock === 'true') {
    filter['inventory.stockQuantity'] = { $gt: 0 };
  } else if (inStock === 'false') {
    filter['inventory.stockQuantity'] = { $lte: 0 };
  }

  const products = await Product.find(filter)
    .populate('category', 'name')
    .populate('createdBy', 'name email')
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Product.countDocuments(filter);

  res.json({
    success: true,
    data: products,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get single product for admin
// @route   GET /api/admin/products/:id
// @access  Private/Admin
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name')
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const {
    name,
    description,
    shortDescription,
    price,
    salePrice,
    category,
    brand,
    tags,
    stock,
    lowStockThreshold,
    status,
    isActive,
    isFeatured,
    specifications,
    dimensions,
    corporateFeatures
  } = req.body;

  // Parse JSON fields
  let parsedTags = product.tags;
  if (tags) {
    parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
  }

  let parsedSpecifications = product.specifications;
  if (specifications) {
    parsedSpecifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
  }

  let parsedDimensions = product.dimensions;
  if (dimensions) {
    parsedDimensions = typeof dimensions === 'string' ? JSON.parse(dimensions) : dimensions;
  }

  let parsedCorporateFeatures = product.corporateFeatures;
  if (corporateFeatures) {
    parsedCorporateFeatures = typeof corporateFeatures === 'string' ? JSON.parse(corporateFeatures) : corporateFeatures;
  }

  // Handle images if provided
  let images = product.images;
  if (req.files && req.files.length > 0) {
    // Handle new file uploads here if needed
  }
  
  if (req.body.images) {
    images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
  }

  const updateData = {
    ...(name && { name }),
    ...(description && { description }),
    ...(shortDescription !== undefined && { shortDescription }),
    ...(category && { category }),
    ...(brand !== undefined && { brand }),
    ...(parsedTags && { tags: parsedTags }),
    ...(status && { status }),
    ...(isActive !== undefined && { isActive: Boolean(isActive) }),
    ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
    ...(parsedSpecifications && { specifications: parsedSpecifications }),
    ...(parsedDimensions && { dimensions: parsedDimensions }),
    ...(parsedCorporateFeatures && { corporateFeatures: parsedCorporateFeatures }),
    images,
    updatedBy: req.user._id
  };

  // Update price
  if (price || salePrice) {
    updateData.price = {
      ...product.price,
      ...(price && { regular: parseFloat(price) }),
      ...(salePrice && { sale: parseFloat(salePrice) })
    };
  }

  // Update inventory
  if (stock || lowStockThreshold) {
    updateData.inventory = {
      ...product.inventory,
      ...(stock && { stockQuantity: parseInt(stock) }),
      ...(lowStockThreshold && { lowStockThreshold: parseInt(lowStockThreshold) })
    };
  }

  // Update slug if name changed
  if (name && name !== product.name) {
    updateData.slug = name.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim('-');
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  ).populate('category', 'name');

  res.json({
    success: true,
    data: updatedProduct,
    message: 'Product updated successfully'
  });
});

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await Product.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// Helper functions
const formatUptime = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  return `${days}d ${hours}h ${minutes}m`;
};

const convertToCSV = (data) => {
  if (!data.length) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
};

// Apply routes
router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalytics);
router.get('/system/health', getSystemHealth);
router.get('/audit-logs', authorize('super_admin'), getAuditLogs);
router.post('/notifications/broadcast', authorize('super_admin'), broadcastValidation, broadcastNotification);
router.get('/export/:type', exportData);

// Product Management Routes
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.post('/products', 
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 200 })
      .withMessage('Product name must be between 2 and 200 characters'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Description must be between 10 and 2000 characters'),
    body('shortDescription')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Short description cannot exceed 500 characters'),
    body('sku')
      .optional()
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage('SKU must be between 3 and 50 characters'),
    body('price')
      .isNumeric()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('salePrice')
      .optional()
      .isNumeric()
      .isFloat({ min: 0 })
      .withMessage('Sale price must be a positive number'),
    body('category')
      .isMongoId()
      .withMessage('Valid category ID is required'),
    body('stock')
      .isNumeric()
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),
    body('lowStockThreshold')
      .optional()
      .isNumeric()
      .isInt({ min: 0 })
      .withMessage('Low stock threshold must be a non-negative integer'),
    body('brand')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Brand name cannot exceed 100 characters'),
    body('status')
      .optional()
      .isIn(['active', 'inactive', 'draft', 'archived'])
      .withMessage('Valid status is required')
  ], 
  createAdminProduct
);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// User Routes
router.get('/users', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      type, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let filter = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (type && type !== 'all') {
      filter.type = type;
    }
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const users = await User.find(filter)
      .select('-password')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.password;
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password').lean();

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update user'
    });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { permanent } = req.query;

    if (permanent === 'true') {
      // Permanent deletion
      const deletedUser = await User.findByIdAndDelete(userId);
      
      if (!deletedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: { _id: userId },
        message: 'User permanently deleted successfully'
      });
    } else {
      // Soft deletion - just deactivate
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { 
          status: 'inactive',
          isActive: false,
          deactivatedAt: new Date(),
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      ).select('-password').lean();

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: updatedUser,
        message: 'User deactivated successfully'
      });
    }
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

// Order Routes
router.get('/orders', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      search,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let filter = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.email': { $regex: search, $options: 'i' } },
        { 'corporateInfo.companyName': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const orders = await Order.find(filter)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name images price')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name images price sku')
      .lean();
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
});

// Category Routes
router.get('/categories', async (req, res) => {
  try {
    const { active = 'all' } = req.query;
    
    let filter = {};
    if (active !== 'all') {
      filter.isActive = active === 'true';
    }

    const categories = await Category.find(filter)
      .sort({ order: 1, name: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

router.get('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).lean();
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category'
    });
  }
});

module.exports = router;