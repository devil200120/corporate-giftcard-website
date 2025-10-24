import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productAPI from '../../services/productAPI';

// Initial state
const initialState = {
  products: [],
  featuredProducts: [],
  currentProduct: null,
  searchResults: [],
  searchQuery: '',
  filters: {
    category: '',
    priceRange: [0, 10000],
    rating: 0,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 12,
    hasNextPage: false,
    hasPrevPage: false,
  },
  isLoading: false,
  searchLoading: false,
  error: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products'
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProductById(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch product'
      );
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (searchQuery, { rejectWithValue }) => {
    try {
      const response = await productAPI.searchProducts(searchQuery);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Search failed'
      );
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productAPI.getFeaturedProducts();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch featured products'
      );
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async ({ categoryId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProductsByCategory(categoryId, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products by category'
      );
    }
  }
);

export const fetchRelatedProducts = createAsyncThunk(
  'products/fetchRelatedProducts',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productAPI.getRelatedProducts(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch related products'
      );
    }
  }
);

export const fetchProductReviews = createAsyncThunk(
  'products/fetchProductReviews',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProductReviews(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch product reviews'
      );
    }
  }
);

export const addProductReview = createAsyncThunk(
  'products/addProductReview',
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await productAPI.addReview(productId, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add review'
      );
    }
  }
);

export const updateProductStock = createAsyncThunk(
  'products/updateProductStock',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await productAPI.updateStock(productId, quantity);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update stock'
      );
    }
  }
);

// Product slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    updateProductInList: (state, action) => {
      const { productId, updates } = action.payload;
      const productIndex = state.products.findIndex(p => p._id === productId);
      if (productIndex !== -1) {
        state.products[productIndex] = { ...state.products[productIndex], ...updates };
      }
      if (state.currentProduct && state.currentProduct._id === productId) {
        state.currentProduct = { ...state.currentProduct, ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data.products;
        state.pagination = {
          currentPage: action.payload.data.currentPage,
          totalPages: action.payload.data.totalPages,
          totalProducts: action.payload.data.totalProducts,
          limit: action.payload.data.limit,
          hasNextPage: action.payload.data.hasNextPage,
          hasPrevPage: action.payload.data.hasPrevPage,
        };
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Product By ID
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload.data.product;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.currentProduct = null;
        state.error = action.payload;
      })

      // Search Products
      .addCase(searchProducts.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.data.products;
        state.error = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      })

      // Fetch Featured Products
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredProducts = action.payload.data.products;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Products By Category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data.products;
        state.pagination = {
          currentPage: action.payload.data.currentPage,
          totalPages: action.payload.data.totalPages,
          totalProducts: action.payload.data.totalProducts,
          limit: action.payload.data.limit,
          hasNextPage: action.payload.data.hasNextPage,
          hasPrevPage: action.payload.data.hasPrevPage,
        };
        state.error = null;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Related Products
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        if (state.currentProduct) {
          state.currentProduct.relatedProducts = action.payload.data.products;
        }
      })

      // Fetch Product Reviews
      .addCase(fetchProductReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentProduct) {
          state.currentProduct.reviews = action.payload.data.reviews;
          state.currentProduct.rating = action.payload.data.rating;
          state.currentProduct.numReviews = action.payload.data.numReviews;
        }
        state.error = null;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add Product Review
      .addCase(addProductReview.fulfilled, (state, action) => {
        if (state.currentProduct && state.currentProduct._id === action.payload.data.productId) {
          state.currentProduct.reviews = action.payload.data.reviews;
          state.currentProduct.rating = action.payload.data.rating;
          state.currentProduct.numReviews = action.payload.data.numReviews;
        }
      })

      // Update Product Stock
      .addCase(updateProductStock.fulfilled, (state, action) => {
        const { productId, stock } = action.payload.data;
        const productIndex = state.products.findIndex(p => p._id === productId);
        if (productIndex !== -1) {
          state.products[productIndex].stock = stock;
        }
        if (state.currentProduct && state.currentProduct._id === productId) {
          state.currentProduct.stock = stock;
        }
      });
  },
});

// Export actions
export const {
  clearError,
  clearCurrentProduct,
  setFilters,
  resetFilters,
  setSearchQuery,
  clearSearchResults,
  setPagination,
  setSortBy,
  updateProductInList,
} = productSlice.actions;

// Export aliases for components expecting different names
export const fetchCategoryProducts = fetchProductsByCategory;
export const fetchRecommendedProducts = fetchRelatedProducts;
export const clearFilters = resetFilters;

// Selectors
export const selectProducts = (state) => state.products.products || [];
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectFeaturedProducts = (state) => state.products.featuredProducts || [];
export const selectSearchResults = (state) => state.products.searchResults || [];
export const selectSearchQuery = (state) => state.products.searchQuery;
export const selectProductFilters = (state) => state.products.filters;
export const selectProductPagination = (state) => state.products.pagination;
export const selectProductsLoading = (state) => state.products.isLoading;
export const selectSearchLoading = (state) => state.products.searchLoading;
export const selectProductsError = (state) => state.products.error;
export const selectProductReviews = (state) => state.products.currentProduct?.reviews || [];
export const selectRelatedProducts = (state) => state.products.currentProduct?.relatedProducts || [];

// Export reducer
export default productSlice.reducer;