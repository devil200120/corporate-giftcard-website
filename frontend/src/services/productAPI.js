import api from './api';

const productAPI = {
  // Get all products with pagination and filters
  getProducts: (params = {}) => {
    return api.get('/products', { params });
  },

  // Get product by ID
  getProductById: (productId) => {
    return api.get(`/products/${productId}`);
  },

  // Get product by slug
  getProductBySlug: (slug) => {
    return api.get(`/products/slug/${slug}`);
  },

  // Search products
  searchProducts: (searchQuery, params = {}) => {
    return api.get('/products/search', { 
      params: { q: searchQuery, ...params } 
    });
  },

  // Get featured products
  getFeaturedProducts: (limit = 10) => {
    return api.get('/products/featured', { params: { limit } });
  },

  // Get products by category
  getProductsByCategory: (categoryId, params = {}) => {
    return api.get(`/products/category/${categoryId}`, { params });
  },

  // Get related products
  getRelatedProducts: (productId, limit = 8) => {
    return api.get(`/products/${productId}/related`, { params: { limit } });
  },

  // Get product reviews
  getProductReviews: (productId, params = {}) => {
    return api.get(`/products/${productId}/reviews`, { params });
  },

  // Add product review
  addReview: (productId, reviewData) => {
    return api.post(`/products/${productId}/reviews`, reviewData);
  },

  // Update review
  updateReview: (productId, reviewId, reviewData) => {
    return api.put(`/products/${productId}/reviews/${reviewId}`, reviewData);
  },

  // Delete review
  deleteReview: (productId, reviewId) => {
    return api.delete(`/products/${productId}/reviews/${reviewId}`);
  },

  // Get product variants
  getProductVariants: (productId) => {
    return api.get(`/products/${productId}/variants`);
  },

  // Check product availability
  checkAvailability: (productId, quantity = 1) => {
    return api.get(`/products/${productId}/availability`, { 
      params: { quantity } 
    });
  },

  // Update product stock (admin only)
  updateStock: (productId, quantity) => {
    return api.put(`/products/${productId}/stock`, { quantity });
  },

  // Add new product (admin only)
  addProduct: (productData) => {
    // Check if productData is FormData (for file uploads)
    if (productData instanceof FormData) {
      return api.post('/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.post('/products', productData);
  },

  // Update product (admin only)
  updateProduct: (productId, productData) => {
    return api.put(`/products/${productId}`, productData);
  },

  // Delete product (admin only)
  deleteProduct: (productId) => {
    return api.delete(`/products/${productId}`);
  },

  // Get product questions
  getProductQuestions: (productId, params = {}) => {
    return api.get(`/products/${productId}/questions`, { params });
  },

  // Add product question
  addQuestion: (productId, questionData) => {
    return api.post(`/products/${productId}/questions`, questionData);
  },

  // Answer product question (admin only)
  answerQuestion: (productId, questionId, answerData) => {
    return api.post(`/products/${productId}/questions/${questionId}/answer`, answerData);
  },

  // Get product specifications
  getProductSpecs: (productId) => {
    return api.get(`/products/${productId}/specifications`);
  },

  // Get product images
  getProductImages: (productId) => {
    return api.get(`/products/${productId}/images`);
  },

  // Get product pricing tiers (for bulk orders)
  getPricingTiers: (productId) => {
    return api.get(`/products/${productId}/pricing-tiers`);
  },

  // Get recently viewed products
  getRecentlyViewed: () => {
    return api.get('/products/recently-viewed');
  },

  // Add to recently viewed
  addToRecentlyViewed: (productId) => {
    return api.post('/products/recently-viewed', { productId });
  },

  // Get product recommendations
  getRecommendations: (productId, type = 'similar') => {
    return api.get(`/products/${productId}/recommendations`, { 
      params: { type } 
    });
  },

  // Get trending products
  getTrendingProducts: (params = {}) => {
    return api.get('/products/trending', { params });
  },

  // Get new arrivals
  getNewArrivals: (params = {}) => {
    return api.get('/products/new-arrivals', { params });
  },

  // Get best sellers
  getBestSellers: (params = {}) => {
    return api.get('/products/best-sellers', { params });
  },

  // Get products on sale
  getSaleProducts: (params = {}) => {
    return api.get('/products/on-sale', { params });
  },

  // Get product filters
  getProductFilters: (categoryId = null) => {
    const url = categoryId ? `/products/filters/${categoryId}` : '/products/filters';
    return api.get(url);
  },

  // Compare products
  compareProducts: (productIds) => {
    return api.post('/products/compare', { productIds });
  },

  // Report product
  reportProduct: (productId, reportData) => {
    return api.post(`/products/${productId}/report`, reportData);
  },
};

export default productAPI;