import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryAPI from '../../services/categoryAPI';

// Initial state
const initialState = {
  categories: [],
  featuredCategories: [],
  currentCategory: null,
  categoryTree: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await categoryAPI.getCategories(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch categories'
      );
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await categoryAPI.getCategoryById(categoryId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch category'
      );
    }
  }
);

export const fetchCategoryBySlug = createAsyncThunk(
  'categories/fetchCategoryBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await categoryAPI.getCategoryBySlug(slug);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch category'
      );
    }
  }
);

export const fetchFeaturedCategories = createAsyncThunk(
  'categories/fetchFeaturedCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryAPI.getFeaturedCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch featured categories'
      );
    }
  }
);

export const fetchCategoryTree = createAsyncThunk(
  'categories/fetchCategoryTree',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryAPI.getCategoryTree();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch category tree'
      );
    }
  }
);

// Category slice
const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.data.categories;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Category By ID
      .addCase(fetchCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCategory = action.payload.data.category;
        state.error = null;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.currentCategory = null;
        state.error = action.payload;
      })

      // Fetch Category By Slug
      .addCase(fetchCategoryBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCategory = action.payload.data.category;
        state.error = null;
      })
      .addCase(fetchCategoryBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.currentCategory = null;
        state.error = action.payload;
      })

      // Fetch Featured Categories
      .addCase(fetchFeaturedCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredCategories = action.payload.data.categories;
        state.error = null;
      })
      .addCase(fetchFeaturedCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Category Tree
      .addCase(fetchCategoryTree.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryTree.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryTree = action.payload.data.categories;
        state.error = null;
      })
      .addCase(fetchCategoryTree.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearError, clearCurrentCategory } = categorySlice.actions;

// Selectors
export const selectCategories = (state) => state.categories.categories || [];
export const selectCurrentCategory = (state) => state.categories.currentCategory;
export const selectFeaturedCategories = (state) => state.categories.featuredCategories;
export const selectCategoryTree = (state) => state.categories.categoryTree;
export const selectCategoriesLoading = (state) => state.categories.isLoading;
export const selectCategoriesError = (state) => state.categories.error;

// Export reducer
export default categorySlice.reducer;