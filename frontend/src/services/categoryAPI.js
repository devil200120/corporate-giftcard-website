import api from './api';

const categoryAPI = {
  // Get all categories
  getCategories: (params = {}) => {
    return api.get('/categories', { params });
  },

  // Get category by ID
  getCategoryById: (categoryId) => {
    return api.get(`/categories/${categoryId}`);
  },

  // Get category by slug
  getCategoryBySlug: (slug) => {
    return api.get(`/categories/slug/${slug}`);
  },

  // Get featured categories
  getFeaturedCategories: (limit = 8) => {
    return api.get('/categories/featured', { params: { limit } });
  },

  // Get category tree (hierarchical structure)
  getCategoryTree: () => {
    return api.get('/categories/tree');
  },

  // Get top-level categories
  getTopLevelCategories: () => {
    return api.get('/categories/top-level');
  },

  // Get subcategories
  getSubcategories: (parentId) => {
    return api.get(`/categories/${parentId}/subcategories`);
  },

  // Search categories
  searchCategories: (searchQuery) => {
    return api.get('/categories/search', { params: { q: searchQuery } });
  },

  // Get category filters
  getCategoryFilters: (categoryId) => {
    return api.get(`/categories/${categoryId}/filters`);
  },

  // Get category products count
  getCategoryProductsCount: (categoryId) => {
    return api.get(`/categories/${categoryId}/products-count`);
  },

  // Get popular categories
  getPopularCategories: (limit = 10) => {
    return api.get('/categories/popular', { params: { limit } });
  },

  // Get trending categories
  getTrendingCategories: (limit = 10) => {
    return api.get('/categories/trending', { params: { limit } });
  },

  // Get category breadcrumbs
  getCategoryBreadcrumbs: (categoryId) => {
    return api.get(`/categories/${categoryId}/breadcrumbs`);
  },

  // Get category SEO data
  getCategorySEO: (categoryId) => {
    return api.get(`/categories/${categoryId}/seo`);
  },

  // Get category statistics
  getCategoryStats: (categoryId) => {
    return api.get(`/categories/${categoryId}/stats`);
  },

  // Get category banners/promotional content
  getCategoryBanners: (categoryId) => {
    return api.get(`/categories/${categoryId}/banners`);
  },

  // Get category recommendations
  getCategoryRecommendations: (categoryId, limit = 5) => {
    return api.get(`/categories/${categoryId}/recommendations`, { params: { limit } });
  },

  // Get recently viewed categories
  getRecentlyViewedCategories: () => {
    return api.get('/categories/recently-viewed');
  },

  // Add to recently viewed categories
  addToRecentlyViewed: (categoryId) => {
    return api.post('/categories/recently-viewed', { categoryId });
  },

  // Get category price range
  getCategoryPriceRange: (categoryId) => {
    return api.get(`/categories/${categoryId}/price-range`);
  },

  // Get category brands
  getCategoryBrands: (categoryId) => {
    return api.get(`/categories/${categoryId}/brands`);
  },

  // Get category attributes (for filters)
  getCategoryAttributes: (categoryId) => {
    return api.get(`/categories/${categoryId}/attributes`);
  },

  // Get category sorting options
  getCategorySortingOptions: (categoryId) => {
    return api.get(`/categories/${categoryId}/sorting-options`);
  },

  // Subscribe to category updates
  subscribeToCategory: (categoryId) => {
    return api.post(`/categories/${categoryId}/subscribe`);
  },

  // Unsubscribe from category updates
  unsubscribeFromCategory: (categoryId) => {
    return api.delete(`/categories/${categoryId}/subscribe`);
  },

  // Get category subscription status
  getCategorySubscriptionStatus: (categoryId) => {
    return api.get(`/categories/${categoryId}/subscription-status`);
  },

  // Get category deals
  getCategoryDeals: (categoryId, params = {}) => {
    return api.get(`/categories/${categoryId}/deals`, { params });
  },

  // Get category new arrivals
  getCategoryNewArrivals: (categoryId, params = {}) => {
    return api.get(`/categories/${categoryId}/new-arrivals`, { params });
  },

  // Get category best sellers
  getCategoryBestSellers: (categoryId, params = {}) => {
    return api.get(`/categories/${categoryId}/best-sellers`, { params });
  },
};

export default categoryAPI;