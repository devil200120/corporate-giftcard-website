import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChartBarIcon,
  UsersIcon,
  ShoppingBagIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  ArrowPathIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  GiftIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { fetchAnalyticsData } from "../../store/slices/adminSlice";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const AdminAnalytics = () => {
  const dispatch = useDispatch();
  const { analyticsData, analyticsLoading } = useSelector(
    (state) => state.admin
  );

  const [dateRange, setDateRange] = useState("30"); // Default to 30 days
  const [period, setPeriod] = useState("day");
  const [activeChart, setActiveChart] = useState("sales");

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, period]);

  const fetchAnalytics = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(dateRange));

    dispatch(
      fetchAnalyticsData({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        period: period,
      })
    );
  };

  // Calculate summary statistics
  const calculateSummaryStats = () => {
    if (!analyticsData?.salesData) return {};

    const totalRevenue = analyticsData.salesData.reduce(
      (sum, item) => sum + (item.revenue || 0),
      0
    );
    const totalOrders = analyticsData.salesData.reduce(
      (sum, item) => sum + (item.orders || 0),
      0
    );
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const totalUsers =
      analyticsData.userRegistrations?.reduce(
        (sum, item) => sum + (item.newUsers || 0),
        0
      ) || 0;

    // Calculate growth rates (comparing last period with previous period)
    const midPoint = Math.floor(analyticsData.salesData.length / 2);
    const recentRevenue = analyticsData.salesData
      .slice(midPoint)
      .reduce((sum, item) => sum + (item.revenue || 0), 0);
    const previousRevenue = analyticsData.salesData
      .slice(0, midPoint)
      .reduce((sum, item) => sum + (item.revenue || 0), 0);
    const revenueGrowth =
      previousRevenue > 0
        ? ((recentRevenue - previousRevenue) / previousRevenue) * 100
        : 0;

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      totalUsers,
      revenueGrowth,
      activeCustomers: analyticsData.customerAnalytics?.activeCustomers || 0,
      totalCustomers: analyticsData.customerAnalytics?.totalCustomers || 0,
      avgOrdersPerCustomer:
        analyticsData.customerAnalytics?.averageOrdersPerCustomer || 0,
      avgSpentPerCustomer:
        analyticsData.customerAnalytics?.averageSpentPerCustomer || 0,
    };
  };

  const stats = calculateSummaryStats();

  // Chart data preparation
  const salesChartData = {
    labels:
      analyticsData?.salesData?.map((item) => {
        if (period === "day") {
          return `${item._id.day}/${item._id.month}`;
        }
        return `${item._id.month}/${item._id.year}`;
      }) || [],
    datasets: [
      {
        label: "Revenue ($)",
        data: analyticsData?.salesData?.map((item) => item.revenue) || [],
        borderColor: "rgb(249, 115, 22)",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        fill: true,
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Orders",
        data: analyticsData?.salesData?.map((item) => item.orders) || [],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        yAxisID: "y1",
      },
    ],
  };

  const userRegistrationChartData = {
    labels:
      analyticsData?.userRegistrations?.map((item) => {
        if (period === "day") {
          return `${item._id.day}/${item._id.month}`;
        }
        return `${item._id.month}/${item._id.year}`;
      }) || [],
    datasets: [
      {
        label: "New Users",
        data:
          analyticsData?.userRegistrations?.map((item) => item.newUsers) || [],
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 2,
      },
    ],
  };

  const categoryChartData = {
    labels:
      analyticsData?.categoryPerformance?.map((item) => item.categoryName) ||
      [],
    datasets: [
      {
        label: "Revenue by Category",
        data:
          analyticsData?.categoryPerformance?.map(
            (item) => item.totalRevenue
          ) || [],
        backgroundColor: [
          "rgba(249, 115, 22, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(245, 158, 11, 0.8)",
        ],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        beginAtZero: true,
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          padding: 8,
          maxTicksLimit: 6,
        },
        title: {
          display: true,
          text: "Revenue ($)",
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          padding: 8,
          maxTicksLimit: 6,
        },
        title: {
          display: true,
          text: "Orders",
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
      x: {
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          padding: 8,
          maxTicksLimit: 8,
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2,
      },
      line: {
        borderWidth: 3,
        tension: 0.4,
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
          },
          generateLabels: function (chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const backgroundColor = dataset.backgroundColor[i];
                return {
                  text: label,
                  fillStyle: backgroundColor,
                  strokeStyle: backgroundColor,
                  lineWidth: 0,
                  pointStyle: "circle",
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.formattedValue || "";
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${label}: $${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "50%",
    radius: "80%",
  };

  if (analyticsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl">
                  <ChartBarIcon className="w-6 md:w-8 h-6 md:h-8 text-white" />
                </div>
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Comprehensive insights into your business performance
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              >
                <option value="day">Daily</option>
                <option value="month">Monthly</option>
              </select>
              <button
                onClick={fetchAnalytics}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <ArrowPathIcon className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Revenue
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 break-words">
                  $
                  {stats.totalRevenue?.toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                  }) || "0"}
                </p>
                <div className="flex items-center mt-2 flex-wrap">
                  {stats.revenueGrowth >= 0 ? (
                    <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1 flex-shrink-0" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 mr-1 flex-shrink-0" />
                  )}
                  <span
                    className={`text-sm font-medium ${stats.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {Math.abs(stats.revenueGrowth).toFixed(1)}%
                  </span>
                  <span className="text-gray-500 text-sm ml-1">
                    vs last period
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex-shrink-0">
                <BanknotesIcon className="w-6 md:w-8 h-6 md:h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Orders
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 break-words">
                  {stats.totalOrders?.toLocaleString() || "0"}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-500 truncate">
                    Avg: ${stats.avgOrderValue?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex-shrink-0">
                <ShoppingBagIcon className="w-6 md:w-8 h-6 md:h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Customers
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 break-words">
                  {stats.totalCustomers?.toLocaleString() || "0"}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-500 truncate">
                    {stats.activeCustomers} active customers
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex-shrink-0">
                <UsersIcon className="w-6 md:w-8 h-6 md:h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Avg Customer Value
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 break-words">
                  ${stats.avgSpentPerCustomer?.toFixed(2) || "0.00"}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-500 truncate">
                    {stats.avgOrdersPerCustomer?.toFixed(1) || "0"} orders per
                    customer
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex-shrink-0">
                <CurrencyDollarIcon className="w-6 md:w-8 h-6 md:h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Charts
              </h2>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "sales", label: "Sales Overview", icon: ChartBarIcon },
                  { id: "users", label: "User Growth", icon: UsersIcon },
                  { id: "categories", label: "Categories", icon: GiftIcon },
                ].map((chart) => (
                  <button
                    key={chart.id}
                    onClick={() => setActiveChart(chart.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeChart === chart.id
                        ? "bg-orange-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <chart.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">{chart.label}</span>
                    <span className="sm:hidden">
                      {chart.label.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="h-80 md:h-96">
              {activeChart === "sales" && (
                <div className="h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Sales & Revenue Trends
                  </h3>
                  <div className="h-full">
                    <Line data={salesChartData} options={chartOptions} />
                  </div>
                </div>
              )}

              {activeChart === "users" && (
                <div className="h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    User Registration Trends
                  </h3>
                  <div className="h-full">
                    <Bar
                      data={userRegistrationChartData}
                      options={{
                        ...chartOptions,
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: "rgba(156, 163, 175, 0.2)",
                            },
                          },
                          x: {
                            grid: {
                              color: "rgba(156, 163, 175, 0.2)",
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              )}

              {activeChart === "categories" && (
                <div className="h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Revenue by Category
                  </h3>
                  <div className="h-full flex items-center justify-center">
                    <div className="w-full max-w-md">
                      <Doughnut
                        data={categoryChartData}
                        options={pieChartOptions}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Analytics Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <GiftIcon className="w-5 h-5 text-orange-500 flex-shrink-0" />
                Top Performing Categories
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {analyticsData?.categoryPerformance
                  ?.slice(0, 5)
                  .map((category, index) => (
                    <div
                      key={category._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">
                            #{index + 1}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">
                            {category.categoryName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {category.totalOrders} orders
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-gray-900">
                          ${category.totalRevenue.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {category.totalQuantity} items
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                Top Customers
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {analyticsData?.customerAnalytics?.topSpenders
                  ?.slice(0, 5)
                  .map((customer, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">
                            #{index + 1}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">
                            {customer.name}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-gray-900">
                          ${customer.totalSpent.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {customer.totalOrders} orders
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Business Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              Business Insights
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <h4 className="font-semibold text-green-800 mb-2">
                  Customer Retention
                </h4>
                <p className="text-3xl font-bold text-green-600 mb-2">
                  {stats.totalCustomers > 0
                    ? (
                        (stats.activeCustomers / stats.totalCustomers) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </p>
                <p className="text-sm text-green-700">Active customers</p>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Conversion Rate
                </h4>
                <p className="text-3xl font-bold text-blue-600 mb-2">
                  {stats.totalUsers > 0 && stats.totalCustomers > 0
                    ? ((stats.totalCustomers / stats.totalUsers) * 100).toFixed(
                        1
                      )
                    : 0}
                  %
                </p>
                <p className="text-sm text-blue-700">Users to customers</p>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-xl">
                <h4 className="font-semibold text-orange-800 mb-2">
                  Revenue Growth
                </h4>
                <p className="text-3xl font-bold text-orange-600 mb-2">
                  {stats.revenueGrowth.toFixed(1)}%
                </p>
                <p className="text-sm text-orange-700">vs previous period</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
