import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import wishlistAPI from '../../services/wishlistAPI';

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  isLoading: false,
  addLoading: false,
  removeLoading: false,
  error: null,
};

// Async thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.getWishlist();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch wishlist'
      );
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.addToWishlist(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add to wishlist'
      );
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.removeFromWishlist(productId);
      return { productId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove from wishlist'
      );
    }
  }
);

export const clearWishlist = createAsyncThunk(
  'wishlist/clearWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.clearWishlist();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to clear wishlist'
      );
    }
  }
);

export const moveToCart = createAsyncThunk(
  'wishlist/moveToCart',
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.moveToCart(productId, quantity);
      return { productId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to move to cart'
      );
    }
  }
);

// Wishlist slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Local wishlist operations for guest users
    addToWishlistLocal: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.product._id === product._id);
      
      if (!existingItem) {
        state.items.push({
          _id: `local_${Date.now()}`,
          product,
          addedAt: new Date().toISOString(),
        });
        state.totalItems = state.items.length;
      }
    },
    removeFromWishlistLocal: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.product._id !== productId);
      state.totalItems = state.items.length;
    },
    clearWishlistData: (state) => {
      state.items = [];
      state.totalItems = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        const wishlist = action.payload.data.wishlist;
        state.items = wishlist?.items || [];
        state.totalItems = state.items.length;
        state.error = null;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add to Wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.addLoading = false;
        const wishlist = action.payload.data.wishlist;
        state.items = wishlist?.items || [];
        state.totalItems = state.items.length;
        state.error = null;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.payload;
      })

      // Remove from Wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.removeLoading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.removeLoading = false;
        const { productId } = action.payload;
        state.items = state.items.filter(item => item.product._id !== productId);
        state.totalItems = state.items.length;
        state.error = null;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.removeLoading = false;
        state.error = action.payload;
      })

      // Clear Wishlist
      .addCase(clearWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearWishlist.fulfilled, (state) => {
        state.isLoading = false;
        state.items = [];
        state.totalItems = 0;
        state.error = null;
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Move to Cart
      .addCase(moveToCart.pending, (state) => {
        state.removeLoading = true;
        state.error = null;
      })
      .addCase(moveToCart.fulfilled, (state, action) => {
        state.removeLoading = false;
        const { productId } = action.payload;
        state.items = state.items.filter(item => item.product._id !== productId);
        state.totalItems = state.items.length;
        state.error = null;
      })
      .addCase(moveToCart.rejected, (state, action) => {
        state.removeLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  clearError,
  addToWishlistLocal,
  removeFromWishlistLocal,
  clearWishlistData,
} = wishlistSlice.actions;

// Helper function to toggle wishlist
export const toggleWishlist = (productId) => (dispatch, getState) => {
  const isInWishlist = selectIsInWishlist(productId)(getState());
  if (isInWishlist) {
    dispatch(removeFromWishlist(productId));
  } else {
    dispatch(addToWishlist(productId));
  }
};

// Selectors
export const selectWishlist = (state) => state.wishlist;
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistTotalItems = (state) => state.wishlist.totalItems;
export const selectWishlistLoading = (state) => state.wishlist.isLoading;
export const selectWishlistError = (state) => state.wishlist.error;
export const selectIsInWishlist = (productId) => (state) =>
  state.wishlist.items.some(item => item.product._id === productId);

// Export reducer
export default wishlistSlice.reducer;