import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminAPI from '../../services/adminAPI';

// Initial state
const initialState = {
  // Dashboard stats
  dashboardStats: {
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    newUsersToday: 0,
    ordersToday: 0,
    revenueToday: 0,
    topSellingProducts: [],
    recentOrders: [],
    userGrowth: [],
    revenueGrowth: [],
  },
  
  // Users management
  users: [],
  currentUser: null,
  usersPagination: {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 20,
  },
  
  // Products management
  adminProducts: [],
  currentProduct: null,
  productsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 20,
  },
  
  // Orders management
  adminOrders: [],
  currentOrder: null,
  ordersPagination: {
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    limit: 20,
  },
  
  // Categories management
  adminCategories: [],
  
  // Coupons management
  adminCoupons: [],
  
  // Corporate accounts
  corporateAccounts: [],
  pendingCorporateApprovals: [],
  
  // System settings
  systemSettings: {},
  
  // Analytics data
  analyticsData: {
    salesAnalytics: [],
    userAnalytics: [],
    productAnalytics: [],
    categoryAnalytics: [],
  },
  
  // Loading states
  isLoading: false,
  statsLoading: false,
  usersLoading: false,
  productsLoading: false,
  ordersLoading: false,
  analyticsLoading: false,
  
  error: null,
};

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getDashboardStats(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch dashboard stats'
      );
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getAllUsers(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users'
      );
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'admin/fetchUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getUserById(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user'
      );
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'admin/updateUserStatus',
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateUserStatus(userId, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update user status'
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.deleteUser(userId);
      return { userId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete user'
      );
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  'admin/fetchAllProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getAllProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products'
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  'admin/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await adminAPI.createProduct(productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create product'
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  'admin/updateProduct',
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateProduct(productId, productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update product'
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.deleteProduct(productId);
      return { productId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete product'
      );
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'admin/fetchAllOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getAllOrders(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch orders'
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ orderId, status, trackingInfo }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateOrderStatus(orderId, { status, trackingInfo });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update order status'
      );
    }
  }
);

export const fetchAllCategories = createAsyncThunk(
  'admin/fetchAllCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getAllCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch categories'
      );
    }
  }
);

export const createCategory = createAsyncThunk(
  'admin/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await adminAPI.createCategory(categoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create category'
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  'admin/updateCategory',
  async ({ categoryId, categoryData }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateCategory(categoryId, categoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update category'
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'admin/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.deleteCategory(categoryId);
      return { categoryId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete category'
      );
    }
  }
);

export const fetchAllCoupons = createAsyncThunk(
  'admin/fetchAllCoupons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getAllCoupons();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch coupons'
      );
    }
  }
);

export const createCoupon = createAsyncThunk(
  'admin/createCoupon',
  async (couponData, { rejectWithValue }) => {
    try {
      const response = await adminAPI.createCoupon(couponData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create coupon'
      );
    }
  }
);

export const updateCoupon = createAsyncThunk(
  'admin/updateCoupon',
  async ({ couponId, couponData }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateCoupon(couponId, couponData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update coupon'
      );
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  'admin/deleteCoupon',
  async (couponId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.deleteCoupon(couponId);
      return { couponId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete coupon'
      );
    }
  }
);

export const fetchCorporateAccounts = createAsyncThunk(
  'admin/fetchCorporateAccounts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getCorporateAccounts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch corporate accounts'
      );
    }
  }
);

export const approveCorporateAccount = createAsyncThunk(
  'admin/approveCorporateAccount',
  async ({ accountId, approvalData }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.approveCorporateAccount(accountId, approvalData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to approve corporate account'
      );
    }
  }
);

export const fetchSystemSettings = createAsyncThunk(
  'admin/fetchSystemSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getSystemSettings();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch system settings'
      );
    }
  }
);

export const updateSystemSettings = createAsyncThunk(
  'admin/updateSystemSettings',
  async (settingsData, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateSystemSettings(settingsData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update system settings'
      );
    }
  }
);

