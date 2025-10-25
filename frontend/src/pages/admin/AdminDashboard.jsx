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
  fetchAllCategories,
  updateUserStatus,
  deleteUser,
  updateProductStatus,
  deleteProduct,
  fetchPlatformAnalytics,
  fetchReports,
  updateOrderStatus,
} from "../../store/slices/adminSlice";
import { addProduct } from "../../store/slices/productSlice";
import categoryAPI from "../../services/categoryAPI";
import toast from "react-hot-toast";
import AdminProducts from "../../components/admin/AdminProducts";
import AdminUsers from "../../components/admin/AdminUsers";
import AdminAnalytics from "../../components/admin/AdminAnalytics";
import AdminReports from "../../components/admin/AdminReports";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const {
    users,
    orders,
    products,
    adminCategories,
    analytics,
    reports,
    isLoading,
  } = useSelector((state) => state.admin);

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedItems, setSelectedItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    shortDescription: "",
    price: "",
    salePrice: "",
    category: "",
    stock: "",
    brand: "",
    images: [],
    tags: "",
    specifications: "",
    weight: "",
    dimensions: "",
    isFeatured: false,
    isNew: false,
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [categories, setCategories] = useState([]);

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
    dispatch(fetchAllCategories());
    dispatch(fetchPlatformAnalytics());
    dispatch(fetchReports());
    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    console.log("Categories state updated:", categories);
  }, [categories]);

  useEffect(() => {
    console.log("Admin categories updated:", adminCategories);
    if (adminCategories.length > 0) {
      setCategories(adminCategories);
    }
  }, [adminCategories]);

  const fetchCategories = async () => {
    try {
      console.log("Fetching categories...");
      const response = await categoryAPI.getCategories({ active: "all" });
      console.log("Categories API response:", response);
      if (response.data.success && response.data.data.length > 0) {
        console.log("Categories data:", response.data.data);
        setCategories(response.data.data);
      } else {
        console.log(
          "API response empty or not successful, using fallback categories"
        );
        setCategories([
          { _id: "68fb4bca2f23e8f16b0dcf53", name: "Corporate Gifts" },
          { _id: "68fb4bca2f23e8f16b0dcf54", name: "Technology & Gadgets" },
          { _id: "68fb4bca2f23e8f16b0dcf55", name: "Apparel & Accessories" },
          { _id: "68fb4bca2f23e8f16b0dcf56", name: "Home & Office" },
          { _id: "68fb4bca2f23e8f16b0dcf57", name: "Awards & Recognition" },
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      console.error("Error details:", error.response?.data);
      // Set default categories if API fails
      setCategories([
        { _id: "68fb4bca2f23e8f16b0dcf53", name: "Corporate Gifts" },
        { _id: "68fb4bca2f23e8f16b0dcf54", name: "Technology & Gadgets" },
        { _id: "68fb4bca2f23e8f16b0dcf55", name: "Apparel & Accessories" },
        { _id: "68fb4bca2f23e8f16b0dcf56", name: "Home & Office" },
        { _id: "68fb4bca2f23e8f16b0dcf57", name: "Awards & Recognition" },
      ]);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);

    // Create preview URLs
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setImagePreview(previews);

    // Update form state
    setProductForm((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const removeImage = (index) => {
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);

    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(imagePreview[index].url);

    setImageFiles(newImageFiles);
    setImagePreview(newPreviews);
    setProductForm((prev) => ({
      ...prev,
      images: newImageFiles,
    }));
  };

  const handleBulkAction = (action, items) => {
    console.log(`Bulk action: ${action}`, items);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsAddingProduct(true);
    try {
      // Create FormData for image upload
      const formData = new FormData();

      // Generate slug from product name
      const generateSlug = (name) => {
        return name
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, "") // Remove special characters
          .replace(/\s+/g, "-") // Replace spaces with hyphens
          .replace(/-+/g, "-") // Replace multiple hyphens with single
          .trim("-"); // Remove leading/trailing hyphens
      };

      // Add basic product data
      formData.append("name", productForm.name);
      formData.append("slug", generateSlug(productForm.name));
      formData.append("description", productForm.description);
      if (productForm.shortDescription) {
        formData.append("shortDescription", productForm.shortDescription);
      }
      formData.append("sku", `PROD-${Date.now()}`); // Generate a unique SKU
      formData.append("category", productForm.category);

      // Add brand if provided
      if (productForm.brand) {
        formData.append("brand", productForm.brand);
      }

      // Handle price structure (backend expects nested object)
      formData.append("price[regular]", parseFloat(productForm.price));
      if (productForm.salePrice && parseFloat(productForm.salePrice) > 0) {
        formData.append("price[sale]", parseFloat(productForm.salePrice));
      }

      // Handle inventory structure (backend expects nested object)
      formData.append("inventory[stockQuantity]", parseInt(productForm.stock));
      formData.append("inventory[trackQuantity]", "true");

      // Handle dimensions if provided
      if (productForm.weight) {
        formData.append("dimensions[weight]", parseFloat(productForm.weight));
        formData.append("dimensions[weightUnit]", "g");
      }

      // Handle corporate features
      formData.append("corporateFeatures[isCorporateGift]", "true");
      formData.append("corporateFeatures[minBulkOrder]", "50");
      formData.append("corporateFeatures[bulkDiscountAvailable]", "true");

      // Handle product flags
      formData.append("isFeatured", productForm.isFeatured);
      formData.append("isNew", productForm.isNew);
      formData.append("status", "active");
      formData.append("isActive", "true");

      // Handle tags
      if (productForm.tags) {
        const tagsArray = productForm.tags.split(",").map((tag) => tag.trim());
        tagsArray.forEach((tag, index) => {
          formData.append(`tags[${index}]`, tag);
        });
      }

      // Add image files with proper field name
      imageFiles.forEach((file) => {
        formData.append("productImages", file);
      });

      await dispatch(addProduct(formData)).unwrap();
      toast.success("Product added successfully!");
      closeAddProductModal();
      // Refresh products list
      dispatch(fetchAllProducts());
    } catch (error) {
      console.error("Add product error:", error);
      toast.error(error?.message || error || "Failed to add product");
    } finally {
      setIsAddingProduct(false);
    }
  };

  const handleQuickAction = (actionLabel) => {
    switch (actionLabel) {
      case "Add Product":
        setShowAddProductModal(true);
        break;
      case "Manage Users":
        setActiveTab("users");
        break;
      case "View Orders":
        setActiveTab("orders");
        break;
      case "Analytics":
        setActiveTab("analytics");
        break;
      case "Settings":
        setActiveTab("settings");
        break;
      case "Reports":
        setActiveTab("reports");
        break;
      default:
        console.log(`Action: ${actionLabel}`);
    }
  };

  const closeAddProductModal = () => {
    // Clean up image previews to prevent memory leaks
    imagePreview.forEach((preview) => {
      URL.revokeObjectURL(preview.url);
    });

    setShowAddProductModal(false);
    setProductForm({
      name: "",
      description: "",
      shortDescription: "",
      price: "",
      salePrice: "",
      category: "",
      stock: "",
      brand: "",
      images: [],
      tags: "",
      specifications: "",
      weight: "",
      dimensions: "",
      isFeatured: false,
      isNew: false,
    });
    setImageFiles([]);
    setImagePreview([]);
  };

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Header Section with Welcome */}
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
              Welcome to GiftGalore Admin
            </h1>
            <p className="text-white/90 text-sm sm:text-base lg:text-lg">
              Manage your e-commerce platform with powerful insights and tools
            </p>
          </div>
          <div className="hidden md:block flex-shrink-0 ml-4">
            <SparklesIcon className="w-16 h-16 lg:w-20 lg:h-20 text-white/30" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -top-6 -left-6 w-16 h-16 sm:w-24 sm:h-24 bg-white/10 rounded-full blur-lg"></div>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-3 sm:p-4 shadow-md border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Sales Overview
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Revenue and order trends over time
              </p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button className="px-2 sm:px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                7D
              </button>
              <button className="px-2 sm:px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
                30D
              </button>
              <button className="px-2 sm:px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                90D
              </button>
            </div>
          </div>
          <div className="h-48 sm:h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
            <div className="text-center px-4">
              <ChartBarIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 font-medium text-sm sm:text-base">
                Sales Chart Visualization
              </p>
              <p className="text-gray-500 text-xs sm:text-sm">
                Chart component integration needed
              </p>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Top Products
            </h3>
            <button className="text-xs sm:text-sm font-medium text-yellow-600 hover:text-yellow-700 transition-colors">
              View All →
            </button>
          </div>
          <div className="space-y-3 sm:space-y-4">
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
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs sm:text-sm">
                    #{index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate text-sm sm:text-base">
                    {product.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {product.sales} sales • {product.revenue}
                  </p>
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-1.5 sm:px-2 py-1 rounded-full flex-shrink-0">
                  {product.trend}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Recent Orders
              </h3>
              <p className="text-gray-600 text-xs">
                Latest customer orders and status
              </p>
            </div>
            <button
              onClick={() => setActiveTab("orders")}
              className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-medium rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg self-start"
            >
              View All
              <ChevronDownIcon className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {orders?.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                  <div
                    className={`w-3 h-3 rounded-full shadow-lg flex-shrink-0 ${
                      order.status === "delivered"
                        ? "bg-green-500"
                        : order.status === "shipped"
                          ? "bg-blue-500"
                          : order.status === "processing"
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      Order #{order.orderNumber}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{`${order.customer?.firstName} ${order.customer?.lastName}`}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-900 text-sm sm:text-base">
                    ${order.total?.toFixed(2) || "0.00"}
                  </p>
                  <p className="text-xs text-gray-500">
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
      <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md border border-gray-100">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
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
              onClick={() => handleQuickAction(action.label)}
              className="group flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105 cursor-pointer"
            >
              <div
                className={`bg-gradient-to-br ${action.color} p-1.5 sm:p-2 rounded-lg shadow-md group-hover:shadow-lg transition-shadow`}
              >
                <action.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition-colors text-center leading-tight">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsersTab = () => <AdminUsers />;

  const renderOrdersTab = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Order Management
        </h2>
        <button className="bg-primary-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-primary-700 text-sm self-start">
          Export Orders
        </button>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Total Orders
          </p>
          <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            {orders?.length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Pending
          </p>
          <p className="text-lg sm:text-xl font-bold text-yellow-600">
            {orders?.filter((o) => o.status === "pending").length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Processing
          </p>
          <p className="text-lg sm:text-xl font-bold text-blue-600">
            {orders?.filter((o) => o.status === "processing").length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Shipped
          </p>
          <p className="text-lg sm:text-xl font-bold text-purple-600">
            {orders?.filter((o) => o.status === "shipped").length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm col-span-2 sm:col-span-1">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Delivered
          </p>
          <p className="text-lg sm:text-xl font-bold text-green-600">
            {orders?.filter((o) => o.status === "delivered").length || 0}
          </p>
        </div>
      </div>

      {/* Orders Table with similar structure as users table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
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

  const renderProductsTab = () => <AdminProducts />;

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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-lg shadow-md flex-shrink-0">
                <BuildingStorefrontIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent truncate">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm hidden sm:block">
                  GiftGalore Platform Administration
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <select className="px-2 sm:px-4 py-1.5 sm:py-2 border border-orange-200 rounded-lg bg-white/80 text-gray-900 text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400">
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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-2 sm:pt-3">
        <nav className="flex space-x-1 sm:space-x-4 py-2 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-300 whitespace-nowrap text-xs sm:text-sm flex-shrink-0 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white shadow-lg"
                  : "bg-white/80 backdrop-blur-sm text-gray-600 hover:text-gray-900 hover:bg-white border border-orange-100 hover:border-orange-300"
              }`}
            >
              <tab.icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="font-medium">{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-orange-100 p-3 sm:p-4">
          {activeTab === "overview" && renderOverviewTab()}
          {activeTab === "users" && renderUsersTab()}
          {activeTab === "orders" && renderOrdersTab()}
          {activeTab === "products" && renderProductsTab()}
          {activeTab === "analytics" && <AdminAnalytics />}
          {activeTab === "reports" && <AdminReports />}
          {activeTab === "settings" && (
            <div className="text-center py-6 sm:py-8">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-pink-100 to-yellow-100 rounded-xl inline-block mb-4">
                <CogIcon className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500 mx-auto" />
              </div>
              <p className="text-gray-600 text-base sm:text-lg font-medium px-4">
                System settings panel coming soon...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                Add New Product
              </h2>
              <button
                onClick={closeAddProductModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    required
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand (Optional)
                  </label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) =>
                      setProductForm({ ...productForm, brand: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter brand name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Regular Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sale Price ($) - Optional
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.salePrice}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        salePrice: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stock: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter stock quantity"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter detailed product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={productForm.shortDescription}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      shortDescription: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Brief product summary for listings"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                </label>
                <div className="space-y-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />

                  {imagePreview.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreview.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview.url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <XCircleIcon className="w-4 h-4" />
                          </button>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {preview.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-gray-500">
                    Upload multiple images for your product. First image will be
                    the main product image.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={productForm.tags}
                  onChange={(e) =>
                    setProductForm({ ...productForm, tags: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., gift, corporate, premium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (grams) - Optional
                  </label>
                  <input
                    type="number"
                    value={productForm.weight}
                    onChange={(e) =>
                      setProductForm({ ...productForm, weight: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Product weight in grams"
                  />
                </div>

                <div className="flex items-center space-x-6 pt-8">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          isFeatured: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Featured Product
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={productForm.isNew}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          isNew: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      New Product
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specifications (JSON format - optional)
                </label>
                <textarea
                  rows={3}
                  value={productForm.specifications}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      specifications: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder='{"color": "Blue", "size": "Large", "material": "Cotton"}'
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeAddProductModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingProduct}
                  className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isAddingProduct && (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  {isAddingProduct ? "Adding Product..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Beautiful Loading Overlay */}
      {isAddingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center space-y-6 shadow-2xl max-w-md mx-4">
            {/* Animated Product Icon */}
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                <ShoppingBagIcon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-orange-200 rounded-full animate-spin border-t-orange-500"></div>
            </div>

            {/* Loading Text */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Creating Your Product
              </h3>
              <p className="text-gray-600 mb-4">
                Please wait while we process your product details and upload
                images...
              </p>

              {/* Progress Steps */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                  Validating product information
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Uploading images to cloud storage
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  Saving to database
                </div>
              </div>
            </div>

            {/* Animated Dots */}
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
