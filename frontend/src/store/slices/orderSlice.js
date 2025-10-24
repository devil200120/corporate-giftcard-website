import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderAPI from '../../services/orderAPI';

// Initial state
const initialState = {
  orders: [],
  currentOrder: null,
  orderHistory: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  },
  isLoading: false,
  createOrderLoading: false,
  error: null,
};

// Async thunks
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderAPI.createOrder(orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create order'
      );
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrders(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch orders'
      );
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrderById(orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch order'
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await orderAPI.updateOrderStatus(orderId, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update order status'
      );
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async ({ orderId, reason }, { rejectWithValue }) => {
    try {
      const response = await orderAPI.cancelOrder(orderId, reason);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to cancel order'
      );
    }
  }
);

export const trackOrder = createAsyncThunk(
  'orders/trackOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderAPI.trackOrder(orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to track order'
      );
    }
  }
);

export const downloadInvoice = createAsyncThunk(
  'orders/downloadInvoice',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderAPI.downloadInvoice(orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to download invoice'
      );
    }
  }
);

export const requestRefund = createAsyncThunk(
  'orders/requestRefund',
  async ({ orderId, refundData }, { rejectWithValue }) => {
    try {
      const response = await orderAPI.requestRefund(orderId, refundData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to request refund'
      );
    }
  }
);

export const addOrderReview = createAsyncThunk(
  'orders/addOrderReview',
  async ({ orderId, productId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await orderAPI.addOrderReview(orderId, productId, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add review'
      );
    }
  }
);

export const reorderItems = createAsyncThunk(
  'orders/reorderItems',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderAPI.reorderItems(orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to reorder items'
      );
    }
  }
);

// Orders slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    updateOrderInList: (state, action) => {
      const { orderId, updates } = action.payload;
      const orderIndex = state.orders.findIndex(order => order._id === orderId);
      if (orderIndex !== -1) {
        state.orders[orderIndex] = { ...state.orders[orderIndex], ...updates };
      }
      if (state.currentOrder && state.currentOrder._id === orderId) {
        state.currentOrder = { ...state.currentOrder, ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.createOrderLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createOrderLoading = false;
        state.currentOrder = action.payload.data.order;
        state.orders.unshift(action.payload.data.order);
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createOrderLoading = false;
        state.error = action.payload;
      })

      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.data.orders;
        state.pagination = {
          currentPage: action.payload.data.currentPage,
          totalPages: action.payload.data.totalPages,
          totalOrders: action.payload.data.totalOrders,
          limit: action.payload.data.limit,
          hasNextPage: action.payload.data.hasNextPage,
          hasPrevPage: action.payload.data.hasPrevPage,
        };
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Order By ID
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.data.order;
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.currentOrder = null;
        state.error = action.payload;
      })

      // Update Order Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload.data.order;
        const orderIndex = state.orders.findIndex(order => order._id === updatedOrder._id);
        if (orderIndex !== -1) {
          state.orders[orderIndex] = updatedOrder;
        }
        if (state.currentOrder && state.currentOrder._id === updatedOrder._id) {
          state.currentOrder = updatedOrder;
        }
      })

      // Cancel Order
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const updatedOrder = action.payload.data.order;
        const orderIndex = state.orders.findIndex(order => order._id === updatedOrder._id);
        if (orderIndex !== -1) {
          state.orders[orderIndex] = updatedOrder;
        }
        if (state.currentOrder && state.currentOrder._id === updatedOrder._id) {
          state.currentOrder = updatedOrder;
        }
      })

      // Track Order
      .addCase(trackOrder.fulfilled, (state, action) => {
        if (state.currentOrder) {
          state.currentOrder.tracking = action.payload.data.tracking;
        }
      })

      // Request Refund
      .addCase(requestRefund.fulfilled, (state, action) => {
        const updatedOrder = action.payload.data.order;
        const orderIndex = state.orders.findIndex(order => order._id === updatedOrder._id);
        if (orderIndex !== -1) {
          state.orders[orderIndex] = updatedOrder;
        }
        if (state.currentOrder && state.currentOrder._id === updatedOrder._id) {
          state.currentOrder = updatedOrder;
        }
      })

      // Add Order Review
      .addCase(addOrderReview.fulfilled, (state, action) => {
        const { orderId, productId, review } = action.payload.data;
        const orderIndex = state.orders.findIndex(order => order._id === orderId);
        if (orderIndex !== -1) {
          const itemIndex = state.orders[orderIndex].items.findIndex(
            item => item.product._id === productId
          );
          if (itemIndex !== -1) {
            state.orders[orderIndex].items[itemIndex].review = review;
          }
        }
        if (state.currentOrder && state.currentOrder._id === orderId) {
          const itemIndex = state.currentOrder.items.findIndex(
            item => item.product._id === productId
          );
          if (itemIndex !== -1) {
            state.currentOrder.items[itemIndex].review = review;
          }
        }
      });
  },
});

// Export actions
export const {
  clearError,
  clearCurrentOrder,
  updateOrderInList,
} = orderSlice.actions;

// Export aliases for components expecting different names
export const fetchUserOrders = fetchOrders;
export const placeOrder = createOrder;
export const fetchOrderDetails = fetchOrderById;

// Selectors
export const selectOrders = (state) => state.orders.orders;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrderHistory = (state) => state.orders.orderHistory;
export const selectOrderPagination = (state) => state.orders.pagination;
export const selectOrdersLoading = (state) => state.orders.isLoading;
export const selectCreateOrderLoading = (state) => state.orders.createOrderLoading;
export const selectOrdersError = (state) => state.orders.error;

// Export reducer
export default orderSlice.reducer;