export const updateProductStatus = createAsyncThunk(
  'admin/updateProductStatus',
  async ({ productId, status }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateProduct(productId, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update product status'
      );
    }
  }
);

export const fetchAnalyticsData = createAsyncThunk(
  'admin/fetchAnalyticsData',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getAnalyticsData(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch analytics data'
      );
    }
  }
);

// Aliases for better naming
export const fetchPlatformAnalytics = fetchAnalyticsData;
export const fetchReports = fetchAnalyticsData;

// Admin slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.dashboardStats = action.payload.data.stats;
        state.error = null;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      })

      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.data.users;
        state.usersPagination = {
          currentPage: action.payload.data.currentPage,
          totalPages: action.payload.data.totalPages,
          totalUsers: action.payload.data.totalUsers,
          limit: action.payload.data.limit,
        };
        state.error = null;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload;
      })

      // Fetch User By ID
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.currentUser = action.payload.data.user;
      })

      // Update User Status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const updatedUser = action.payload.data.user;
        const userIndex = state.users.findIndex(user => user._id === updatedUser._id);
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser;
        }
        if (state.currentUser && state.currentUser._id === updatedUser._id) {
          state.currentUser = updatedUser;
        }
      })

      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        const { userId } = action.payload;
        state.users = state.users.filter(user => user._id !== userId);
        if (state.currentUser && state.currentUser._id === userId) {
          state.currentUser = null;
        }
      })

      // Fetch All Products
      .addCase(fetchAllProducts.pending, (state) => {
        state.productsLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.adminProducts = action.payload.data.products;
        state.productsPagination = {
          currentPage: action.payload.data.currentPage,
          totalPages: action.payload.data.totalPages,
          totalProducts: action.payload.data.totalProducts,
          limit: action.payload.data.limit,
        };
        state.error = null;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.productsLoading = false;
        state.error = action.payload;
      })

      // Create Product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.adminProducts.unshift(action.payload.data.product);
      })

      // Update Product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updatedProduct = action.payload.data.product;
        const productIndex = state.adminProducts.findIndex(product => product._id === updatedProduct._id);
        if (productIndex !== -1) {
          state.adminProducts[productIndex] = updatedProduct;
        }
        if (state.currentProduct && state.currentProduct._id === updatedProduct._id) {
          state.currentProduct = updatedProduct;
        }
      })

      // Update Product Status
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        const updatedProduct = action.payload.data.product;
        const productIndex = state.adminProducts.findIndex(product => product._id === updatedProduct._id);
        if (productIndex !== -1) {
          state.adminProducts[productIndex] = updatedProduct;
        }
        if (state.currentProduct && state.currentProduct._id === updatedProduct._id) {
          state.currentProduct = updatedProduct;
        }
      })

      // Delete Product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const { productId } = action.payload;
        state.adminProducts = state.adminProducts.filter(product => product._id !== productId);
        if (state.currentProduct && state.currentProduct._id === productId) {
          state.currentProduct = null;
        }
      })

      // Fetch All Orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.ordersLoading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.adminOrders = action.payload.data.orders;
        state.ordersPagination = {
          currentPage: action.payload.data.currentPage,
          totalPages: action.payload.data.totalPages,
          totalOrders: action.payload.data.totalOrders,
          limit: action.payload.data.limit,
        };
        state.error = null;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.error = action.payload;
      })

      // Update Order Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload.data.order;
        const orderIndex = state.adminOrders.findIndex(order => order._id === updatedOrder._id);
        if (orderIndex !== -1) {
          state.adminOrders[orderIndex] = updatedOrder;
        }
        if (state.currentOrder && state.currentOrder._id === updatedOrder._id) {
          state.currentOrder = updatedOrder;
        }
      })

      // Categories
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.adminCategories = action.payload.data.categories;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.adminCategories.push(action.payload.data.category);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const updatedCategory = action.payload.data.category;
        const categoryIndex = state.adminCategories.findIndex(cat => cat._id === updatedCategory._id);
        if (categoryIndex !== -1) {
          state.adminCategories[categoryIndex] = updatedCategory;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        const { categoryId } = action.payload;
        state.adminCategories = state.adminCategories.filter(cat => cat._id !== categoryId);
      })

      // Coupons
      .addCase(fetchAllCoupons.fulfilled, (state, action) => {
        state.adminCoupons = action.payload.data.coupons;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.adminCoupons.unshift(action.payload.data.coupon);
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        const updatedCoupon = action.payload.data.coupon;
        const couponIndex = state.adminCoupons.findIndex(coupon => coupon._id === updatedCoupon._id);
        if (couponIndex !== -1) {
          state.adminCoupons[couponIndex] = updatedCoupon;
        }
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        const { couponId } = action.payload;
        state.adminCoupons = state.adminCoupons.filter(coupon => coupon._id !== couponId);
      })

      // Corporate Accounts
      .addCase(fetchCorporateAccounts.fulfilled, (state, action) => {
        state.corporateAccounts = action.payload.data.accounts;
        state.pendingCorporateApprovals = action.payload.data.accounts.filter(
          account => account.status === 'pending'
        );
      })
      .addCase(approveCorporateAccount.fulfilled, (state, action) => {
        const updatedAccount = action.payload.data.account;
        const accountIndex = state.corporateAccounts.findIndex(acc => acc._id === updatedAccount._id);
        if (accountIndex !== -1) {
          state.corporateAccounts[accountIndex] = updatedAccount;
        }
        state.pendingCorporateApprovals = state.corporateAccounts.filter(
          account => account.status === 'pending'
        );
      })

      // System Settings
      .addCase(fetchSystemSettings.fulfilled, (state, action) => {
        state.systemSettings = action.payload.data.settings;
      })
      .addCase(updateSystemSettings.fulfilled, (state, action) => {
        state.systemSettings = action.payload.data.settings;
      })

      // Analytics Data
      .addCase(fetchAnalyticsData.pending, (state) => {
        state.analyticsLoading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsData.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.analyticsData = action.payload.data.analytics;
        state.error = null;
      })
      .addCase(fetchAnalyticsData.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  clearError,
  clearCurrentUser,
  clearCurrentProduct,
  clearCurrentOrder,
} = adminSlice.actions;

