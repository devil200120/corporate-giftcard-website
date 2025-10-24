import api from './api';

const adminAPI = {
  // Dashboard & Analytics
  getDashboardStats: (params = {}) => {
    return api.get('/admin/dashboard/stats', { params });
  },

  getAnalyticsData: (params = {}) => {
    return api.get('/admin/analytics', { params });
  },

  // User Management
  getAllUsers: (params = {}) => {
    return api.get('/admin/users', { params });
  },

  getUserById: (userId) => {
    return api.get(`/admin/users/${userId}`);
  },

  createUser: (userData) => {
    return api.post('/admin/users', userData);
  },

  updateUser: (userId, userData) => {
    return api.put(`/admin/users/${userId}`, userData);
  },

  deleteUser: (userId) => {
    return api.delete(`/admin/users/${userId}`);
  },

  updateUserStatus: (userId, status) => {
    return api.put(`/admin/users/${userId}/status`, { status });
  },

  resetUserPassword: (userId) => {
    return api.post(`/admin/users/${userId}/reset-password`);
  },

  getUserActivity: (userId, params = {}) => {
    return api.get(`/admin/users/${userId}/activity`, { params });
  },

  exportUsers: (format = 'csv') => {
    return api.get(`/admin/users/export/${format}`, { responseType: 'blob' });
  },

  // Product Management
  getAllProducts: (params = {}) => {
    return api.get('/admin/products', { params });
  },

  getProductById: (productId) => {
    return api.get(`/admin/products/${productId}`);
  },

  createProduct: (productData) => {
    return api.post('/admin/products', productData);
  },

  updateProduct: (productId, productData) => {
    return api.put(`/admin/products/${productId}`, productData);
  },

  deleteProduct: (productId) => {
    return api.delete(`/admin/products/${productId}`);
  },

  updateProductStatus: (productId, status) => {
    return api.put(`/admin/products/${productId}/status`, { status });
  },

  bulkUpdateProducts: (updateData) => {
    return api.put('/admin/products/bulk-update', updateData);
  },

  importProducts: (formData) => {
    return api.post('/admin/products/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportProducts: (format = 'csv') => {
    return api.get(`/admin/products/export/${format}`, { responseType: 'blob' });
  },

  // Order Management
  getAllOrders: (params = {}) => {
    return api.get('/admin/orders', { params });
  },

  getOrderById: (orderId) => {
    return api.get(`/admin/orders/${orderId}`);
  },

  updateOrderStatus: (orderId, statusData) => {
    return api.put(`/admin/orders/${orderId}/status`, statusData);
  },

  processRefund: (orderId, refundData) => {
    return api.post(`/admin/orders/${orderId}/refund`, refundData);
  },

  getOrderAnalytics: (params = {}) => {
    return api.get('/admin/orders/analytics', { params });
  },

  exportOrders: (params = {}) => {
    return api.get('/admin/orders/export', { params, responseType: 'blob' });
  },

  // Category Management
  getAllCategories: () => {
    return api.get('/admin/categories');
  },

  getCategoryById: (categoryId) => {
    return api.get(`/admin/categories/${categoryId}`);
  },

  createCategory: (categoryData) => {
    return api.post('/admin/categories', categoryData);
  },

  updateCategory: (categoryId, categoryData) => {
    return api.put(`/admin/categories/${categoryId}`, categoryData);
  },

  deleteCategory: (categoryId) => {
    return api.delete(`/admin/categories/${categoryId}`);
  },

  reorderCategories: (orderData) => {
    return api.put('/admin/categories/reorder', orderData);
  },

  // Coupon Management
  getAllCoupons: (params = {}) => {
    return api.get('/admin/coupons', { params });
  },

  getCouponById: (couponId) => {
    return api.get(`/admin/coupons/${couponId}`);
  },

  createCoupon: (couponData) => {
    return api.post('/admin/coupons', couponData);
  },

  updateCoupon: (couponId, couponData) => {
    return api.put(`/admin/coupons/${couponId}`, couponData);
  },

  deleteCoupon: (couponId) => {
    return api.delete(`/admin/coupons/${couponId}`);
  },

  getCouponUsage: (couponId, params = {}) => {
    return api.get(`/admin/coupons/${couponId}/usage`, { params });
  },

  // Corporate Account Management
  getCorporateAccounts: (params = {}) => {
    return api.get('/admin/corporate-accounts', { params });
  },

  getCorporateAccountById: (accountId) => {
    return api.get(`/admin/corporate-accounts/${accountId}`);
  },

  approveCorporateAccount: (accountId, approvalData) => {
    return api.post(`/admin/corporate-accounts/${accountId}/approve`, approvalData);
  },

  rejectCorporateAccount: (accountId, rejectionData) => {
    return api.post(`/admin/corporate-accounts/${accountId}/reject`, rejectionData);
  },

  updateCorporateAccount: (accountId, accountData) => {
    return api.put(`/admin/corporate-accounts/${accountId}`, accountData);
  },

  // Inventory Management
  getInventoryReport: (params = {}) => {
    return api.get('/admin/inventory/report', { params });
  },

  updateInventory: (productId, inventoryData) => {
    return api.put(`/admin/inventory/${productId}`, inventoryData);
  },

  getLowStockAlerts: () => {
    return api.get('/admin/inventory/low-stock-alerts');
  },

  getInventoryMovements: (params = {}) => {
    return api.get('/admin/inventory/movements', { params });
  },

  // Financial Reports
  getSalesReport: (params = {}) => {
    return api.get('/admin/reports/sales', { params });
  },

  getRevenueReport: (params = {}) => {
    return api.get('/admin/reports/revenue', { params });
  },

  getProfitReport: (params = {}) => {
    return api.get('/admin/reports/profit', { params });
  },

  getTaxReport: (params = {}) => {
    return api.get('/admin/reports/tax', { params });
  },

  // Content Management
  getBanners: () => {
    return api.get('/admin/banners');
  },

  createBanner: (bannerData) => {
    return api.post('/admin/banners', bannerData);
  },

  updateBanner: (bannerId, bannerData) => {
    return api.put(`/admin/banners/${bannerId}`, bannerData);
  },

  deleteBanner: (bannerId) => {
    return api.delete(`/admin/banners/${bannerId}`);
  },

  // System Settings
  getSystemSettings: () => {
    return api.get('/admin/settings/system');
  },

  updateSystemSettings: (settingsData) => {
    return api.put('/admin/settings/system', settingsData);
  },

  getEmailSettings: () => {
    return api.get('/admin/settings/email');
  },

  updateEmailSettings: (emailData) => {
    return api.put('/admin/settings/email', emailData);
  },

  getPaymentSettings: () => {
    return api.get('/admin/settings/payment');
  },

  updatePaymentSettings: (paymentData) => {
    return api.put('/admin/settings/payment', paymentData);
  },

  // Security & Monitoring
  getAuditLogs: (params = {}) => {
    return api.get('/admin/audit-logs', { params });
  },

  getSystemHealth: () => {
    return api.get('/admin/system/health');
  },

  getSecurityAlerts: () => {
    return api.get('/admin/security/alerts');
  },

  resolveSecurityAlert: (alertId) => {
    return api.post(`/admin/security/alerts/${alertId}/resolve`);
  },

  // Backup & Maintenance
  createBackup: (backupData) => {
    return api.post('/admin/backups', backupData);
  },

  getBackups: () => {
    return api.get('/admin/backups');
  },

  restoreBackup: (backupId) => {
    return api.post(`/admin/backups/${backupId}/restore`);
  },

  deleteBackup: (backupId) => {
    return api.delete(`/admin/backups/${backupId}`);
  },

  // Notifications & Communications
  sendBulkEmail: (emailData) => {
    return api.post('/admin/communications/bulk-email', emailData);
  },

  sendNotification: (notificationData) => {
    return api.post('/admin/communications/notification', notificationData);
  },

  getEmailTemplates: () => {
    return api.get('/admin/communications/email-templates');
  },

  createEmailTemplate: (templateData) => {
    return api.post('/admin/communications/email-templates', templateData);
  },

  updateEmailTemplate: (templateId, templateData) => {
    return api.put(`/admin/communications/email-templates/${templateId}`, templateData);
  },

  // Data Export & Import
  exportData: (dataType, params = {}) => {
    return api.get(`/admin/export/${dataType}`, { params, responseType: 'blob' });
  },

  importData: (dataType, formData) => {
    return api.post(`/admin/import/${dataType}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getExportHistory: () => {
    return api.get('/admin/export/history');
  },

  getImportHistory: () => {
    return api.get('/admin/import/history');
  },
};

export default adminAPI;