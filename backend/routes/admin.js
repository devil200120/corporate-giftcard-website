const express = require('express');
const { body } = require('express-validator');
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

module.exports = router;