// Selectors
export const selectDashboardStats = (state) => state.admin.dashboardStats;
export const selectAllUsers = (state) => state.admin.users;
export const selectCurrentUser = (state) => state.admin.currentUser;
export const selectUsersPagination = (state) => state.admin.usersPagination;
export const selectAdminProducts = (state) => state.admin.adminProducts;
export const selectCurrentProduct = (state) => state.admin.currentProduct;
export const selectProductsPagination = (state) => state.admin.productsPagination;
export const selectAdminOrders = (state) => state.admin.adminOrders;
export const selectCurrentOrder = (state) => state.admin.currentOrder;
export const selectOrdersPagination = (state) => state.admin.ordersPagination;
export const selectAdminCategories = (state) => state.admin.adminCategories;
export const selectAdminCoupons = (state) => state.admin.adminCoupons;
export const selectCorporateAccounts = (state) => state.admin.corporateAccounts;
export const selectPendingCorporateApprovals = (state) => state.admin.pendingCorporateApprovals;
export const selectSystemSettings = (state) => state.admin.systemSettings;
export const selectAnalyticsData = (state) => state.admin.analyticsData;
export const selectAdminLoading = (state) => state.admin.isLoading;
export const selectStatsLoading = (state) => state.admin.statsLoading;
export const selectUsersLoading = (state) => state.admin.usersLoading;
export const selectProductsLoading = (state) => state.admin.productsLoading;
export const selectOrdersLoading = (state) => state.admin.ordersLoading;
export const selectAnalyticsLoading = (state) => state.admin.analyticsLoading;
export const selectAdminError = (state) => state.admin.error;

// Export reducer
export default adminSlice.reducer;