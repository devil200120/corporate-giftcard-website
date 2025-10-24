import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  BuildingOffice2Icon,
  UsersIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  CogIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import {
  fetchCorporateOrders,
  fetchTeamMembers,
  createBulkOrder,
  inviteTeamMember,
  updateTeamMember,
  removeTeamMember,
  getCorporateAnalytics,
} from "../../store/slices/corporateSlice";

const CorporateDashboard = () => {
  const dispatch = useDispatch();
  const { user, corporateOrders, teamMembers, analytics, isLoading } =
    useSelector((state) => state.corporate);

  const [activeTab, setActiveTab] = useState("overview");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showBulkOrderModal, setShowBulkOrderModal] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);

  const [inviteForm, setInviteForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "employee",
    department: "",
    spendingLimit: 1000,
  });

  const [bulkOrderForm, setBulkOrderForm] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    items: [],
  });

  useEffect(() => {
    dispatch(fetchCorporateOrders());
    dispatch(fetchTeamMembers());
    dispatch(getCorporateAnalytics());
  }, [dispatch]);

  const handleInviteTeamMember = async (e) => {
    e.preventDefault();
    try {
      await dispatch(inviteTeamMember(inviteForm)).unwrap();
      setShowInviteModal(false);
      setInviteForm({
        email: "",
        firstName: "",
        lastName: "",
        role: "employee",
        department: "",
        spendingLimit: 1000,
      });
    } catch (error) {
      console.error("Failed to invite team member:", error);
    }
  };

  const handleCreateBulkOrder = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createBulkOrder(bulkOrderForm)).unwrap();
      setShowBulkOrderModal(false);
      setBulkOrderForm({
        title: "",
        description: "",
        budget: "",
        deadline: "",
        items: [],
      });
    } catch (error) {
      console.error("Failed to create bulk order:", error);
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Orders
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics?.totalOrders || 0}
              </p>
            </div>
            <ShoppingCartIcon className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+12% from last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Spend
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${analytics?.totalSpend?.toLocaleString() || 0}
              </p>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+8% from last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Team Members
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {teamMembers?.length || 0}
              </p>
            </div>
            <UserGroupIcon className="w-8 h-8 text-purple-500" />
          </div>
          <div className="mt-4">
            <span className="text-sm text-blue-600">5 active buyers</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Avg Order Value
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${analytics?.avgOrderValue || 0}
              </p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-orange-500" />
          </div>
          <div className="mt-4">
            <span className="text-sm text-red-600">-3% from last month</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowBulkOrderModal(true)}
            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          >
            <PlusIcon className="w-6 h-6 text-primary-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">
                Create Bulk Order
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Order gifts for multiple recipients
              </p>
            </div>
          </button>

          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          >
            <UsersIcon className="w-6 h-6 text-primary-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">
                Invite Team Member
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add new team members
              </p>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
            <ArrowDownTrayIcon className="w-6 h-6 text-primary-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">
                Export Report
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Download spending reports
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Recent Orders
          </h3>
          <button
            onClick={() => setActiveTab("orders")}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View All →
          </button>
        </div>
        <div className="space-y-4">
          {corporateOrders?.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Order #{order.orderNumber}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {order.items.length} items •{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">
                  ${order.total.toFixed(2)}
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOrdersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Corporate Orders
        </h2>
        <button
          onClick={() => setShowBulkOrderModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          Create Bulk Order
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">All Departments</option>
            <option value="hr">Human Resources</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
            <option value="engineering">Engineering</option>
          </select>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ordered By
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
              {corporateOrders?.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        #{order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.type || "Standard"}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{`${order.orderedBy?.firstName} ${order.orderedBy?.lastName}`}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.orderedBy?.department}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {order.items.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button className="text-gray-500 hover:text-primary-600">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="text-gray-500 hover:text-blue-600">
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

  const renderTeamTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Team Management
        </h2>
        <button
          onClick={() => setShowInviteModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          Invite Member
        </button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Members
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {teamMembers?.length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Active This Month
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {teamMembers?.filter((m) => m.lastActive).length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Spending
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            $
            {teamMembers
              ?.reduce((sum, m) => sum + (m.totalSpent || 0), 0)
              .toFixed(2) || "0.00"}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Avg Spending
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            $
            {teamMembers?.length
              ? (
                  teamMembers.reduce((sum, m) => sum + (m.totalSpent || 0), 0) /
                  teamMembers.length
                ).toFixed(2)
              : "0.00"}
          </p>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Spending Limit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {teamMembers?.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar || "/api/placeholder/40/40"}
                        alt={`${member.firstName} ${member.lastName}`}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{`${member.firstName} ${member.lastName}`}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white capitalize">
                    {member.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {member.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    ${member.spendingLimit?.toLocaleString() || "0"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900 dark:text-white">
                      ${member.totalSpent?.toFixed(2) || "0.00"}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {member.spendingLimit
                        ? `${((member.totalSpent / member.spendingLimit) * 100).toFixed(1)}% used`
                        : ""}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {member.lastActive
                      ? new Date(member.lastActive).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button className="text-gray-500 hover:text-blue-600">
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
    { id: "orders", name: "Orders", icon: ShoppingCartIcon },
    { id: "team", name: "Team", icon: UsersIcon },
    { id: "analytics", name: "Analytics", icon: ChartBarIcon },
    { id: "settings", name: "Settings", icon: CogIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BuildingOffice2Icon className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Corporate Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {user?.company?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex space-x-8 py-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "overview" && renderOverviewTab()}
        {activeTab === "orders" && renderOrdersTab()}
        {activeTab === "team" && renderTeamTab()}
        {activeTab === "analytics" && (
          <div className="text-center py-12">
            <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Analytics dashboard coming soon...
            </p>
          </div>
        )}
        {activeTab === "settings" && (
          <div className="text-center py-12">
            <CogIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Settings panel coming soon...
            </p>
          </div>
        )}
      </div>

      {/* Invite Team Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
              Invite Team Member
            </h3>
            <form onSubmit={handleInviteTeamMember} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  required
                  value={inviteForm.firstName}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, firstName: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  required
                  value={inviteForm.lastName}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, lastName: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                required
                value={inviteForm.email}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={inviteForm.role}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, role: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
                <input
                  type="text"
                  placeholder="Department"
                  value={inviteForm.department}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, department: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Spending Limit
                </label>
                <input
                  type="number"
                  value={inviteForm.spendingLimit}
                  onChange={(e) =>
                    setInviteForm({
                      ...inviteForm,
                      spendingLimit: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Order Modal */}
      {showBulkOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
              Create Bulk Order
            </h3>
            <form onSubmit={handleCreateBulkOrder} className="space-y-4">
              <input
                type="text"
                placeholder="Order Title"
                required
                value={bulkOrderForm.title}
                onChange={(e) =>
                  setBulkOrderForm({ ...bulkOrderForm, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
              <textarea
                placeholder="Description"
                rows={3}
                value={bulkOrderForm.description}
                onChange={(e) =>
                  setBulkOrderForm({
                    ...bulkOrderForm,
                    description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Budget"
                  value={bulkOrderForm.budget}
                  onChange={(e) =>
                    setBulkOrderForm({
                      ...bulkOrderForm,
                      budget: e.target.value,
                    })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="date"
                  placeholder="Deadline"
                  value={bulkOrderForm.deadline}
                  onChange={(e) =>
                    setBulkOrderForm({
                      ...bulkOrderForm,
                      deadline: e.target.value,
                    })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowBulkOrderModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorporateDashboard;
