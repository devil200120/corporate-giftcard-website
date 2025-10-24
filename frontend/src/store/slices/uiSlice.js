import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  // Loading states
  globalLoading: false,
  
  // Modal states
  isAuthModalOpen: false,
  authModalType: 'login', // 'login', 'register', 'forgot-password'
  isProductModalOpen: false,
  selectedProductForModal: null,
  isMobileMenuOpen: false,
  isCartSidebarOpen: false,
  isFilterSidebarOpen: false,
  
  // Toast notifications
  notifications: [],
  
  // Theme
  theme: 'light', // 'light', 'dark'
  
  // Search
  isSearchOpen: false,
  searchHistory: [],
  
  // Filters
  activeFilters: {},
  
  // Navigation
  breadcrumbs: [],
  
  // Form states
  formErrors: {},
  formLoading: {},
  
  // Page metadata
  pageTitle: '',
  pageDescription: '',
  
  // Scroll position
  scrollPosition: 0,
  
  // Device info
  isMobile: false,
  isTablet: false,
  
  // Feature flags
  features: {
    darkMode: true,
    notifications: true,
    animations: true,
  },
};

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Loading states
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
    
    // Modal actions
    openAuthModal: (state, action) => {
      state.isAuthModalOpen = true;
      state.authModalType = action.payload || 'login';
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
    setAuthModalType: (state, action) => {
      state.authModalType = action.payload;
    },
    
    openProductModal: (state, action) => {
      state.isProductModalOpen = true;
      state.selectedProductForModal = action.payload;
    },
    closeProductModal: (state) => {
      state.isProductModalOpen = false;
      state.selectedProductForModal = null;
    },
    
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },
    
    toggleCartSidebar: (state) => {
      state.isCartSidebarOpen = !state.isCartSidebarOpen;
    },
    closeCartSidebar: (state) => {
      state.isCartSidebarOpen = false;
    },
    
    toggleFilterSidebar: (state) => {
      state.isFilterSidebarOpen = !state.isFilterSidebarOpen;
    },
    closeFilterSidebar: (state) => {
      state.isFilterSidebarOpen = false;
    },
    
    // Notification actions
    addNotification: (state, action) => {
      const notification = {
        id: Date.now() + Math.random(),
        type: action.payload.type || 'info',
        message: action.payload.message,
        duration: action.payload.duration || 4000,
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    
    // Theme actions
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    
    // Search actions
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },
    closeSearch: (state) => {
      state.isSearchOpen = false;
    },
    addToSearchHistory: (state, action) => {
      const query = action.payload.trim();
      if (query && !state.searchHistory.includes(query)) {
        state.searchHistory.unshift(query);
        // Keep only last 10 searches
        state.searchHistory = state.searchHistory.slice(0, 10);
      }
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },
    
    // Filter actions
    setActiveFilters: (state, action) => {
      state.activeFilters = { ...state.activeFilters, ...action.payload };
    },
    clearActiveFilters: (state) => {
      state.activeFilters = {};
    },
    removeFilter: (state, action) => {
      const { [action.payload]: removed, ...rest } = state.activeFilters;
      state.activeFilters = rest;
    },
    
    // Breadcrumb actions
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload;
    },
    addBreadcrumb: (state, action) => {
      state.breadcrumbs.push(action.payload);
    },
    clearBreadcrumbs: (state) => {
      state.breadcrumbs = [];
    },
    
    // Form actions
    setFormError: (state, action) => {
      const { formName, field, error } = action.payload;
      if (!state.formErrors[formName]) {
        state.formErrors[formName] = {};
      }
      state.formErrors[formName][field] = error;
    },
    clearFormError: (state, action) => {
      const { formName, field } = action.payload;
      if (state.formErrors[formName]) {
        delete state.formErrors[formName][field];
      }
    },
    clearFormErrors: (state, action) => {
      const formName = action.payload;
      if (formName) {
        delete state.formErrors[formName];
      } else {
        state.formErrors = {};
      }
    },
    
    setFormLoading: (state, action) => {
      const { formName, loading } = action.payload;
      state.formLoading[formName] = loading;
    },
    
    // Page metadata actions
    setPageMetadata: (state, action) => {
      const { title, description } = action.payload;
      state.pageTitle = title || '';
      state.pageDescription = description || '';
    },
    
    // Scroll position
    setScrollPosition: (state, action) => {
      state.scrollPosition = action.payload;
    },
    
    // Device info
    setDeviceInfo: (state, action) => {
      const { isMobile, isTablet } = action.payload;
      state.isMobile = isMobile;
      state.isTablet = isTablet;
    },
    
    // Feature flags
    toggleFeature: (state, action) => {
      const feature = action.payload;
      if (state.features.hasOwnProperty(feature)) {
        state.features[feature] = !state.features[feature];
      }
    },
    setFeature: (state, action) => {
      const { feature, enabled } = action.payload;
      if (state.features.hasOwnProperty(feature)) {
        state.features[feature] = enabled;
      }
    },
    
    // Reset UI state
    resetUIState: (state) => {
      return { ...initialState, theme: state.theme };
    },
  },
});

