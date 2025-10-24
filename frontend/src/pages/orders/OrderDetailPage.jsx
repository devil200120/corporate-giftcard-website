import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeftIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  MapPinIcon,
  CreditCardIcon,
  PrinterIcon,
  ArrowPathIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import { 
  fetchOrderDetails, 
  cancelOrder, 
  reorderItems,
  downloadInvoice 
} from '../../store/slices/orderSlice';
import { addToCart } from '../../store/slices/cartSlice';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentOrder, isLoading } = useSelector(state => state.orders);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-6 h-6 text-yellow-500" />;
      case 'processing':
        return <ClockIcon className="w-6 h-6 text-blue-500" />;
      case 'shipped':
        return <TruckIcon className="w-6 h-6 text-purple-500" />;
      case 'delivered':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case 'cancelled':
        return <XCircleIcon className="w-6 h-6 text-red-500" />;
      default:
        return <ClockIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const canCancelOrder = (status) => {
    return ['pending', 'processing'].includes(status);
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    setIsCancelling(true);
    try {
      await dispatch(cancelOrder({ orderId, reason: cancelReason })).unwrap();
      toast.success('Order cancelled successfully');
      setShowCancelModal(false);
      // Refresh order details
      dispatch(fetchOrderDetails(orderId));
    } catch (error) {
      toast.error(error.message || 'Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReorder = async () => {
    setIsReordering(true);
    try {
      // Add all items to cart
      for (const item of currentOrder.items) {
        dispatch(addToCart({
          id: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          personalization: item.personalization
        }));
      }
      toast.success('Items added to cart');
      navigate('/cart');
    } catch (error) {
      toast.error('Failed to add items to cart');
    } finally {
      setIsReordering(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      await dispatch(downloadInvoice(orderId)).unwrap();
      toast.success('Invoice downloaded');
    } catch (error) {
      toast.error('Failed to download invoice');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading || !currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-8"></div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Orders
          </button>
        </div>

        {/* Order Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Order #{currentOrder.orderNumber}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <CalendarDaysIcon className="w-4 h-4" />
                  <span>Placed on {formatDate(currentOrder.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(currentOrder.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentOrder.status)}`}>
                    {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
              {canCancelOrder(currentOrder.status) && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium"
                >
                  <XCircleIcon className="w-4 h-4" />
                  Cancel Order
                </button>
              )}
              <button
                onClick={handleReorder}
                disabled={isReordering}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium disabled:opacity-50"
              >
                <ArrowPathIcon className="w-4 h-4" />
                {isReordering ? 'Adding to Cart...' : 'Reorder'}
              </button>
              <button
                onClick={handleDownloadInvoice}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
              >
                <DocumentTextIcon className="w-4 h-4" />
                Download Invoice
              </button>
            </div>
          </div>

          {/* Order Progress */}
          {currentOrder.status !== 'cancelled' && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Progress</h3>
              <div className="flex items-center justify-between">
                {['pending', 'processing', 'shipped', 'delivered'].map((status, index) => {
                  const isActive = ['pending', 'processing', 'shipped', 'delivered'].indexOf(currentOrder.status) >= index;
                  const isCurrent = currentOrder.status === status;
                  
                  return (
                    <div key={status} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        isActive 
                          ? isCurrent
                            ? 'bg-primary-600 text-white'
                            : 'bg-green-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {isActive && !isCurrent ? (
                          <CheckCircleIcon className="w-5 h-5" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="ml-2 min-w-0">
                        <p className={`text-sm font-medium ${
                          isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </p>
                      </div>
                      {index < 3 && (
                        <div className={`flex-1 h-0.5 mx-4 ${
                          ['pending', 'processing', 'shipped', 'delivered'].indexOf(currentOrder.status) > index
                            ? 'bg-green-600'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Shipping Address */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPinIcon className="w-5 h-5" />
              Shipping Address
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p className="font-medium text-gray-900 dark:text-white">
                {currentOrder.shippingAddress.firstName} {currentOrder.shippingAddress.lastName}
              </p>
              <p>{currentOrder.shippingAddress.address}</p>
              <p>
                {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.zipCode}
              </p>
              <p>{currentOrder.shippingAddress.country}</p>
              {currentOrder.shippingAddress.phone && (
                <p className="flex items-center gap-1 mt-2">
                  <PhoneIcon className="w-4 h-4" />
                  {currentOrder.shippingAddress.phone}
                </p>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CreditCardIcon className="w-5 h-5" />
              Payment Information
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="text-gray-900 dark:text-white">
                  {currentOrder.paymentMethod === 'card' ? 'Credit Card' : currentOrder.paymentMethod}
                </span>
              </div>
              {currentOrder.paymentMethod === 'card' && (
                <div className="flex justify-between">
                  <span>Card:</span>
                  <span className="text-gray-900 dark:text-white">
                    **** **** **** {currentOrder.cardLast4}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Transaction ID:</span>
                <span className="text-gray-900 dark:text-white font-mono text-xs">
                  {currentOrder.transactionId}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Info */}
        {currentOrder.tracking && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TruckIcon className="w-5 h-5" />
              Tracking Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {currentOrder.tracking.carrier}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tracking Number: {currentOrder.tracking.number}
                  </p>
                </div>
                <a
                  href={currentOrder.tracking.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
                >
                  Track Package
                </a>
              </div>
              {currentOrder.tracking.estimatedDelivery && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Estimated Delivery: {formatDate(currentOrder.tracking.estimatedDelivery)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Order Items ({currentOrder.items.length})
          </h3>
          <div className="space-y-4">
            {currentOrder.items.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    {item.name}
                  </h4>
                  {item.personalization && (
                    <div className="flex items-center gap-2 mb-2 text-sm text-primary-600">
                      <GiftIcon className="w-4 h-4" />
                      <span>Personalized: {item.personalization}</span>
                    </div>
                  )}
                  <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.color && <span>Color: {item.color}</span>}
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ${item.price} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Order Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="text-gray-900 dark:text-white">${currentOrder.subtotal.toFixed(2)}</span>
            </div>
            {currentOrder.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Discount</span>
                <span className="text-green-600">-${currentOrder.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Shipping</span>
              <span className="text-gray-900 dark:text-white">
                {currentOrder.shipping === 0 ? 'Free' : `$${currentOrder.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Tax</span>
              <span className="text-gray-900 dark:text-white">${currentOrder.tax.toFixed(2)}</span>
            </div>
            {currentOrder.giftWrapping && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Gift Wrapping</span>
                <span className="text-gray-900 dark:text-white">$5.00</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-900 dark:text-white">Total</span>
              <span className="text-gray-900 dark:text-white">${currentOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Gift Message */}
        {currentOrder.giftMessage && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <GiftIcon className="w-5 h-5" />
              Gift Message
            </h3>
            <p className="text-gray-600 dark:text-gray-400 italic">
              "{currentOrder.giftMessage}"
            </p>
          </div>
        )}

        {/* Cancel Order Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Cancel Order
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for cancellation *
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="changed-mind">Changed my mind</option>
                  <option value="found-better-price">Found a better price</option>
                  <option value="ordered-wrong-item">Ordered wrong item</option>
                  <option value="no-longer-needed">No longer needed</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={isCancelling || !cancelReason}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;
