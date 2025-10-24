import api from './api';

const cartAPI = {
  // Get user's cart
  getCart: () => {
    return api.get('/cart');
  },

  // Add item to cart
  addToCart: (itemData) => {
    return api.post('/cart/add', itemData);
  },

  // Update cart item
  updateCartItem: (cartItemId, updateData) => {
    return api.put(`/cart/items/${cartItemId}`, updateData);
  },

  // Remove item from cart
  removeFromCart: (cartItemId) => {
    return api.delete(`/cart/items/${cartItemId}`);
  },

  // Clear entire cart
  clearCart: () => {
    return api.delete('/cart/clear');
  },

  // Apply coupon to cart
  applyCoupon: (couponCode) => {
    return api.post('/cart/apply-coupon', { couponCode });
  },

  // Remove coupon from cart
  removeCoupon: (couponId) => {
    return api.delete(`/cart/coupons/${couponId}`);
  },

  // Validate cart (check stock, prices, etc.)
  validateCart: () => {
    return api.post('/cart/validate');
  },

  // Get cart summary (totals, taxes, shipping)
  getCartSummary: () => {
    return api.get('/cart/summary');
  },

  // Save cart for later (guest users)
  saveCart: (cartData) => {
    return api.post('/cart/save', cartData);
  },

  // Restore saved cart
  restoreCart: (cartId) => {
    return api.post(`/cart/restore/${cartId}`);
  },

  // Merge guest cart with user cart
  mergeCart: (guestCartData) => {
    return api.post('/cart/merge', guestCartData);
  },

  // Get cart recommendations
  getCartRecommendations: () => {
    return api.get('/cart/recommendations');
  },

  // Apply bulk discount
  applyBulkDiscount: (items) => {
    return api.post('/cart/bulk-discount', { items });
  },

  // Calculate shipping
  calculateShipping: (shippingData) => {
    return api.post('/cart/calculate-shipping', shippingData);
  },

  // Estimate taxes
  estimateTaxes: (addressData) => {
    return api.post('/cart/estimate-taxes', addressData);
  },

  // Move item to wishlist
  moveToWishlist: (cartItemId) => {
    return api.post(`/cart/items/${cartItemId}/move-to-wishlist`);
  },

  // Save item for later
  saveForLater: (cartItemId) => {
    return api.post(`/cart/items/${cartItemId}/save-for-later`);
  },

  // Move saved item back to cart
  moveBackToCart: (savedItemId) => {
    return api.post(`/cart/saved-items/${savedItemId}/move-to-cart`);
  },

  // Get saved items
  getSavedItems: () => {
    return api.get('/cart/saved-items');
  },

  // Remove saved item
  removeSavedItem: (savedItemId) => {
    return api.delete(`/cart/saved-items/${savedItemId}`);
  },

  // Get available payment methods for cart
  getPaymentMethods: () => {
    return api.get('/cart/payment-methods');
  },

  // Get available shipping methods
  getShippingMethods: (addressData) => {
    return api.post('/cart/shipping-methods', addressData);
  },

  // Check cart items availability
  checkItemsAvailability: () => {
    return api.post('/cart/check-availability');
  },

  // Get cart history
  getCartHistory: (params = {}) => {
    return api.get('/cart/history', { params });
  },

  // Export cart (for sharing or printing)
  exportCart: (format = 'pdf') => {
    return api.get(`/cart/export/${format}`, { responseType: 'blob' });
  },
};

export default cartAPI;