import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  fetchProducts,
  setFilters,
  setSortBy,
  clearFilters,
} from "../store/slices/productSlice";
import ProductCard from "../components/product/ProductCard";
import ProductFilters from "../components/product/ProductFilters";
import ProductSort from "../components/product/ProductSort";
import Pagination from "../components/common/Pagination";
import { transformProducts } from "../utils/productTransform";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);

  const {
    products: rawProducts,
    pagination,
    isLoading,
    filters,
    sortBy,
  } = useSelector((state) => state.products);

  const { totalProducts, currentPage, totalPages } = pagination;

  // Transform products for display
  const products = transformProducts(rawProducts || []);

  // Debug logging
  console.log("Raw products:", rawProducts);
  console.log("Transformed products:", products);

  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    // Parse URL parameters
    const params = {};
    for (let [key, value] of searchParams.entries()) {
      params[key] = value;
    }

    // Set filters from URL
    if (Object.keys(params).length > 0) {
      dispatch(setFilters(params));
    }

    // Fetch products
    dispatch(
      fetchProducts({
        ...params,
        page: params.page || 1,
        limit: 20,
      })
    );
  }, [dispatch, searchParams]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));

    // Update URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "" && value.length > 0) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, value);
        }
      }
    });
    setSearchParams(params);
  };

  const handleSortChange = (newSortBy) => {
    dispatch(setSortBy(newSortBy));
    const params = new URLSearchParams(searchParams);
    params.set("sortBy", newSortBy);
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchParams({});
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(
      (value) =>
        value &&
        value !== "" &&
        (Array.isArray(value) ? value.length > 0 : true)
    ).length;
  };

  const renderProductGrid = () => {
    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      );
    } else {
      return (
        <div className="space-y-5">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                <div className="flex-shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full md:w-48 h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                        {product.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                        {product.rating && (
                          <span className="flex items-center">
                            <span className="text-yellow-400 mr-1">★</span>
                            {product.rating}/5
                          </span>
                        )}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock > 10
                              ? "bg-green-100 text-green-700"
                              : product.stock > 0
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.stock > 0
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                      <div className="text-2xl font-bold text-gray-900">
                        ₹{product.price?.toFixed(2) || "0.00"}
                      </div>
                      <button
                        disabled={product.stock === 0}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                      >
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Premium Corporate Gifts
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our curated collection of high-quality corporate gifts
              perfect for your business needs
            </p>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4">
              <p className="text-sm font-medium text-gray-900">
                {totalProducts} {totalProducts === 1 ? "product" : "products"}
                {searchParams.get("q") && (
                  <span className="text-gray-600">
                    {" "}
                    for "{searchParams.get("q")}"
                  </span>
                )}
              </p>
              {getActiveFiltersCount() > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {getActiveFiltersCount()} filter
                  {getActiveFiltersCount() !== 1 ? "s" : ""} applied
                </span>
              )}
            </div>

            {/* View Toggle & Sort */}
            <div className="flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-yellow-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  title="Grid View"
                >
                  <Squares2X2Icon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-yellow-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  title="List View"
                >
                  <ListBulletIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <ProductSort sortBy={sortBy} onSortChange={handleSortChange} />

              {/* Mobile Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm"
              >
                <FunnelIcon className="w-4 h-4" />
                <span className="font-medium">Filters</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div
            className={`w-full lg:w-72 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2 text-yellow-600" />
                  Filters
                </h2>
                <div className="flex items-center space-x-2">
                  {getActiveFiltersCount() > 0 && (
                    <button
                      onClick={handleClearFilters}
                      className="text-sm text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <ProductFilters
                filters={filters}
                categories={categories}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                      <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
                      <div className="bg-gray-200 h-4 rounded mb-2"></div>
                      <div className="bg-gray-200 h-3 rounded w-2/3 mb-2"></div>
                      <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (products || []).length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md mx-auto">
                  <div className="text-gray-300 text-5xl mb-4">🎁</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm">
                    We couldn't find any products matching your criteria. Try
                    adjusting your filters or search terms.
                  </p>
                  {getActiveFiltersCount() > 0 && (
                    <button
                      onClick={handleClearFilters}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {renderProductGrid()}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex justify-center">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-2xl overflow-y-auto">
            <div className="p-5">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">
                  Filter Products
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <ProductFilters
                filters={filters}
                categories={categories}
                onFilterChange={handleFilterChange}
              />

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 rounded-lg font-semibold transition-all shadow-md"
                >
                  Apply Filters
                </button>
                {getActiveFiltersCount() > 0 && (
                  <button
                    onClick={() => {
                      handleClearFilters();
                      setShowFilters(false);
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
