const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Coupon = require('../models/Coupon');
const { sendEmail, sendBulkEmail } = require('../utils/sendEmail');

// @desc    Get corporate dashboard analytics
// @route   GET /api/corporate/dashboard
// @access  Private/Corporate Admin
const getCorporateDashboard = asyncHandler(async (req, res) => {
  const companyId = req.user.companyInfo?.companyId;
  
  if (!companyId) {
    res.status(400);
    throw new Error('Corporate company ID not found');
  }

  // Get company employees
  const employees = await User.find({
    'companyInfo.companyId': companyId,
    isActive: true
  }).select('firstName lastName email role department createdAt');

  // Get company orders
  const orders = await Order.find({
    'customer': { $in: employees.map(emp => emp._id) }
  }).populate('items.product', 'name price');

  // Calculate analytics
  const analytics = {
    totalEmployees: employees.length,
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0,
    pendingOrders: orders.filter(order => order.status === 'pending').length,
    monthlySpend: calculateMonthlySpend(orders),
    topCategories: await getTopCategoriesByCompany(companyId),
    recentOrders: orders.slice(-5).reverse()
  };

  res.json({
    success: true,
    data: {
      analytics,
      employees: employees.slice(0, 10), // Return first 10 employees
      recentOrders: analytics.recentOrders
    }
  });
});

// @desc    Get company employees
// @route   GET /api/corporate/employees
// @access  Private/Corporate Admin
const getCompanyEmployees = asyncHandler(async (req, res) => {
  const companyId = req.user.companyInfo?.companyId;
  
  if (!companyId) {
    res.status(400);
    throw new Error('Corporate company ID not found');
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {
    'companyInfo.companyId': companyId
  };

  // Filter by department
  if (req.query.department) {
    filter['companyInfo.department'] = req.query.department;
  }

  // Filter by status
  if (req.query.status) {
    filter.isActive = req.query.status === 'active';
  }

  // Search by name or email
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    filter.$or = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { email: searchRegex }
    ];
  }

  const employees = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(filter);
  const pages = Math.ceil(total / limit);

  res.json({
    success: true,
    data: employees,
    pagination: {
      page,
      limit,
      total,
      pages
    }
  });
});

// @desc    Get company orders
// @route   GET /api/corporate/orders
// @access  Private/Corporate Admin
const getCompanyOrders = asyncHandler(async (req, res) => {
  const companyId = req.user.companyInfo?.companyId;
  
  if (!companyId) {
    res.status(400);
    throw new Error('Corporate company ID not found');
  }

  // Get all company employees
  const employees = await User.find({
    'companyInfo.companyId': companyId
  }).select('_id');

  const employeeIds = employees.map(emp => emp._id);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {
    customer: { $in: employeeIds }
  };

  // Filter by status
  if (req.query.status) {
    filter.status = req.query.status;
  }

  // Filter by date range
  if (req.query.startDate && req.query.endDate) {
    filter.createdAt = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }

  const orders = await Order.find(filter)
    .populate('customer', 'firstName lastName email')
    .populate('items.product', 'name sku price')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(filter);
  const pages = Math.ceil(total / limit);

  res.json({
    success: true,
    data: orders,
    pagination: {
      page,
      limit,
      total,
      pages
    }
  });
});

// @desc    Approve/Reject corporate order
// @route   PATCH /api/corporate/orders/:id/approve
// @access  Private/Corporate Admin
const approveOrder = asyncHandler(async (req, res) => {
  const { approved, notes } = req.body;
  
  const order = await Order.findById(req.params.id)
    .populate('customer', 'firstName lastName email companyInfo');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Verify order belongs to the same company
  const companyId = req.user.companyInfo?.companyId;
  if (order.customer.companyInfo?.companyId !== companyId) {
    res.status(403);
    throw new Error('Not authorized to approve this order');
  }

  // Update approval status
  order.corporateApproval = {
    status: approved ? 'approved' : 'rejected',
    approvedBy: req.user._id,
    approvedAt: new Date(),
    notes
  };

  if (approved) {
    order.status = 'confirmed';
  } else {
    order.status = 'cancelled';
  }

  await order.save();

  // Send notification email to customer
  try {
    await sendEmail({
      email: order.customer.email,
      subject: `Order ${approved ? 'Approved' : 'Rejected'} - #${order.orderNumber}`,
      message: `Your order #${order.orderNumber} has been ${approved ? 'approved' : 'rejected'} by your corporate administrator. ${notes || ''}`
    });
  } catch (error) {
    console.error('Failed to send approval notification:', error);
  }

  res.json({
    success: true,
    message: `Order ${approved ? 'approved' : 'rejected'} successfully`,
    data: order
  });
});

// @desc    Get corporate spending reports
// @route   GET /api/corporate/reports/spending
// @access  Private/Corporate Admin
const getSpendingReports = asyncHandler(async (req, res) => {
  const companyId = req.user.companyInfo?.companyId;
  
  if (!companyId) {
    res.status(400);
    throw new Error('Corporate company ID not found');
  }

  // Get company employees
  const employees = await User.find({
    'companyInfo.companyId': companyId
  }).select('_id firstName lastName companyInfo.department');

  const employeeIds = employees.map(emp => emp._id);

  // Get date range from query or default to last 6 months
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(endDate.getMonth() - 6);

  const orders = await Order.find({
    customer: { $in: employeeIds },
    createdAt: { $gte: startDate, $lte: endDate },
    status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
  }).populate('items.product', 'name category');

  // Generate reports
  const reports = {
    totalSpending: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    monthlySpending: generateMonthlyReport(orders),
    departmentSpending: generateDepartmentReport(orders, employees),
    categorySpending: generateCategoryReport(orders),
    employeeSpending: generateEmployeeReport(orders, employees),
    averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0
  };

  res.json({
    success: true,
    data: reports,
    dateRange: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }
  });
});