// Export actions
export const {
  setGlobalLoading,
  openAuthModal,
  closeAuthModal,
  setAuthModalType,
  openProductModal,
  closeProductModal,
  toggleMobileMenu,
  closeMobileMenu,
  toggleCartSidebar,
  closeCartSidebar,
  toggleFilterSidebar,
  closeFilterSidebar,
  addNotification,
  removeNotification,
  clearAllNotifications,
  setTheme,
  toggleTheme,
  toggleSearch,
  closeSearch,
  addToSearchHistory,
  clearSearchHistory,
  setActiveFilters,
  clearActiveFilters,
  removeFilter,
  setBreadcrumbs,
  addBreadcrumb,
  clearBreadcrumbs,
  setFormError,
  clearFormError,
  clearFormErrors,
  setFormLoading,
  setPageMetadata,
  setScrollPosition,
  setDeviceInfo,
  toggleFeature,
  setFeature,
  resetUIState,
} = uiSlice.actions;

// Selectors
export const selectGlobalLoading = (state) => state.ui.globalLoading;
export const selectIsAuthModalOpen = (state) => state.ui.isAuthModalOpen;
export const selectAuthModalType = (state) => state.ui.authModalType;
export const selectIsProductModalOpen = (state) => state.ui.isProductModalOpen;
export const selectSelectedProductForModal = (state) => state.ui.selectedProductForModal;
export const selectIsMobileMenuOpen = (state) => state.ui.isMobileMenuOpen;
export const selectIsCartSidebarOpen = (state) => state.ui.isCartSidebarOpen;
export const selectIsFilterSidebarOpen = (state) => state.ui.isFilterSidebarOpen;
export const selectNotifications = (state) => state.ui.notifications;
export const selectTheme = (state) => state.ui.theme;
export const selectIsSearchOpen = (state) => state.ui.isSearchOpen;
export const selectSearchHistory = (state) => state.ui.searchHistory;
export const selectActiveFilters = (state) => state.ui.activeFilters;
export const selectBreadcrumbs = (state) => state.ui.breadcrumbs;
export const selectFormErrors = (formName) => (state) => state.ui.formErrors[formName] || {};
export const selectFormLoading = (formName) => (state) => state.ui.formLoading[formName] || false;
export const selectPageMetadata = (state) => ({
  title: state.ui.pageTitle,
  description: state.ui.pageDescription,
});
export const selectScrollPosition = (state) => state.ui.scrollPosition;
export const selectDeviceInfo = (state) => ({
  isMobile: state.ui.isMobile,
  isTablet: state.ui.isTablet,
});
export const selectFeatures = (state) => state.ui.features;
export const selectFeature = (featureName) => (state) => state.ui.features[featureName];

// Export reducer
export default uiSlice.reducer;