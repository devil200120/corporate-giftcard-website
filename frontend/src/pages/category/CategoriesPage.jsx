import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCategories,
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from "../../store/slices/categorySlice";
import {
  ArrowRightIcon,
  CubeIcon,
  GiftIcon,
  SparklesIcon,
  HeartIcon,
  BuildingOffice2Icon,
  TrophyIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const isLoading = useSelector(selectCategoriesLoading);
  const error = useSelector(selectCategoriesError);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fallback categories for when API is not available
  const fallbackCategories = [
    {
      _id: "1",
      name: "Executive Gifts",
      slug: "executive-gifts",
      description:
        "Premium gifts for corporate executives and business leaders.",
      isActive: true,
      isFeatured: true,
      productCount: 45,
    },
    {
      _id: "2",
      name: "Wooden Gifts",
      slug: "wooden-gifts",
      description: "Handcrafted wooden items perfect for corporate gifting.",
      isActive: true,
      isFeatured: false,
      productCount: 32,
    },
    {
      _id: "3",
      name: "Personalized Gifts",
      slug: "personalized-gifts",
      description: "Custom branded and personalized corporate gifts.",
      isActive: true,
      isFeatured: true,
      productCount: 67,
    },
    {
      _id: "4",
      name: "Awards & Recognition",
      slug: "awards-recognition",
      description: "Trophies, plaques, and recognition awards.",
      isActive: true,
      isFeatured: false,
      productCount: 28,
    },
    {
      _id: "5",
      name: "Promotional Items",
      slug: "promotional-items",
      description: "Branded promotional materials and marketing items.",
      isActive: true,
      isFeatured: false,
      productCount: 89,
    },
    {
      _id: "6",
      name: "Gift Hampers",
      slug: "gift-hampers",
      description: "Curated gift hampers for special occasions.",
      isActive: true,
      isFeatured: true,
      productCount: 23,
    },
  ];

  const categoryIcons = {
    "executive-gifts": BuildingOffice2Icon,
    "wooden-gifts": CubeIcon,
    "personalized-gifts": HeartIcon,
    "awards-recognition": TrophyIcon,
    "promotional-items": SparklesIcon,
    "gift-hampers": GiftIcon,
    "office-supplies": ShoppingBagIcon,
    "eco-friendly": SparklesIcon,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="text-center">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 mb-8">
              Unable to load categories. Please try again later.
            </p>
            <button
              onClick={() => dispatch(fetchCategories())}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Use API categories if available, otherwise use fallback
  const categoriesData =
    categories && categories.length > 0 ? categories : fallbackCategories;
  const activeCategories = categoriesData.filter(
    (category) => category?.isActive
  );

  if (!categoriesData || activeCategories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <GiftIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              No Categories Available
            </h1>
            <p className="text-gray-600 mb-8">
              Categories will appear here once they are added by the
              administrator.
            </p>
            <Link
              to="/products"
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-all inline-flex items-center"
            >
              Browse All Products
              <ArrowRightIcon className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse All Categories
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive range of premium corporate gifts and
            promotional items. Each category is carefully curated to help you
            find the perfect gift for every occasion.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {activeCategories.map((category) => {
            const IconComponent = categoryIcons[category.slug] || GiftIcon;

            return (
              <Link
                key={category._id}
                to={`/categories/${category.slug}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Category Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg flex items-center justify-center group-hover:from-orange-200 group-hover:to-yellow-200 transition-colors">
                    <IconComponent className="w-6 h-6 text-orange-600" />
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transform group-hover:translate-x-1 transition-all" />
                </div>

                {/* Category Info */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {category.description}
                </p>

                {/* Category Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {category.productCount || 0} Products
                  </span>
                  {category.isFeatured && (
                    <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded font-medium">
                      Featured
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our team specializes in creating custom corporate gifting solutions.
            Let us help you find or create the perfect gift for your specific
            needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Contact Our Experts
              <ArrowRightIcon className="ml-2 w-4 h-4" />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600 font-semibold rounded-lg transition-all duration-300"
            >
              Browse All Products
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <GiftIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Premium Quality
            </h3>
            <p className="text-gray-600 text-sm">
              All our products are carefully selected and quality-tested to
              ensure excellence.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <HeartIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Personalization
            </h3>
            <p className="text-gray-600 text-sm">
              Custom branding and personalization options available for most
              products.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrophyIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Trusted by 5000+
            </h3>
            <p className="text-gray-600 text-sm">
              Companies across India trust us for their corporate gifting needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
