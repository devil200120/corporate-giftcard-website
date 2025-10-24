import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CogIcon,
  UsersIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BanknotesIcon,
  GiftIcon,
  BuildingStorefrontIcon,
  UserCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import {
  fetchAllUsers,
  fetchAllOrders,
  fetchAllProducts,
  updateUserStatus,
  deleteUser,
  updateProductStatus,
  deleteProduct,
  fetchPlatformAnalytics,
  fetchReports,
  updateOrderStatus,
} from "../../store/slices/adminSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, orders, products, analytics, reports, isLoading } =
    useSelector((state) => state.admin);

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedItems, setSelectedItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    userStatus: "",
    orderStatus: "",
    productCategory: "",
    dateRange: "30",
    searchTerm: "",
  });

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllOrders());
    dispatch(fetchAllProducts());
    dispatch(fetchPlatformAnalytics());
    dispatch(fetchReports());
  }, [dispatch]);

  const handleBulkAction = (action, items) => {
    console.log(`Bulk action: ${action}`, items);
  };

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Header Section with Welcome */}
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-3xl p-8">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to GiftGalore Admin
            </h1>
            <p className="text-white/90 text-lg">
              Manage your e-commerce platform with powerful insights and tools
            </p>
          </div>
          <div className="hidden lg:block">
            <SparklesIcon className="w-20 h-20 text-white/30" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="group relative bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-yellow-200">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg shadow-md">
                <UsersIcon className="w-5 h-5 text-white" />
              </div>
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">
                Total Users
              </p>
              <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {analytics?.totalUsers?.toLocaleString() || "2,847"}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  <ArrowTrendingUpIcon className="w-3 h-3" />+
                  {analytics?.userGrowth || 12}%
                </span>
                <span className="text-xs text-gray-500">this month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="group relative bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-yellow-200">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg shadow-md">
                <ShoppingBagIcon className="w-5 h-5 text-white" />
              </div>
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">
                Total Orders
              </p>
              <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {analytics?.totalOrders?.toLocaleString() || "1,429"}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  <ArrowTrendingUpIcon className="w-3 h-3" />+
                  {analytics?.orderGrowth || 18}%
                </span>
                <span className="text-xs text-gray-500">this month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="group relative bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-yellow-200">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg shadow-md">
                <BanknotesIcon className="w-5 h-5 text-white" />
              </div>
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">
                Total Revenue
              </p>
              <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                ${analytics?.totalRevenue?.toLocaleString() || "485,293"}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  <ArrowTrendingUpIcon className="w-3 h-3" />+
                  {analytics?.revenueGrowth || 24}%
                </span>
                <span className="text-xs text-gray-500">this month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="group relative bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-yellow-200">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg shadow-md">
                <GiftIcon className="w-5 h-5 text-white" />
              </div>
              <StarIcon className="w-4 h-4 text-yellow-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Products</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {analytics?.totalProducts?.toLocaleString() || "1,847"}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  <CheckCircleIcon className="w-3 h-3" />
                  {analytics?.activeProducts || 1624} active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Sales Overview
              </h3>
              <p className="text-gray-600 text-sm">
                Revenue and order trends over time
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                7D
              </button>
              <button className="px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
                30D
              </button>
              <button className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                90D
              </button>
            </div>
          </div>
          <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">
                Sales Chart Visualization
              </p>
              <p className="text-gray-500 text-sm">
                Chart component integration needed
              </p>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Top Products</h3>
            <button className="text-sm font-medium text-yellow-600 hover:text-yellow-700 transition-colors">
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {[
              {
                name: "Executive Leather Portfolio",
                sales: 342,
                revenue: "$28,490",
                trend: "+12%",
              },
              {
                name: "Wireless Charging Pad",
                sales: 287,
                revenue: "$8,610",
                trend: "+8%",
              },
              {
                name: "Premium Gift Set",
                sales: 234,
                revenue: "$9,360",
                trend: "+15%",
              },
              {
                name: "Crystal Achievement Award",
                sales: 189,
                revenue: "$20,790",
                trend: "+22%",
              },
            ].map((product, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    #{index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {product.sales} sales • {product.revenue}
                  </p>
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {product.trend}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
              <p className="text-gray-600 text-xs">
                Latest customer orders and status
              </p>
            </div>
            <button
              onClick={() => setActiveTab("orders")}
              className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-medium rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              View All
              <ChevronDownIcon className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {orders?.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-3 h-3 rounded-full shadow-lg ${
                      order.status === "delivered"
                        ? "bg-green-500"
                        : order.status === "shipped"
                          ? "bg-blue-500"
                          : order.status === "processing"
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                    }`}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Order #{order.orderNumber}
                    </p>
                    <p className="text-sm text-gray-600">{`${order.customer?.firstName} ${order.customer?.lastName}`}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    ${order.total?.toFixed(2) || "0.00"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">System Alerts</h3>
              <p className="text-gray-600 text-xs">
                Important notifications and warnings
              </p>
            </div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="bg-red-500 p-2 rounded-lg">
                <ExclamationTriangleIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-red-800">Low Stock Alert</p>
                <p className="text-sm text-red-700 mt-1">
                  15 products are running low on stock
                </p>
                <button className="text-xs font-medium text-red-600 hover:text-red-700 mt-2">
                  View Products →
                </button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="bg-yellow-500 p-2 rounded-lg">
                <ClockIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-yellow-800">Pending Reviews</p>
                <p className="text-sm text-yellow-700 mt-1">
                  28 product reviews awaiting approval
                </p>
                <button className="text-xs font-medium text-yellow-600 hover:text-yellow-700 mt-2">
                  Review Now →
                </button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="bg-blue-500 p-2 rounded-lg">
                <UserCircleIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-blue-800">
                  Corporate Registrations
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  5 corporate accounts pending approval
                </p>
                <button className="text-xs font-medium text-blue-600 hover:text-blue-700 mt-2">
                  Review Applications →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            {
              icon: PlusIcon,
              label: "Add Product",
              color: "from-green-500 to-green-600",
            },
            {
              icon: UsersIcon,
              label: "Manage Users",
              color: "from-blue-500 to-blue-600",
            },
            {
              icon: ShoppingBagIcon,
              label: "View Orders",
              color: "from-purple-500 to-purple-600",
            },
            {
              icon: ChartBarIcon,
              label: "Analytics",
              color: "from-orange-500 to-orange-600",
            },
            {
              icon: CogIcon,
              label: "Settings",
              color: "from-gray-500 to-gray-600",
            },
            {
              icon: DocumentTextIcon,
              label: "Reports",
              color: "from-yellow-500 to-yellow-600",
            },
          ].map((action, index) => (
            <button
              key={index}
              className="group flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105"
            >
              <div
                className={`bg-gradient-to-br ${action.color} p-2 rounded-lg shadow-md group-hover:shadow-lg transition-shadow`}
              >
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          User Management
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <FunnelIcon className="w-4 h-4" />
            Filters
          </button>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            Export Users
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={filters.searchTerm}
                onChange={(e) =>
                  setFilters({ ...filters, searchTerm: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={filters.userStatus}
              onChange={(e) =>
                setFilters({ ...filters, userStatus: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">All Types</option>
              <option value="individual">Individual</option>
              <option value="corporate">Corporate</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">All time</option>
            </select>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500">
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Users
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {users?.length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Active Users
          </p>
          <p className="text-2xl font-bold text-green-600">
            {users?.filter((u) => u.status === "active").length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Corporate Users
          </p>
          <p className="text-2xl font-bold text-blue-600">
            {users?.filter((u) => u.type === "corporate").length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            New This Month
          </p>
          <p className="text-2xl font-bold text-purple-600">
            {users?.filter(
              (u) =>
                new Date(u.createdAt) >
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            ).length || 0}
          </p>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-blue-800 dark:text-blue-400">
              {selectedItems.length} users selected
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction("suspend", selectedItems)}
                className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
              >
                Suspend
              </button>
              <button
                onClick={() => handleBulkAction("activate", selectedItems)}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction("delete", selectedItems)}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(users?.map((u) => u.id) || []);
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users?.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={selectedItems.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems([...selectedItems, user.id]);
                        } else {
                          setSelectedItems(
                            selectedItems.filter((id) => id !== user.id)
                          );
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || "/api/placeholder/40/40"}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.type === "corporate"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.type === "corporate" ? "Corporate" : "Individual"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : user.status === "suspended"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {user.totalOrders || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    ${user.totalSpent?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button className="text-gray-500 hover:text-blue-600">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="text-gray-500 hover:text-green-600">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="text-gray-500 hover:text-red-600">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOrdersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Order Management
        </h2>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
          Export Orders
        </button>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Orders
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {orders?.length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
          <p className="text-xl font-bold text-yellow-600">
            {orders?.filter((o) => o.status === "pending").length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400">Processing</p>
          <p className="text-xl font-bold text-blue-600">
            {orders?.filter((o) => o.status === "processing").length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400">Shipped</p>
          <p className="text-xl font-bold text-purple-600">
            {orders?.filter((o) => o.status === "shipped").length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400">Delivered</p>
          <p className="text-xl font-bold text-green-600">
            {orders?.filter((o) => o.status === "delivered").length || 0}
          </p>
        </div>
      </div>

      {/* Orders Table with similar structure as users table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders?.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    #{order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{`${order.customer?.firstName} ${order.customer?.lastName}`}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.customer?.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {order.items?.length || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    ${order.total?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        dispatch(
                          updateOrderStatus({
                            orderId: order.id,
                            status: e.target.value,
                          })
                        )
                      }
                      className={`px-2 py-1 text-xs rounded border-0 ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button className="text-gray-500 hover:text-blue-600">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="text-gray-500 hover:text-green-600">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProductsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Product Management
        </h2>
        <div className="flex gap-3">
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            Add Product
          </button>
          <button className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            Export Products
          </button>
        </div>
      </div>

      {/* Product Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Products
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {products?.length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Active Products
          </p>
          <p className="text-2xl font-bold text-green-600">
            {products?.filter((p) => p.status === "active").length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400">Low Stock</p>
          <p className="text-2xl font-bold text-red-600">
            {products?.filter((p) => p.stock < 10).length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Out of Stock
          </p>
          <p className="text-2xl font-bold text-red-600">
            {products?.filter((p) => p.stock === 0).length || 0}
          </p>
        </div>
      </div>

      {/* Products Grid/Table View Toggle and Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {products?.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0] || "/api/placeholder/50/50"}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          SKU: {product.sku}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    ${product.price?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`font-medium ${
                        product.stock === 0
                          ? "text-red-600"
                          : product.stock < 10
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        product.status === "active"
                          ? "bg-green-100 text-green-800"
                          : product.status === "draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {product.totalSales || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button className="text-gray-500 hover:text-blue-600">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="text-gray-500 hover:text-green-600">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="text-gray-500 hover:text-red-600">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "overview", name: "Overview", icon: ChartBarIcon },
    { id: "users", name: "Users", icon: UsersIcon },
    { id: "orders", name: "Orders", icon: ShoppingBagIcon },
    { id: "products", name: "Products", icon: GiftIcon },
    { id: "analytics", name: "Analytics", icon: ChartBarIcon },
    { id: "reports", name: "Reports", icon: DocumentTextIcon },
    { id: "settings", name: "Settings", icon: CogIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gradient-to-r from-yellow-200 to-pink-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-lg shadow-md">
                <BuildingStorefrontIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 text-sm">
                  GiftGalore Platform Administration
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select className="px-4 py-2 border border-orange-200 rounded-lg bg-white/80 text-gray-900 text-sm shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400">
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-3">
        <nav className="flex space-x-4 py-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap text-sm ${activeTab === tab.id
                  ? "bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white shadow-lg"
                  : "bg-white/80 backdrop-blur-sm text-gray-600 hover:text-gray-900 hover:bg-white border border-orange-100 hover:border-orange-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-orange-100 p-4">
          {activeTab === "overview" && renderOverviewTab()}
          {activeTab === "users" && renderUsersTab()}
          {activeTab === "orders" && renderOrdersTab()}
          {activeTab === "products" && renderProductsTab()}
          {activeTab === "analytics" && (
            <div className="text-center py-8">
              <div className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl inline-block mb-4">
                <ChartBarIcon className="w-12 h-12 text-orange-500 mx-auto" />
              </div>
              <p className="text-gray-600 text-lg font-medium">
                Advanced analytics dashboard coming soon...
              </p>
            </div>
          )}
          {activeTab === "reports" && (
            <div className="text-center py-8">
              <div className="p-4 bg-gradient-to-r from-orange-100 to-pink-100 rounded-xl inline-block mb-4">
                <DocumentTextIcon className="w-12 h-12 text-pink-500 mx-auto" />
              </div>
              <p className="text-gray-600 text-lg font-medium">
                Detailed reports panel coming soon...
              </p>
            </div>
          )}
          {activeTab === "settings" && (
            <div className="text-center py-8">
              <div className="p-4 bg-gradient-to-r from-pink-100 to-yellow-100 rounded-xl inline-block mb-4">
                <CogIcon className="w-12 h-12 text-yellow-500 mx-auto" />
              </div>
              <p className="text-gray-600 text-lg font-medium">
                System settings panel coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
