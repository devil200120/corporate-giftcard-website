import api from './api';

const userAPI = {
  // Profile management
  getProfile: () => {
    return api.get('/users/profile');
  },

  updateProfile: (userData) => {
    return api.put('/users/profile', userData);
  },

  uploadAvatar: (formData) => {
    return api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Password management
  changePassword: (passwordData) => {
    return api.put('/users/change-password', passwordData);
  },

  // Address management
  getAddresses: () => {
    return api.get('/users/addresses');
  },

  addAddress: (addressData) => {
    return api.post('/users/addresses', addressData);
  },

  updateAddress: (addressId, addressData) => {
    return api.put(`/users/addresses/${addressId}`, addressData);
  },

  deleteAddress: (addressId) => {
    return api.delete(`/users/addresses/${addressId}`);
  },

  setDefaultAddress: (addressId) => {
    return api.patch(`/users/addresses/${addressId}/default`);
  },

  // Notification preferences
  getNotificationPreferences: () => {
    return api.get('/users/notification-preferences');
  },

  updateNotificationPreferences: (preferences) => {
    return api.put('/users/notification-preferences', preferences);
  },

  // Account management
  deleteAccount: (password) => {
    return api.delete('/users/account', {
      data: { password }
    });
  },

  deactivateAccount: () => {
    return api.patch('/users/deactivate');
  },

  reactivateAccount: () => {
    return api.patch('/users/reactivate');
  },

  // Privacy settings
  getPrivacySettings: () => {
    return api.get('/users/privacy-settings');
  },

  updatePrivacySettings: (settings) => {
    return api.put('/users/privacy-settings', settings);
  },

  // Two-factor authentication
  enable2FA: () => {
    return api.post('/users/2fa/enable');
  },

  disable2FA: (token) => {
    return api.post('/users/2fa/disable', { token });
  },

  verify2FA: (token) => {
    return api.post('/users/2fa/verify', { token });
  },

  // Activity logs
  getActivityLogs: (params = {}) => {
    return api.get('/users/activity-logs', { params });
  },

  // Data export
  exportUserData: (format = 'json') => {
    return api.get(`/users/export-data/${format}`, {
      responseType: 'blob'
    });
  },

  // Support tickets
  getSupportTickets: (params = {}) => {
    return api.get('/users/support-tickets', { params });
  },

  createSupportTicket: (ticketData) => {
    return api.post('/users/support-tickets', ticketData);
  },

  getSupportTicket: (ticketId) => {
    return api.get(`/users/support-tickets/${ticketId}`);
  },

  updateSupportTicket: (ticketId, updateData) => {
    return api.put(`/users/support-tickets/${ticketId}`, updateData);
  },

  // Referrals
  getReferrals: () => {
    return api.get('/users/referrals');
  },

  createReferral: (email) => {
    return api.post('/users/referrals', { email });
  },

  getReferralCode: () => {
    return api.get('/users/referral-code');
  },

  generateNewReferralCode: () => {
    return api.post('/users/referral-code/generate');
  },

  // Loyalty points
  getLoyaltyPoints: () => {
    return api.get('/users/loyalty-points');
  },

  getLoyaltyHistory: (params = {}) => {
    return api.get('/users/loyalty-points/history', { params });
  },

  redeemPoints: (redemptionData) => {
    return api.post('/users/loyalty-points/redeem', redemptionData);
  },

  // Saved payment methods
  getPaymentMethods: () => {
    return api.get('/users/payment-methods');
  },

  addPaymentMethod: (paymentMethodData) => {
    return api.post('/users/payment-methods', paymentMethodData);
  },

  updatePaymentMethod: (methodId, updateData) => {
    return api.put(`/users/payment-methods/${methodId}`, updateData);
  },

  deletePaymentMethod: (methodId) => {
    return api.delete(`/users/payment-methods/${methodId}`);
  },

  setDefaultPaymentMethod: (methodId) => {
    return api.patch(`/users/payment-methods/${methodId}/default`);
  },

  // Communication preferences
  getCommunicationPreferences: () => {
    return api.get('/users/communication-preferences');
  },

  updateCommunicationPreferences: (preferences) => {
    return api.put('/users/communication-preferences', preferences);
  },

  // Account verification
  requestEmailVerification: () => {
    return api.post('/users/verify-email/request');
  },

  verifyEmail: (token) => {
    return api.post('/users/verify-email', { token });
  },

  requestPhoneVerification: (phoneNumber) => {
    return api.post('/users/verify-phone/request', { phoneNumber });
  },

  verifyPhone: (phoneNumber, code) => {
    return api.post('/users/verify-phone', { phoneNumber, code });
  },

  // Session management
  getSessions: () => {
    return api.get('/users/sessions');
  },

  terminateSession: (sessionId) => {
    return api.delete(`/users/sessions/${sessionId}`);
  },

  terminateAllSessions: () => {
    return api.delete('/users/sessions');
  },
};

export default userAPI;