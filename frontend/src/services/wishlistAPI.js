import api from './api';

const wishlistAPI = {
  // Get user's wishlist
  getWishlist: () => {
    return api.get('/wishlist');
  },

  // Add item to wishlist
  addToWishlist: (productId) => {
    return api.post('/wishlist/add', { productId });
  },

  // Remove item from wishlist
  removeFromWishlist: (productId) => {
    return api.delete(`/wishlist/remove/${productId}`);
  },

  // Clear entire wishlist
  clearWishlist: () => {
    return api.delete('/wishlist/clear');
  },

  // Check if product is in wishlist
  isInWishlist: (productId) => {
    return api.get(`/wishlist/check/${productId}`);
  },

  // Move item to cart
  moveToCart: (productId, quantity = 1) => {
    return api.post('/wishlist/move-to-cart', { productId, quantity });
  },

  // Move multiple items to cart
  moveMultipleToCart: (items) => {
    return api.post('/wishlist/move-multiple-to-cart', { items });
  },

  // Share wishlist
  shareWishlist: (shareData) => {
    return api.post('/wishlist/share', shareData);
  },

  // Get shared wishlist
  getSharedWishlist: (shareId) => {
    return api.get(`/wishlist/shared/${shareId}`);
  },

  // Create wishlist collection
  createCollection: (collectionData) => {
    return api.post('/wishlist/collections', collectionData);
  },

  // Get wishlist collections
  getCollections: () => {
    return api.get('/wishlist/collections');
  },

  // Add item to collection
  addToCollection: (collectionId, productId) => {
    return api.post(`/wishlist/collections/${collectionId}/add`, { productId });
  },

  // Remove item from collection
  removeFromCollection: (collectionId, productId) => {
    return api.delete(`/wishlist/collections/${collectionId}/remove/${productId}`);
  },

  // Update collection
  updateCollection: (collectionId, updateData) => {
    return api.put(`/wishlist/collections/${collectionId}`, updateData);
  },

  // Delete collection
  deleteCollection: (collectionId) => {
    return api.delete(`/wishlist/collections/${collectionId}`);
  },

  // Get wishlist recommendations
  getWishlistRecommendations: () => {
    return api.get('/wishlist/recommendations');
  },

  // Track wishlist item price changes
  trackPriceChanges: (productId) => {
    return api.post(`/wishlist/track-price/${productId}`);
  },

  // Stop tracking price changes
  stopTrackingPrice: (productId) => {
    return api.delete(`/wishlist/track-price/${productId}`);
  },

  // Get price change alerts
  getPriceAlerts: () => {
    return api.get('/wishlist/price-alerts');
  },

  // Mark price alert as read
  markAlertAsRead: (alertId) => {
    return api.put(`/wishlist/price-alerts/${alertId}/read`);
  },

  // Export wishlist
  exportWishlist: (format = 'pdf') => {
    return api.get(`/wishlist/export/${format}`, { responseType: 'blob' });
  },

  // Get wishlist statistics
  getWishlistStats: () => {
    return api.get('/wishlist/stats');
  },

  // Get recently removed items
  getRecentlyRemoved: () => {
    return api.get('/wishlist/recently-removed');
  },

  // Restore recently removed item
  restoreItem: (itemId) => {
    return api.post(`/wishlist/restore/${itemId}`);
  },

  // Get wishlist history
  getWishlistHistory: (params = {}) => {
    return api.get('/wishlist/history', { params });
  },

  // Merge guest wishlist with user wishlist
  mergeWishlist: (guestWishlistData) => {
    return api.post('/wishlist/merge', guestWishlistData);
  },

  // Get public wishlist (for viewing shared wishlists)
  getPublicWishlist: (userId, shareToken) => {
    return api.get(`/wishlist/public/${userId}/${shareToken}`);
  },
};

export default wishlistAPI;