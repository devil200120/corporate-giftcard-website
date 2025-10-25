import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  GiftIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
  fetchFeaturedProducts,
  fetchRecommendedProducts,
  fetchProducts,
} from "../store/slices/productSlice";
import { fetchCategories } from "../store/slices/categorySlice";
import ProductCard from "../components/product/ProductCard";
import CategoryCard from "../components/category/CategoryCard";
import { transformProducts } from "../utils/productTransform";

const HomePage = () => {
  const dispatch = useDispatch();
  const {
    featuredProducts: rawFeaturedProducts,
    recommendedProducts: rawRecommendedProducts,
    products: rawProducts,
    isLoading,
  } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { user } = useSelector((state) => state.auth);

  // Transform products for display
  const featuredProducts = transformProducts(rawFeaturedProducts || []);
  const recommendedProducts = transformProducts(rawRecommendedProducts || []);
  const products = transformProducts(rawProducts || []);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchRecommendedProducts());
    dispatch(fetchCategories());
    // Fetch trending products (latest products with good ratings)
    dispatch(
      fetchProducts({
        limit: 8,
        sortBy: "createdAt",
        sortOrder: "desc",
        featured: true,
      })
    );
  }, [dispatch]);

  const features = [
    {
      icon: TruckIcon,
      title: "Free Shipping",
      description: "On orders over $100",
      color: "text-blue-600",
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure Payment",
      description: "100% secure transactions",
      color: "text-green-600",
    },
    {
      icon: CurrencyDollarIcon,
      title: "Best Prices",
      description: "Competitive pricing guaranteed",
      color: "text-yellow-600",
    },
    {
      icon: UserGroupIcon,
      title: "24/7 Support",
      description: "Expert customer service",
      color: "text-purple-600",
    },
  ];

  const stats = [
    { label: "Happy Customers", value: "50,000+", icon: UserGroupIcon },
    { label: "Products Delivered", value: "1M+", icon: GiftIcon },
    { label: "Corporate Partners", value: "5,000+", icon: BuildingOffice2Icon },
    { label: "Years of Excellence", value: "15+", icon: StarIcon },
  ];

  return (
    <div className="bg-white">
      {/* Modern Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-gray-100 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative z-10 pt-6 pb-12 sm:pt-8 sm:pb-16 lg:pt-12 lg:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  India's Premier Corporate Gifting Partner
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] mb-4 sm:mb-6">
                  Premium
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
                    Corporate Gifts
                  </span>
                  <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-700 font-semibold mt-2">
                    That Create Impact
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-xl">
                  Transform your business relationships with our curated
                  collection of premium wooden gifts, executive accessories, and
                  custom branded merchandise.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
                  >
                    Explore Collection
                    <ArrowRightIcon className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-300 text-gray-700 hover:border-yellow-500 hover:text-yellow-600 font-semibold rounded-lg transition-all duration-300 text-sm sm:text-base"
                  >
                    Get Custom Quote
                  </Link>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 space-y-2 sm:space-y-0 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Free Customization
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Pan-India Delivery
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Bulk Discounts
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div className="space-y-2 sm:space-y-4">
                      <div className="bg-white p-2 sm:p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <img
                          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop"
                          alt="Wooden Gift"
                          className="w-full h-16 sm:h-24 object-cover rounded-lg mb-2 sm:mb-3"
                        />
                        <p className="text-xs font-medium text-gray-700">
                          Premium Wooden Gifts
                        </p>
                      </div>
                      <div className="bg-white p-2 sm:p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <img
                          src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=150&fit=crop"
                          alt="Executive Accessories"
                          className="w-full h-16 sm:h-24 object-cover rounded-lg mb-2 sm:mb-3"
                        />
                        <p className="text-xs font-medium text-gray-700">
                          Executive Accessories
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-4 mt-4 sm:mt-8">
                      <div className="bg-white p-2 sm:p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <img
                          src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=150&fit=crop"
                          alt="Gift Sets"
                          className="w-full h-16 sm:h-24 object-cover rounded-lg mb-2 sm:mb-3"
                        />
                        <p className="text-xs font-medium text-gray-700">
                          Luxury Gift Sets
                        </p>
                      </div>
                      <div className="bg-white p-2 sm:p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <img
                          src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=150&fit=crop"
                          alt="Awards"
                          className="w-full h-16 sm:h-24 object-cover rounded-lg mb-2 sm:mb-3"
                        />
                        <p className="text-xs font-medium text-gray-700">
                          Awards & Trophies
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 sm:-bottom-4 -right-2 sm:-right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 sm:px-4 py-2 sm:py-3 rounded-xl shadow-lg">
                    <div className="text-xs font-medium">Starting from</div>
                    <div className="text-lg sm:text-xl font-bold">₹299</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Banner */}
      <section className="bg-white border-y border-gray-200 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center justify-center sm:justify-start space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TruckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Free Shipping
                </p>
                <p className="text-xs text-gray-500">Orders above ₹500</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Secure Payment
                </p>
                <p className="text-xs text-gray-500">100% Protected</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <UserGroupIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Expert Support
                </p>
                <p className="text-xs text-gray-500">24/7 Available</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <GiftIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Custom Branding
                </p>
                <p className="text-xs text-gray-500">Logo & Packaging</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Why Choose Gift Galore?
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Trusted by 5000+ companies across India for premium corporate
              gifting solutions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center group bg-white p-4 sm:p-6 rounded-lg hover:shadow-md transition-all duration-200">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <TruckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">
                Pan-India Delivery
              </h3>
              <p className="text-xs text-gray-600">Fast & reliable shipping</p>
            </div>

            <div className="text-center group bg-white p-4 sm:p-6 rounded-lg hover:shadow-md transition-all duration-200">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">
                Quality Assured
              </h3>
              <p className="text-xs text-gray-600">Premium materials only</p>
            </div>

            <div className="text-center group bg-white p-4 sm:p-6 rounded-lg hover:shadow-md transition-all duration-200">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <GiftIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">
                Free Customization
              </h3>
              <p className="text-xs text-gray-600">Logo & branding included</p>
            </div>

            <div className="text-center group bg-white p-4 sm:p-6 rounded-lg hover:shadow-md transition-all duration-200">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <UserGroupIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">
                Expert Support
              </h3>
              <p className="text-xs text-gray-600">24/7 customer care</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 sm:mb-8 gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Shop by Category
              </h2>
              <p className="text-sm text-gray-600">
                Discover our premium collection across different categories
              </p>
            </div>
            <Link
              to="/categories"
              className="text-yellow-600 hover:text-yellow-700 text-sm font-semibold flex items-center self-start sm:self-auto"
            >
              View All
              <ChevronRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Main Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* Wooden Corporate Gifts */}
            <Link
              to="/category/wooden-corporate-gifts"
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-yellow-300"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop&crop=center"
                  alt="Wooden Corporate Gifts"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="p-2 sm:p-3 text-center">
                <h3 className="text-xs font-semibold text-gray-900 mb-1 group-hover:text-yellow-600 transition-colors">
                  Wooden Gifts
                </h3>
                <p className="text-xs text-gray-500">150+ items</p>
              </div>
            </Link>

            {/* Premium Gift Sets */}
            <Link
              to="/category/premium-gift-sets"
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-yellow-300"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop&crop=center"
                  alt="Premium Gift Sets"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="text-xs font-semibold text-gray-900 mb-1 group-hover:text-yellow-600 transition-colors">
                  Gift Sets
                </h3>
                <p className="text-xs text-gray-500">80+ items</p>
              </div>
            </Link>

            {/* Executive Accessories */}
            <Link
              to="/category/executive-accessories"
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-yellow-300"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop&crop=center"
                  alt="Executive Accessories"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="text-xs font-semibold text-gray-900 mb-1 group-hover:text-yellow-600 transition-colors">
                  Executive Items
                </h3>
                <p className="text-xs text-gray-500">120+ items</p>
              </div>
            </Link>

            {/* Tech Accessories */}
            <Link
              to="/category/tech-accessories"
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-yellow-300"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=300&h=300&fit=crop&crop=center"
                  alt="Tech Accessories"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="text-xs font-semibold text-gray-900 mb-1 group-hover:text-yellow-600 transition-colors">
                  Tech Items
                </h3>
                <p className="text-xs text-gray-500">90+ items</p>
              </div>
            </Link>

            {/* Promotional Items */}
            <Link
              to="/category/promotional-items"
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-yellow-300"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=300&fit=crop&crop=center"
                  alt="Promotional Items"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="text-xs font-semibold text-gray-900 mb-1 group-hover:text-yellow-600 transition-colors">
                  Promotional
                </h3>
                <p className="text-xs text-gray-500">200+ items</p>
              </div>
            </Link>

            {/* Awards & Trophies */}
            <Link
              to="/category/awards-trophies"
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-yellow-300"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=300&fit=crop&crop=center"
                  alt="Awards & Trophies"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="text-xs font-semibold text-gray-900 mb-1 group-hover:text-yellow-600 transition-colors">
                  Awards
                </h3>
                <p className="text-xs text-gray-500">60+ items</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 sm:mb-8 gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Trending Products
              </h2>
              <p className="text-sm text-gray-600">
                Most popular gifts chosen by leading companies
              </p>
            </div>
            <Link
              to="/products"
              className="text-yellow-600 hover:text-yellow-700 text-sm font-semibold flex items-center self-start sm:self-auto"
            >
              View All
              <ChevronRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Real Products Grid */}
          {!isLoading &&
          (products?.length > 0 || featuredProducts?.length > 0) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Show featured products first, then regular products */}
              {(featuredProducts?.length > 0 ? featuredProducts : products)
                .slice(0, 8)
                .map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                  />
                ))}
            </div>
          ) : (
            /* Fallback to sample products if no real products are available */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Sample Featured Products */}
              <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center"
                    alt="Wooden Desk Organizer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                      SALE
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                    Wooden Desk Organizer
                  </h3>
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      ₹1,299
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ₹1,599
                    </span>
                  </div>
                </div>
              </div>

              <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&crop=center"
                    alt="Executive Pen Set"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-green-500 text-white px-2 py-1 text-xs font-bold rounded">
                      NEW
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                    Executive Pen Set
                  </h3>
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      ₹2,499
                    </span>
                  </div>
                </div>
              </div>

              <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center"
                    alt="Premium Gift Box"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                    Premium Gift Box
                  </h3>
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(4)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-current" />
                    ))}
                    <StarIcon className="w-4 h-4 text-gray-300" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      ₹3,999
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ₹4,999
                    </span>
                  </div>
                </div>
              </div>

              <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop&crop=center"
                    alt="Tech Accessories Kit"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-500 text-white px-2 py-1 text-xs font-bold rounded">
                      TRENDING
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                    Tech Accessories Kit
                  </h3>
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      ₹1,799
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white shadow-md rounded-lg"
                >
                  <div className="bg-gray-300 h-48 mb-4 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="bg-gray-300 h-4 rounded mb-2"></div>
                    <div className="bg-gray-300 h-4 rounded w-2/3 mb-2"></div>
                    <div className="bg-gray-300 h-6 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold transition-colors"
            >
              VIEW ALL PRODUCTS
              <ArrowRightIcon className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-8 sm:py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 items-start">
            {/* Content Section */}
            <div className="lg:col-span-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-white">
                About Gift Galore
              </h2>
              <div className="space-y-3 sm:space-y-4 text-sm leading-relaxed">
                <p className="text-gray-300">
                  We are India's leading corporate gifting company, specializing
                  in premium wooden gifts, executive accessories, and custom
                  branded merchandise. With over 15 years of experience, we help
                  businesses build stronger relationships through thoughtful
                  gifting.
                </p>
                <p className="text-gray-300">
                  Our commitment to quality craftsmanship and exceptional
                  service has made us the trusted choice for 5000+ companies
                  across India.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                    5000+
                  </div>
                  <div className="text-xs text-slate-800 font-medium">
                    Happy Clients
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                    15+
                  </div>
                  <div className="text-xs text-blue-100 font-medium">
                    Years Experience
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                    50000+
                  </div>
                  <div className="text-xs text-green-100 font-medium">
                    Orders Delivered
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                    100%
                  </div>
                  <div className="text-xs text-purple-100 font-medium">
                    Satisfaction Rate
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Dashboard Preview */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Analytics Dashboard
                  </div>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-blue-500 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">223</div>
                    <div className="text-xs text-blue-100">Total Clicks</div>
                  </div>
                  <div className="bg-teal-500 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">17.6K</div>
                    <div className="text-xs text-teal-100">
                      Total Impressions
                    </div>
                  </div>
                  <div className="bg-green-500 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">1.3%</div>
                    <div className="text-xs text-green-100">Average CTR</div>
                  </div>
                  <div className="bg-purple-500 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">25.2</div>
                    <div className="text-xs text-purple-100">
                      Average Position
                    </div>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="bg-gray-700 rounded-lg p-3 h-24">
                  <div className="flex items-end justify-between h-full space-x-1">
                    <div className="bg-blue-400 w-2 h-8 rounded-sm opacity-70"></div>
                    <div className="bg-blue-500 w-2 h-12 rounded-sm opacity-80"></div>
                    <div className="bg-blue-400 w-2 h-6 rounded-sm opacity-60"></div>
                    <div className="bg-blue-500 w-2 h-16 rounded-sm"></div>
                    <div className="bg-blue-400 w-2 h-10 rounded-sm opacity-75"></div>
                    <div className="bg-blue-500 w-2 h-14 rounded-sm opacity-90"></div>
                    <div className="bg-blue-400 w-2 h-8 rounded-sm opacity-70"></div>
                    <div className="bg-blue-500 w-2 h-18 rounded-sm"></div>
                    <div className="bg-blue-400 w-2 h-12 rounded-sm opacity-80"></div>
                    <div className="bg-blue-500 w-2 h-10 rounded-sm opacity-75"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-8 sm:py-12 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Get in Touch
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Ready to start your corporate gifting journey? We're here to help
              you every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 text-center hover:shadow-md transition-shadow">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3">
                <PhoneIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Call Us
              </h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 font-medium">
                  +91 98765 43210
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  +91 98765 43211
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-2">Mon-Fri, 9AM-6PM IST</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 text-center hover:shadow-md transition-shadow">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-3">
                <EnvelopeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Email Us
              </h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 font-medium">
                  info@giftgalore.com
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  sales@giftgalore.com
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Response within 2 hours
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 text-center hover:shadow-md transition-shadow">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-3">
                <MapPinIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Visit Us
              </h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 font-medium">
                  123 Business District
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  Mumbai, Maharashtra 400001
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-2">Open Mon-Sat</p>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Contact Us Now
              <ArrowRightIcon className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
