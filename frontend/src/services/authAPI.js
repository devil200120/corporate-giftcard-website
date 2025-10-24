import api from './api';

const authAPI = {
  // User Registration
  register: (userData) => {
    return api.post('/auth/register', userData);
  },

  // Corporate Registration
  registerCorporate: (corporateData) => {
    return api.post('/auth/register-corporate', corporateData);
  },

  // User Login
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },

  // User Logout
  logout: () => {
    return api.post('/auth/logout');
  },

  // Get Current User
  getCurrentUser: () => {
    return api.get('/auth/me');
  },

  // Update User Profile
  updateProfile: (profileData) => {
    return api.put('/auth/profile', profileData);
  },

  // Change Password
  changePassword: (passwordData) => {
    return api.put('/auth/change-password', passwordData);
  },

  // Forgot Password
  forgotPassword: (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  // Reset Password
  resetPassword: (resetData) => {
    return api.post('/auth/reset-password', resetData);
  },

  // Verify Email
  verifyEmail: (token) => {
    return api.get(`/auth/verify-email/${token}`);
  },

  // Resend Email Verification
  resendVerificationEmail: () => {
    return api.post('/auth/resend-verification');
  },

  // Refresh Token
  refreshToken: (refreshToken) => {
    return api.post('/auth/refresh-token', { refreshToken });
  },

  // Social Login (Google, Facebook, etc.)
  socialLogin: (provider, token) => {
    return api.post(`/auth/social/${provider}`, { token });
  },

  // Check if email exists
  checkEmailExists: (email) => {
    return api.post('/auth/check-email', { email });
  },

  // Check if username exists
  checkUsernameExists: (username) => {
    return api.post('/auth/check-username', { username });
  },

  // Validate reset token
  validateResetToken: (token) => {
    return api.get(`/auth/validate-reset-token/${token}`);
  },

  // Two-Factor Authentication
  enableTwoFactor: () => {
    return api.post('/auth/enable-2fa');
  },

  disableTwoFactor: (token) => {
    return api.post('/auth/disable-2fa', { token });
  },

  verifyTwoFactor: (token) => {
    return api.post('/auth/verify-2fa', { token });
  },
};

export default authAPI;