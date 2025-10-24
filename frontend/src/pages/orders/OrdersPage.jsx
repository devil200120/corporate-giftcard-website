import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { fetchUserOrders } from '../../store/slices/orderSlice';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, pagination } = useSelector(state => state.orders);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (isAuthenticated) {
      const params = {
        page: 1,
        search: searchQuery,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        dateRange: dateFilter !== 'all' ? dateFilter : undefined,
        sortBy
      };
      dispatch(fetchUserOrders(params));
    }
  }, [dispatch, isAuthenticated, searchQuery, statusFilter, dateFilter, sortBy]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <ClockIcon className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <TruckIcon className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ClockIcon className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Sign in to view your orders
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Track your purchases and view order history.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading && !orders.length) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
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
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage your purchases
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Time</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 3 Months</option>
              <option value="year">This Year</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Highest Amount</option>
              <option value="amount-low">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="flex items-start gap-4 mb-4 lg:mb-0">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Order #{order.orderNumber}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <CalendarDaysIcon className="w-4 h-4" />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CurrencyDollarIcon className="w-4 h-4" />
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Status Badge */}
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>

                      {/* View Details Button */}
                      <Link
                        to={`/orders/${order.id}`}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center gap-4 overflow-x-auto pb-2">
                      {order.items.slice(0, 4).map((item, index) => (
                        <div key={index} className="flex-shrink-0 flex items-center gap-3 min-w-[200px]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Qty: {item.quantity} × ${item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="flex-shrink-0 text-sm text-gray-500 dark:text-gray-400">
                          +{order.items.length - 4} more item{order.items.length - 4 !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tracking Info */}
                  {order.tracking && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <TruckIcon className="w-4 h-4 text-primary-600" />
                        <span className="text-gray-600 dark:text-gray-400">Tracking:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{order.tracking.number}</span>
                        <span className="text-gray-600 dark:text-gray-400">via {order.tracking.carrier}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-2">
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const params = {
                          page: i + 1,
                          search: searchQuery,
                          status: statusFilter !== 'all' ? statusFilter : undefined,
                          dateRange: dateFilter !== 'all' ? dateFilter : undefined,
                          sortBy
                        };
                        dispatch(fetchUserOrders(params));
                      }}
                      className={`px-3 py-2 rounded ${
                        pagination.currentPage === i + 1
                          ? 'bg-primary-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No orders found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'You haven\'t placed any orders yet'}
            </p>
            {!searchQuery && statusFilter === 'all' && dateFilter === 'all' ? (
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Start Shopping
              </Link>
            ) : (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setDateFilter('all');
                  setSortBy('newest');
                }}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
