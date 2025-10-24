import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartAPI from '../../services/cartAPI';

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  discountAmount: 0,
  finalPrice: 0,
  appliedCoupons: [],
  shippingAddress: null,
  billingAddress: null,
  paymentMethod: null,
  isLoading: false,
  addToCartLoading: false,
  updateLoading: false,
  removeLoading: false,
  error: null,
};

// Helper function to calculate cart totals
const calculateCartTotals = (items, appliedCoupons = []) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let discountAmount = 0;
  appliedCoupons.forEach(coupon => {
    if (coupon.discountType === 'percentage') {
      discountAmount += (totalPrice * coupon.discountValue) / 100;
    } else {
      discountAmount += coupon.discountValue;
    }
  });
  
  const finalPrice = Math.max(0, totalPrice - discountAmount);
  
  return {
    totalItems,
    totalPrice,
    discountAmount,
    finalPrice,
  };
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch cart'
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1, customization = {} }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.addToCart({ productId, quantity, customization });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add to cart'
      );
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ cartItemId, quantity, customization }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.updateCartItem(cartItemId, { quantity, customization });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update cart item'
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId, { rejectWithValue }) => {
    try {
      const response = await cartAPI.removeFromCart(cartItemId);
      return { cartItemId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove from cart'
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.clearCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to clear cart'
      );
    }
  }
);

export const applyCoupon = createAsyncThunk(
  'cart/applyCoupon',
  async (couponCode, { rejectWithValue }) => {
    try {
      const response = await cartAPI.applyCoupon(couponCode);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to apply coupon'
      );
    }
  }
);

export const removeCoupon = createAsyncThunk(
  'cart/removeCoupon',
  async (couponId, { rejectWithValue }) => {
    try {
      const response = await cartAPI.removeCoupon(couponId);
      return { couponId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove coupon'
      );
    }
  }
);

export const validateCart = createAsyncThunk(
  'cart/validateCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.validateCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Cart validation failed'
      );
    }
  }
);

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
    setBillingAddress: (state, action) => {
      state.billingAddress = action.payload;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    clearCartData: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      state.discountAmount = 0;
      state.finalPrice = 0;
      state.appliedCoupons = [];
      state.shippingAddress = null;
      state.billingAddress = null;
      state.paymentMethod = null;
    },
    // Local cart operations for guest users
    addToCartLocal: (state, action) => {
      const { product, quantity = 1, customization = {} } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.productId === product._id && 
        JSON.stringify(item.customization) === JSON.stringify(customization)
      );
      
      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        state.items.push({
          _id: `local_${Date.now()}`,
          productId: product._id,
          product,
          quantity,
          price: product.price,
          customization,
        });
      }
      
      const totals = calculateCartTotals(state.items, state.appliedCoupons);
      Object.assign(state, totals);
    },
    updateCartItemLocal: (state, action) => {
      const { itemId, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item._id === itemId);
      
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          state.items.splice(itemIndex, 1);
        } else {
          state.items[itemIndex].quantity = quantity;
        }
        
        const totals = calculateCartTotals(state.items, state.appliedCoupons);
        Object.assign(state, totals);
      }
    },
    removeFromCartLocal: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item._id !== itemId);
      
      const totals = calculateCartTotals(state.items, state.appliedCoupons);
      Object.assign(state, totals);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        const cart = action.payload.data.cart;
        state.items = cart.items || [];
        state.appliedCoupons = cart.appliedCoupons || [];
        
        const totals = calculateCartTotals(state.items, state.appliedCoupons);
        Object.assign(state, totals);
        
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.addToCartLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.addToCartLoading = false;
        const cart = action.payload.data.cart;
        state.items = cart.items || [];
        
        const totals = calculateCartTotals(state.items, state.appliedCoupons);
        Object.assign(state, totals);
        
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.addToCartLoading = false;
        state.error = action.payload;
      })

      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.updateLoading = false;
        const cart = action.payload.data.cart;
        state.items = cart.items || [];
        
        const totals = calculateCartTotals(state.items, state.appliedCoupons);
        Object.assign(state, totals);
        
        state.error = null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.removeLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.removeLoading = false;
        const { cartItemId } = action.payload;
        state.items = state.items.filter(item => item._id !== cartItemId);
        
        const totals = calculateCartTotals(state.items, state.appliedCoupons);
        Object.assign(state, totals);
        
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.removeLoading = false;
        state.error = action.payload;
      })

      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
        state.discountAmount = 0;
        state.finalPrice = 0;
        state.appliedCoupons = [];
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Apply Coupon
      .addCase(applyCoupon.fulfilled, (state, action) => {
        const { coupon, cart } = action.payload.data;
        state.appliedCoupons = cart.appliedCoupons || [];
        
        const totals = calculateCartTotals(state.items, state.appliedCoupons);
        Object.assign(state, totals);
      })

      // Remove Coupon
      .addCase(removeCoupon.fulfilled, (state, action) => {
        const { couponId } = action.payload;
        state.appliedCoupons = state.appliedCoupons.filter(c => c._id !== couponId);
        
        const totals = calculateCartTotals(state.items, state.appliedCoupons);
        Object.assign(state, totals);
      })

      // Validate Cart
      .addCase(validateCart.fulfilled, (state, action) => {
        const { validationResults } = action.payload.data;
        // Handle validation results (e.g., out of stock items)
        if (validationResults.hasIssues) {
          state.error = validationResults.message;
        }
      });
  },
});

// Export actions
export const {
  clearError,
  setShippingAddress,
  setBillingAddress,
  setPaymentMethod,
  clearCartData,
  addToCartLocal,
  updateCartItemLocal,
  removeFromCartLocal,
} = cartSlice.actions;

// Selectors
export const selectCart = (state) => state.cart;
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalItems = (state) => state.cart.totalItems;
export const selectCartTotalPrice = (state) => state.cart.totalPrice;
export const selectCartFinalPrice = (state) => state.cart.finalPrice;
export const selectCartDiscountAmount = (state) => state.cart.discountAmount;
export const selectAppliedCoupons = (state) => state.cart.appliedCoupons;
export const selectShippingAddress = (state) => state.cart.shippingAddress;
export const selectBillingAddress = (state) => state.cart.billingAddress;
export const selectPaymentMethod = (state) => state.cart.paymentMethod;
export const selectCartLoading = (state) => state.cart.isLoading;
export const selectAddToCartLoading = (state) => state.cart.addToCartLoading;
export const selectCartError = (state) => state.cart.error;

// Export aliases for components expecting different names
export const updateQuantity = updateCartItem;

// Export reducer
export default cartSlice.reducer;