// @desc    Manage corporate settings
// @route   PUT /api/corporate/settings
// @access  Private/Corporate Admin
const updateCorporateSettings = asyncHandler(async (req, res) => {
  const companyId = req.user.companyInfo?.companyId;
  
  if (!companyId) {
    res.status(400);
    throw new Error('Corporate company ID not found');
  }

  const user = await User.findById(req.user._id);

  // Update corporate settings
  const allowedSettings = [
    'approvalRequired',
    'budgetLimits',
    'allowedCategories',
    'notifications',
    'billingInfo'
  ];

  allowedSettings.forEach(setting => {
    if (req.body[setting] !== undefined) {
      if (!user.companyInfo.settings) {
        user.companyInfo.settings = {};
      }
      user.companyInfo.settings[setting] = req.body[setting];
    }
  });

  await user.save();

  res.json({
    success: true,
    message: 'Corporate settings updated successfully',
    data: user.companyInfo.settings
  });
});

// @desc    Send bulk notification to employees
// @route   POST /api/corporate/notify
// @access  Private/Corporate Admin
const sendEmployeeNotification = asyncHandler(async (req, res) => {
  const { subject, message, targetDepartments, targetEmployees } = req.body;
  const companyId = req.user.companyInfo?.companyId;

  if (!companyId) {
    res.status(400);
    throw new Error('Corporate company ID not found');
  }

  let filter = {
    'companyInfo.companyId': companyId,
    isActive: true
  };

  // Filter by departments if specified
  if (targetDepartments && targetDepartments.length > 0) {
    filter['companyInfo.department'] = { $in: targetDepartments };
  }

  // Filter by specific employees if specified
  if (targetEmployees && targetEmployees.length > 0) {
    filter._id = { $in: targetEmployees };
  }

  const employees = await User.find(filter).select('email firstName lastName');

  if (employees.length === 0) {
    res.status(400);
    throw new Error('No employees found matching the criteria');
  }

  // Send bulk emails
  const recipients = employees.map(emp => ({
    email: emp.email,
    firstName: emp.firstName
  }));

  try {
    const results = await sendBulkEmail(recipients, subject, message);
    
    res.json({
      success: true,
      message: `Notification sent to ${employees.length} employees`,
      data: {
        totalSent: results.filter(r => r.success).length,
        totalFailed: results.filter(r => !r.success).length,
        recipients: employees.length
      }
    });
  } catch (error) {
    res.status(500);
    throw new Error('Failed to send notifications');
  }
});

// Helper functions
const calculateMonthlySpend = (orders) => {
  const monthlyData = {};
  orders.forEach(order => {
    const month = order.createdAt.toISOString().slice(0, 7); // YYYY-MM
    monthlyData[month] = (monthlyData[month] || 0) + order.totalAmount;
  });
  return monthlyData;
};

const getTopCategoriesByCompany = async (companyId) => {
  // This would require aggregation pipeline to get top categories
  // Simplified version for now
  return [];
};

const generateMonthlyReport = (orders) => {
  const monthly = {};
  orders.forEach(order => {
    const month = order.createdAt.toISOString().slice(0, 7);
    monthly[month] = (monthly[month] || 0) + order.totalAmount;
  });
  return monthly;
};

const generateDepartmentReport = (orders, employees) => {
  const departmentMap = {};
  employees.forEach(emp => {
    departmentMap[emp._id.toString()] = emp.companyInfo?.department || 'Unknown';
  });

  const departmentSpending = {};
  orders.forEach(order => {
    const department = departmentMap[order.customer.toString()] || 'Unknown';
    departmentSpending[department] = (departmentSpending[department] || 0) + order.totalAmount;
  });

  return departmentSpending;
};

const generateCategoryReport = (orders) => {
  const categorySpending = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      const category = item.product?.category || 'Uncategorized';
      const amount = item.price * item.quantity;
      categorySpending[category] = (categorySpending[category] || 0) + amount;
    });
  });
  return categorySpending;
};

const generateEmployeeReport = (orders, employees) => {
  const employeeMap = {};
  employees.forEach(emp => {
    employeeMap[emp._id.toString()] = {
      name: `${emp.firstName} ${emp.lastName}`,
      department: emp.companyInfo?.department || 'Unknown',
      spending: 0,
      orderCount: 0
    };
  });

  orders.forEach(order => {
    const empId = order.customer.toString();
    if (employeeMap[empId]) {
      employeeMap[empId].spending += order.totalAmount;
      employeeMap[empId].orderCount += 1;
    }
  });

  return Object.values(employeeMap).sort((a, b) => b.spending - a.spending);
};

module.exports = {
  getCorporateDashboard,
  getCompanyEmployees,
  getCompanyOrders,
  approveOrder,
  getSpendingReports,
  updateCorporateSettings,
  sendEmployeeNotification
};