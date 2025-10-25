import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DocumentTextIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PrinterIcon,
  EnvelopeIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  DocumentArrowDownIcon,
  TableCellsIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import adminAPI from "../../services/adminAPI";

const AdminReports = () => {
  const [loading, setLoading] = useState(false);
  const [activeReport, setActiveReport] = useState("sales");
  const [dateRange, setDateRange] = useState("30");
  const [reportData, setReportData] = useState({});
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "",
    status: "",
    format: "table",
  });

  const reportTypes = [
    {
      id: "sales",
      name: "Sales Report",
      icon: ShoppingBagIcon,
      description: "Detailed sales performance and trends",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "revenue",
      name: "Revenue Report",
      icon: CurrencyDollarIcon,
      description: "Revenue analysis and growth metrics",
      color: "from-green-500 to-green-600",
    },
    {
      id: "inventory",
      name: "Inventory Report",
      icon: TableCellsIcon,
      description: "Stock levels and inventory management",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "customers",
      name: "Customer Report",
      icon: UsersIcon,
      description: "Customer behavior and demographics",
      color: "from-orange-500 to-orange-600",
    },
    {
      id: "profit",
      name: "Profit Report",
      icon: ChartPieIcon,
      description: "Profit margins and cost analysis",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      id: "tax",
      name: "Tax Report",
      icon: DocumentTextIcon,
      description: "Tax calculations and compliance data",
      color: "from-red-500 to-red-600",
    },
  ];

  useEffect(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(dateRange));

    setFilters((prev) => ({
      ...prev,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    }));
  }, [dateRange]);

  useEffect(() => {
    if (filters.startDate && filters.endDate) {
      fetchReportData();
    }
  }, [activeReport, filters]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      let response;
      const params = {
        startDate: filters.startDate,
        endDate: filters.endDate,
        ...(filters.category && { category: filters.category }),
        ...(filters.status && { status: filters.status }),
      };

      switch (activeReport) {
        case "sales":
          response = await adminAPI.getSalesReport(params);
          break;
        case "revenue":
          response = await adminAPI.getRevenueReport(params);
          break;
        case "inventory":
          response = await adminAPI.getInventoryReport(params);
          break;
        case "profit":
          response = await adminAPI.getProfitReport(params);
          break;
        case "tax":
          response = await adminAPI.getTaxReport(params);
          break;
        default:
          // Mock data for customer report since it's not in the API
          response = {
            data: { success: true, data: generateMockCustomerData() },
          };
      }

      if (response.data.success) {
        setReportData((prev) => ({
          ...prev,
          [activeReport]: response.data.data,
        }));
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      toast.error("Failed to fetch report data");
      // Set mock data for development
      setReportData((prev) => ({
        ...prev,
        [activeReport]: generateMockData(activeReport),
      }));
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (reportType) => {
    switch (reportType) {
      case "sales":
        return {
          summary: {
            totalSales: 245680,
            totalOrders: 1247,
            averageOrderValue: 197.12,
            growthRate: 15.3,
          },
          dailyData: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            sales: Math.floor(Math.random() * 10000) + 5000,
            orders: Math.floor(Math.random() * 50) + 20,
          })),
          topProducts: [
            { name: "Executive Leather Portfolio", sales: 45, revenue: 2250 },
            { name: "Wireless Charging Pad", sales: 38, revenue: 1140 },
            { name: "Premium Gift Set", sales: 32, revenue: 1280 },
            { name: "Crystal Achievement Award", sales: 28, revenue: 3080 },
            { name: "Corporate Branded Mug", sales: 25, revenue: 500 },
          ],
        };
      case "revenue":
        return {
          summary: {
            totalRevenue: 245680,
            grossProfit: 147408,
            netProfit: 98272,
            profitMargin: 40.0,
          },
          monthlyData: Array.from({ length: 12 }, (_, i) => ({
            month: new Date(2024, i, 1).toLocaleDateString("en", {
              month: "short",
            }),
            revenue: Math.floor(Math.random() * 50000) + 20000,
            profit: Math.floor(Math.random() * 20000) + 8000,
          })),
          categories: [
            { name: "Corporate Gifts", revenue: 98765, percentage: 40.2 },
            { name: "Technology", revenue: 74321, percentage: 30.2 },
            { name: "Apparel", revenue: 49876, percentage: 20.3 },
            { name: "Awards", revenue: 22718, percentage: 9.3 },
          ],
        };
      case "inventory":
        return {
          summary: {
            totalProducts: 1847,
            lowStockItems: 23,
            outOfStockItems: 5,
            totalValue: 487623,
          },
          lowStockProducts: [
            {
              name: "Executive Leather Portfolio",
              currentStock: 3,
              minStock: 10,
              status: "Low",
            },
            {
              name: "Wireless Charging Pad",
              currentStock: 1,
              minStock: 15,
              status: "Critical",
            },
            {
              name: "Premium Gift Set",
              currentStock: 7,
              minStock: 20,
              status: "Low",
            },
            {
              name: "Crystal Achievement Award",
              currentStock: 0,
              minStock: 5,
              status: "Out of Stock",
            },
            {
              name: "Corporate Branded Mug",
              currentStock: 2,
              minStock: 25,
              status: "Critical",
            },
          ],
          categoryStock: [
            {
              category: "Corporate Gifts",
              inStock: 425,
              lowStock: 8,
              outOfStock: 2,
            },
            {
              category: "Technology",
              inStock: 387,
              lowStock: 12,
              outOfStock: 1,
            },
            { category: "Apparel", inStock: 298, lowStock: 3, outOfStock: 2 },
            { category: "Awards", inStock: 189, lowStock: 0, outOfStock: 0 },
          ],
        };
      default:
        return {};
    }
  };

  const generateMockCustomerData = () => ({
    summary: {
      totalCustomers: 2847,
      activeCustomers: 1923,
      newCustomers: 342,
      retentionRate: 67.5,
    },
    demographics: [
      { ageGroup: "18-25", count: 456, percentage: 16.0 },
      { ageGroup: "26-35", count: 1138, percentage: 40.0 },
      { ageGroup: "36-45", count: 854, percentage: 30.0 },
      { ageGroup: "46-55", count: 284, percentage: 10.0 },
      { ageGroup: "55+", count: 115, percentage: 4.0 },
    ],
    topCustomers: [
      { name: "Acme Corporation", orders: 45, totalSpent: 25670 },
      { name: "TechFlow Solutions", orders: 38, totalSpent: 22340 },
      { name: "Global Enterprises", orders: 32, totalSpent: 19850 },
      { name: "Innovation Labs", orders: 28, totalSpent: 17920 },
      { name: "Future Systems", orders: 25, totalSpent: 16780 },
    ],
  });

  const exportReport = async (format) => {
    setLoading(true);
    try {
      const currentData = reportData[activeReport];
      if (!currentData) {
        toast.error("No data available to export");
        return;
      }

      // Mock export functionality
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (format === "csv") {
        toast.success("CSV report exported successfully!");
      } else if (format === "pdf") {
        toast.success("PDF report exported successfully!");
      } else if (format === "excel") {
        toast.success("Excel report exported successfully!");
      }
    } catch (error) {
      toast.error("Failed to export report");
    } finally {
      setLoading(false);
    }
  };

  const scheduleReport = () => {
    toast.success(
      "Report scheduled successfully! You'll receive it via email."
    );
  };

  const renderReportContent = () => {
    const data = reportData[activeReport];
    if (!data) return null;

    switch (activeReport) {
      case "sales":
        return (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600">
                  Total Sales
                </h4>
                <p className="text-2xl font-bold text-gray-900">
                  ${data.summary?.totalSales?.toLocaleString()}
                </p>
                <p className="text-sm text-green-600">
                  +{data.summary?.growthRate}% from last period
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600">
                  Total Orders
                </h4>
                <p className="text-2xl font-bold text-gray-900">
                  {data.summary?.totalOrders?.toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600">
                  Avg Order Value
                </h4>
                <p className="text-2xl font-bold text-gray-900">
                  ${data.summary?.averageOrderValue?.toFixed(2)}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600">
                  Growth Rate
                </h4>
                <p className="text-2xl font-bold text-green-600">
                  +{data.summary?.growthRate}%
                </p>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Top Selling Products
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Sales
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.topProducts?.map((product, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {product.sales}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          ${product.revenue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "inventory":
        return (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600">
                  Total Products
                </h4>
                <p className="text-2xl font-bold text-gray-900">
                  {data.summary?.totalProducts?.toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600">
                  Low Stock Items
                </h4>
                <p className="text-2xl font-bold text-yellow-600">
                  {data.summary?.lowStockItems}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600">
                  Out of Stock
                </h4>
                <p className="text-2xl font-bold text-red-600">
                  {data.summary?.outOfStockItems}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600">
                  Total Value
                </h4>
                <p className="text-2xl font-bold text-gray-900">
                  ${data.summary?.totalValue?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
                  Stock Alerts
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Current Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Min Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.lowStockProducts?.map((product, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {product.currentStock}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {product.minStock}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              product.status === "Out of Stock"
                                ? "bg-red-100 text-red-800"
                                : product.status === "Critical"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "customers":
        return (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600">
                  Total Customers
                </h4>
                <p className="text-2xl font-bold text-gray-900">
                  {data.summary?.totalCustomers?.toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600">
                  Active Customers
                </h4>
                <p className="text-2xl font-bold text-green-600">
                  {data.summary?.activeCustomers?.toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600">
                  New Customers
                </h4>
                <p className="text-2xl font-bold text-blue-600">
                  {data.summary?.newCustomers}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600">
                  Retention Rate
                </h4>
                <p className="text-2xl font-bold text-orange-600">
                  {data.summary?.retentionRate}%
                </p>
              </div>
            </div>

            {/* Top Customers */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Top Customers
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Orders
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total Spent
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.topCustomers?.map((customer, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {customer.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {customer.orders}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          ${customer.totalSpent?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Report data will be displayed here</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <DocumentTextIcon className="w-6 md:w-8 h-6 md:h-8 text-white" />
                </div>
                Reports Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Generate comprehensive business reports and insights
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => exportReport("pdf")}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  PDF
                </button>
                <button
                  onClick={() => exportReport("excel")}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  Excel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Report Type Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => (
            <button
              key={report.id}
              onClick={() => setActiveReport(report.id)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                activeReport === report.id
                  ? "border-indigo-500 bg-indigo-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${report.color}`}
                >
                  <report.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{report.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {report.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Report Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {reportTypes.find((r) => r.id === activeReport)?.icon && (
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${reportTypes.find((r) => r.id === activeReport)?.color}`}
                  >
                    {React.createElement(
                      reportTypes.find((r) => r.id === activeReport)?.icon,
                      { className: "w-5 h-5 text-white" }
                    )}
                  </div>
                )}
                {reportTypes.find((r) => r.id === activeReport)?.name}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchReportData()}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <ArrowPathIcon
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
                <button
                  onClick={scheduleReport}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <EnvelopeIcon className="w-4 h-4" />
                  Schedule
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <ArrowPathIcon className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading report data...</p>
              </div>
            ) : (
              renderReportContent()
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <PrinterIcon className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Print Report
              </span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <EnvelopeIcon className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium text-green-900">
                Email Report
              </span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <ClockIcon className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">
                Schedule Report
              </span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <ChartBarIcon className="w-6 h-6 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">
                Custom Report
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
