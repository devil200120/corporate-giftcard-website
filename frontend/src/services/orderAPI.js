import api from './api';

const orderAPI = {
  // Create new order
  createOrder: (orderData) => {
    return api.post('/orders', orderData);
  },

  // Get user's orders
  getOrders: (params = {}) => {
    return api.get('/orders', { params });
  },

  // Get order by ID
  getOrderById: (orderId) => {
    return api.get(`/orders/${orderId}`);
  },

  // Update order status (admin only)
  updateOrderStatus: (orderId, status) => {
    return api.put(`/orders/${orderId}/status`, { status });
  },

  // Cancel order
  cancelOrder: (orderId, reason) => {
    return api.put(`/orders/${orderId}/cancel`, { reason });
  },

  // Track order
  trackOrder: (orderId) => {
    return api.get(`/orders/${orderId}/track`);
  },

  // Get order timeline
  getOrderTimeline: (orderId) => {
    return api.get(`/orders/${orderId}/timeline`);
  },

  // Download invoice
  downloadInvoice: (orderId) => {
    return api.get(`/orders/${orderId}/invoice`, { responseType: 'blob' });
  },

  // Request refund
  requestRefund: (orderId, refundData) => {
    return api.post(`/orders/${orderId}/refund`, refundData);
  },

  // Get refund status
  getRefundStatus: (orderId) => {
    return api.get(`/orders/${orderId}/refund-status`);
  },

  // Add order review
  addOrderReview: (orderId, productId, reviewData) => {
    return api.post(`/orders/${orderId}/products/${productId}/review`, reviewData);
  },

  // Reorder items
  reorderItems: (orderId) => {
    return api.post(`/orders/${orderId}/reorder`);
  },

  // Get order statistics
  getOrderStats: (params = {}) => {
    return api.get('/orders/stats', { params });
  },

  // Process payment for order
  processPayment: (orderId, paymentData) => {
    return api.post(`/orders/${orderId}/payment`, paymentData);
  },

  // Verify payment
  verifyPayment: (orderId, paymentId) => {
    return api.post(`/orders/${orderId}/verify-payment`, { paymentId });
  },

  // Update shipping address
  updateShippingAddress: (orderId, addressData) => {
    return api.put(`/orders/${orderId}/shipping-address`, addressData);
  },

  // Update billing address
  updateBillingAddress: (orderId, addressData) => {
    return api.put(`/orders/${orderId}/billing-address`, addressData);
  },

  // Get order items
  getOrderItems: (orderId) => {
    return api.get(`/orders/${orderId}/items`);
  },

  // Update order item
  updateOrderItem: (orderId, itemId, updateData) => {
    return api.put(`/orders/${orderId}/items/${itemId}`, updateData);
  },

  // Get delivery options
  getDeliveryOptions: (orderId) => {
    return api.get(`/orders/${orderId}/delivery-options`);
  },

  // Schedule delivery
  scheduleDelivery: (orderId, deliveryData) => {
    return api.post(`/orders/${orderId}/schedule-delivery`, deliveryData);
  },

  // Reschedule delivery
  rescheduleDelivery: (orderId, deliveryData) => {
    return api.put(`/orders/${orderId}/reschedule-delivery`, deliveryData);
  },

  // Get order notifications
  getOrderNotifications: (orderId) => {
    return api.get(`/orders/${orderId}/notifications`);
  },

  // Mark notification as read
  markNotificationAsRead: (orderId, notificationId) => {
    return api.put(`/orders/${orderId}/notifications/${notificationId}/read`);
  },

  // Get return policy
  getReturnPolicy: (orderId) => {
    return api.get(`/orders/${orderId}/return-policy`);
  },

  // Initiate return
  initiateReturn: (orderId, returnData) => {
    return api.post(`/orders/${orderId}/return`, returnData);
  },

  // Get return status
  getReturnStatus: (orderId, returnId) => {
    return api.get(`/orders/${orderId}/returns/${returnId}`);
  },

  // Upload return documents
  uploadReturnDocuments: (orderId, returnId, formData) => {
    return api.post(`/orders/${orderId}/returns/${returnId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Get order support tickets
  getSupportTickets: (orderId) => {
    return api.get(`/orders/${orderId}/support-tickets`);
  },

  // Create support ticket
  createSupportTicket: (orderId, ticketData) => {
    return api.post(`/orders/${orderId}/support-tickets`, ticketData);
  },

  // Get gift options
  getGiftOptions: (orderId) => {
    return api.get(`/orders/${orderId}/gift-options`);
  },

  // Update gift options
  updateGiftOptions: (orderId, giftData) => {
    return api.put(`/orders/${orderId}/gift-options`, giftData);
  },

  // Send gift notification
  sendGiftNotification: (orderId, notificationData) => {
    return api.post(`/orders/${orderId}/send-gift-notification`, notificationData);
  },
};

export default orderAPI;