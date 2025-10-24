import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
  ShoppingBagIcon,
  HeartIcon,
  UserIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  BuildingOffice2Icon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

import {
  selectIsAuthenticated,
  selectUser,
  logoutUser,
} from "../../store/slices/authSlice";
import { selectCartTotalItems } from "../../store/slices/cartSlice";
import { selectWishlistTotalItems } from "../../store/slices/wishlistSlice";
import { selectCategories } from "../../store/slices/categorySlice";
import {
  toggleMobileMenu,
  closeMobileMenu,
  selectIsMobileMenuOpen,
} from "../../store/slices/uiSlice";

import SearchBar from "./SearchBar";
import UserDropdown from "../common/UserDropdown";
import CartSidebar from "./CartSidebar";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const cartItemsCount = useSelector(selectCartTotalItems);
  const wishlistItemsCount = useSelector(selectWishlistTotalItems);
  const categories = useSelector(selectCategories);
  const isMobileMenuOpen = useSelector(selectIsMobileMenuOpen);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);

  const categoriesRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target)
      ) {
        setIsCategoriesOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    dispatch(closeMobileMenu());
  }, [location.pathname, dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
    setIsUserDropdownOpen(false);
  };

  const handleMobileMenuToggle = () => {
    dispatch(toggleMobileMenu());
  };

  const mainCategories = (categories || []).slice(0, 8); // Show only first 8 categories

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        {/* Top Bar */}
        <div className="bg-slate-800 text-white py-1.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <span>📞</span>
                  <span className="hidden sm:inline">+91 98765 43210</span>
                </span>
                <span className="hidden md:flex items-center space-x-1">
                  <span>✉️</span>
                  <span>info@giftgalore.com</span>
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="hidden lg:inline text-yellow-300">
                  🚚 Free Shipping Above ₹500
                </span>
                {!isAuthenticated && (
                  <Link
                    to="/corporate/register"
                    className="hover:text-yellow-300 transition-colors font-medium"
                  >
                    Corporate Account
                  </Link>
                )}
                <Link
                  to="/contact"
                  className="hover:text-yellow-300 transition-colors"
                >
                  Help
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-xl">🎁</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900 leading-none">
                    Gift Galore
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    Premium Gifts
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 ml-8">
              <Link
                to="/"
                className={`font-medium text-gray-700 hover:text-yellow-600 transition-colors text-sm ${
                  location.pathname === "/"
                    ? "text-yellow-600 font-semibold"
                    : ""
                }`}
              >
                Home
              </Link>

              <div className="relative" ref={categoriesRef}>
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center space-x-1 font-medium text-gray-700 hover:text-yellow-600 transition-colors text-sm"
                >
                  <span>Categories</span>
                  <ChevronDownIcon
                    className={`w-3 h-3 transition-transform ${isCategoriesOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isCategoriesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="max-h-80 overflow-y-auto">
                      {mainCategories.map((category) => (
                        <Link
                          key={category._id}
                          to={`/categories/${category.slug}`}
                          onClick={() => setIsCategoriesOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <Link
                        to="/categories"
                        onClick={() => setIsCategoriesOpen(false)}
                        className="block px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50 font-medium"
                      >
                        View All Categories →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/products"
                className={`font-medium text-gray-700 hover:text-yellow-600 transition-colors text-sm ${
                  location.pathname.startsWith("/products")
                    ? "text-yellow-600 font-semibold"
                    : ""
                }`}
              >
                Products
              </Link>

              <Link
                to="/about"
                className={`font-medium text-gray-700 hover:text-yellow-600 transition-colors text-sm ${
                  location.pathname === "/about"
                    ? "text-yellow-600 font-semibold"
                    : ""
                }`}
              >
                About
              </Link>

              {isAuthenticated && user?.role === "corporate_admin" && (
                <Link
                  to="/corporate"
                  className={`flex items-center space-x-1 font-medium text-gray-700 hover:text-yellow-600 transition-colors text-sm ${
                    location.pathname.startsWith("/corporate")
                      ? "text-yellow-600 font-semibold"
                      : ""
                  }`}
                >
                  <BuildingOffice2Icon className="w-3 h-3" />
                  <span>Corporate</span>
                </Link>
              )}
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-sm mx-6">
              <SearchBar isOpen={true} placeholder="Search for gifts..." />
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-yellow-600 transition-colors"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2 text-gray-600 hover:text-yellow-600 transition-colors group"
                title="Wishlist"
              >
                <HeartIcon className="w-5 h-5" />
                {wishlistItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistItemsCount > 9 ? "9+" : wishlistItemsCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={() => setCartSidebarOpen(true)}
                className="relative p-2 text-gray-600 hover:text-yellow-600 transition-colors group"
                title="Shopping Cart"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItemsCount > 9 ? "9+" : cartItemsCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 text-gray-600 hover:text-yellow-600 transition-colors bg-gray-50 rounded-lg"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className="hidden sm:block font-medium text-sm">
                      {user?.firstName || "User"}
                    </span>
                    <ChevronDownIcon className="w-3 h-3" />
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 pb-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.firstName && user?.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : `${user?.firstName} ${user?.lastName}` || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition-colors"
                      >
                        <UserIcon className="w-4 h-4" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition-colors"
                      >
                        <ShoppingBagIcon className="w-4 h-4" />
                        <span>My Orders</span>
                      </Link>
                      {user?.role === "super_admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition-colors"
                        >
                          <Cog6ToothIcon className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <ArrowRightOnRectangleIcon className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="font-medium text-gray-700 hover:text-yellow-600 transition-colors px-3 py-2 text-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black px-4 py-1.5 font-medium transition-all rounded-lg text-sm shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={handleMobileMenuToggle}
                className="lg:hidden p-2 text-gray-600 hover:text-yellow-600 transition-colors ml-1"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white p-3">
            <SearchBar
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
              placeholder="Search for gifts..."
            />
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => dispatch(closeMobileMenu())}
        user={user}
        isAuthenticated={isAuthenticated}
        categories={mainCategories}
        onLogout={handleLogout}
      />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={cartSidebarOpen}
        onClose={() => setCartSidebarOpen(false)}
      />
    </>
  );
};

export default Header;
