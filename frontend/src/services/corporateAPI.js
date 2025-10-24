import api from './api';

const corporateAPI = {
  // Corporate Profile Management
  getProfile: () => {
    return api.get('/corporate/profile');
  },

  updateProfile: (profileData) => {
    return api.put('/corporate/profile', profileData);
  },

  // Corporate Orders
  getOrders: (params = {}) => {
    return api.get('/corporate/orders', { params });
  },

  createBulkOrder: (bulkOrderData) => {
    return api.post('/corporate/orders/bulk', bulkOrderData);
  },

  getBulkOrders: (params = {}) => {
    return api.get('/corporate/orders/bulk', { params });
  },

  getBulkOrderById: (bulkOrderId) => {
    return api.get(`/corporate/orders/bulk/${bulkOrderId}`);
  },

  updateBulkOrder: (bulkOrderId, updateData) => {
    return api.put(`/corporate/orders/bulk/${bulkOrderId}`, updateData);
  },

  cancelBulkOrder: (bulkOrderId, reason) => {
    return api.put(`/corporate/orders/bulk/${bulkOrderId}/cancel`, { reason });
  },

  // Employee Management
  getEmployeeList: (params = {}) => {
    return api.get('/corporate/employees', { params });
  },

  addEmployee: (employeeData) => {
    return api.post('/corporate/employees', employeeData);
  },

  updateEmployee: (employeeId, employeeData) => {
    return api.put(`/corporate/employees/${employeeId}`, employeeData);
  },

  removeEmployee: (employeeId) => {
    return api.delete(`/corporate/employees/${employeeId}`);
  },

  getEmployeeById: (employeeId) => {
    return api.get(`/corporate/employees/${employeeId}`);
  },

  importEmployees: (formData) => {
    return api.post('/corporate/employees/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportEmployees: (format = 'csv') => {
    return api.get(`/corporate/employees/export/${format}`, { responseType: 'blob' });
  },

  // Gifting Campaigns
  getGiftingCampaigns: (params = {}) => {
    return api.get('/corporate/campaigns', { params });
  },

  createGiftingCampaign: (campaignData) => {
    return api.post('/corporate/campaigns', campaignData);
  },

  updateGiftingCampaign: (campaignId, campaignData) => {
    return api.put(`/corporate/campaigns/${campaignId}`, campaignData);
  },

  deleteGiftingCampaign: (campaignId) => {
    return api.delete(`/corporate/campaigns/${campaignId}`);
  },

  getCampaignById: (campaignId) => {
    return api.get(`/corporate/campaigns/${campaignId}`);
  },

  launchCampaign: (campaignId) => {
    return api.post(`/corporate/campaigns/${campaignId}/launch`);
  },

  pauseCampaign: (campaignId) => {
    return api.post(`/corporate/campaigns/${campaignId}/pause`);
  },

  getCampaignAnalytics: (campaignId, params = {}) => {
    return api.get(`/corporate/campaigns/${campaignId}/analytics`, { params });
  },

  // Budget Management
  getBudgetAllocations: () => {
    return api.get('/corporate/budget/allocations');
  },

  updateBudgetAllocation: (allocationId, allocationData) => {
    return api.put(`/corporate/budget/allocations/${allocationId}`, allocationData);
  },

  getBudgetUtilization: (params = {}) => {
    return api.get('/corporate/budget/utilization', { params });
  },

  getBudgetHistory: (params = {}) => {
    return api.get('/corporate/budget/history', { params });
  },

  createBudgetRequest: (requestData) => {
    return api.post('/corporate/budget/requests', requestData);
  },

  getBudgetRequests: (params = {}) => {
    return api.get('/corporate/budget/requests', { params });
  },

  // Approval Workflows
  getApprovalRequests: (params = {}) => {
    return api.get('/corporate/approvals', { params });
  },

  processApprovalRequest: (requestId, approvalData) => {
    return api.post(`/corporate/approvals/${requestId}/process`, approvalData);
  },

  createApprovalRequest: (requestData) => {
    return api.post('/corporate/approvals', requestData);
  },

  getApprovalWorkflows: () => {
    return api.get('/corporate/approval-workflows');
  },

  updateApprovalWorkflow: (workflowId, workflowData) => {
    return api.put(`/corporate/approval-workflows/${workflowId}`, workflowData);
  },

  // Corporate Analytics & Reports
  getCorporateStats: (params = {}) => {
    return api.get('/corporate/stats', { params });
  },

  getDashboardAnalytics: (params = {}) => {
    return api.get('/corporate/dashboard/analytics', { params });
  },

  getSpendingAnalytics: (params = {}) => {
    return api.get('/corporate/analytics/spending', { params });
  },

  getEmployeeEngagement: (params = {}) => {
    return api.get('/corporate/analytics/engagement', { params });
  },

  getCampaignPerformance: (params = {}) => {
    return api.get('/corporate/analytics/campaigns', { params });
  },

  generateReport: (reportType, params = {}) => {
    return api.post(`/corporate/reports/${reportType}`, params);
  },

  getReports: (params = {}) => {
    return api.get('/corporate/reports', { params });
  },

  downloadReport: (reportId) => {
    return api.get(`/corporate/reports/${reportId}/download`, { responseType: 'blob' });
  },

  // Corporate Settings
  getSettings: () => {
    return api.get('/corporate/settings');
  },

  updateSettings: (settingsData) => {
    return api.put('/corporate/settings', settingsData);
  },

  getNotificationSettings: () => {
    return api.get('/corporate/settings/notifications');
  },

  updateNotificationSettings: (notificationData) => {
    return api.put('/corporate/settings/notifications', notificationData);
  },

  // Vendor Management
  getVendors: (params = {}) => {
    return api.get('/corporate/vendors', { params });
  },

  addVendor: (vendorData) => {
    return api.post('/corporate/vendors', vendorData);
  },

  updateVendor: (vendorId, vendorData) => {
    return api.put(`/corporate/vendors/${vendorId}`, vendorData);
  },

  removeVendor: (vendorId) => {
    return api.delete(`/corporate/vendors/${vendorId}`);
  },

  getVendorContracts: (vendorId) => {
    return api.get(`/corporate/vendors/${vendorId}/contracts`);
  },

  // Integration & API Management
  getIntegrations: () => {
    return api.get('/corporate/integrations');
  },

  configureIntegration: (integrationType, configData) => {
    return api.post(`/corporate/integrations/${integrationType}`, configData);
  },

  testIntegration: (integrationType) => {
    return api.post(`/corporate/integrations/${integrationType}/test`);
  },

  getApiKeys: () => {
    return api.get('/corporate/api-keys');
  },

  generateApiKey: (keyData) => {
    return api.post('/corporate/api-keys', keyData);
  },

  revokeApiKey: (keyId) => {
    return api.delete(`/corporate/api-keys/${keyId}`);
  },

  // Compliance & Audit
  getAuditLogs: (params = {}) => {
    return api.get('/corporate/audit-logs', { params });
  },

  getComplianceReports: (params = {}) => {
    return api.get('/corporate/compliance/reports', { params });
  },

  exportAuditLogs: (params = {}) => {
    return api.get('/corporate/audit-logs/export', { params, responseType: 'blob' });
  },
};

export default corporateAPI;