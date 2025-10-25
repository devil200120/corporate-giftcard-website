import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  XMarkIcon,
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  BuildingOffice2Icon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  TagIcon,
  TruckIcon,
  QuestionMarkCircleIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { logout } from "../../store/slices/authSlice";

const MobileMenu = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { itemCount } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
      // Small delay to ensure the element is rendered before animation
      setTimeout(() => setIsAnimating(false), 10);
    } else {
      setIsAnimating(true);
      // Wait for animation to complete before hiding
      setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
      }, 300);
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLogout = () => {
    dispatch(logout());
    onClose();
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  if (!isVisible) return null;

  const categories = [
    { name: "Corporate Gifts", path: "/categories/corporate-gifts" },
    { name: "Tech Accessories", path: "/categories/tech-accessories" },
    { name: "Promotional Items", path: "/categories/promotional-items" },
    { name: "Custom Merchandise", path: "/categories/custom-merchandise" },
    { name: "Gift Cards", path: "/categories/gift-cards" },
  ];

  return (
    <>
      {/* Backdrop with smooth fade animation */}
      <div
        className={`fixed inset-0 bg-gray-600 z-40 transition-all duration-300 ease-in-out ${
          isAnimating ? "bg-opacity-0" : "bg-opacity-50"
        }`}
        onClick={onClose}
      />

      {/* Menu Panel with smooth slide animation */}
      <div
        className={`fixed inset-y-0 left-0 w-full max-w-sm bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-all duration-300 ease-in-out ${
          isAnimating
            ? "-translate-x-full opacity-0"
            : "translate-x-0 opacity-100"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header with staggered animation */}
          <div
            className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 transform transition-all duration-500 ease-out ${
              isAnimating
                ? "translate-y-4 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
            style={{ transitionDelay: isAnimating ? "0ms" : "100ms" }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                GiftHub
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* User Section with staggered animation */}
          {isAuthenticated ? (
            <div
              className={`p-4 bg-gray-50 dark:bg-gray-700 transform transition-all duration-500 ease-out ${
                isAnimating
                  ? "translate-y-4 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
              style={{ transitionDelay: isAnimating ? "0ms" : "150ms" }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {`${user?.firstName} ${user?.lastName}` || "User"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`p-4 bg-gray-50 dark:bg-gray-700 transform transition-all duration-500 ease-out ${
                isAnimating
                  ? "translate-y-4 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
              style={{ transitionDelay: isAnimating ? "0ms" : "150ms" }}
            >
              <div className="space-y-2">
                <button
                  onClick={() => handleNavigation("/login")}
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavigation("/register")}
                  className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105"
                >
                  Create Account
                </button>
              </div>
            </div>
          )}

          {/* Navigation Content with staggered animation */}
          <div
            className={`flex-1 overflow-y-auto transform transition-all duration-500 ease-out ${
              isAnimating
                ? "translate-y-4 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
            style={{ transitionDelay: isAnimating ? "0ms" : "200ms" }}
          >
            {/* Quick Actions with staggered animation */}
            {isAuthenticated && (
              <div
                className={`p-4 space-y-3 transform transition-all duration-500 ease-out ${
                  isAnimating
                    ? "translate-y-4 opacity-0"
                    : "translate-y-0 opacity-100"
                }`}
                style={{ transitionDelay: isAnimating ? "0ms" : "250ms" }}
              >
                <Link
                  to="/cart"
                  onClick={onClose}
                  className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-sm transform ease-out ${
                    isAnimating
                      ? "translate-y-2 opacity-0"
                      : "translate-y-0 opacity-100"
                  }`}
                  style={{ transitionDelay: isAnimating ? "0ms" : "300ms" }}
                >
                  <div className="flex items-center space-x-3">
                    <ShoppingBagIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Cart
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {itemCount > 0 && (
                      <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                        {itemCount}
                      </span>
                    )}
                    <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>

                <Link
                  to="/wishlist"
                  onClick={onClose}
                  className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-sm transform ease-out ${
                    isAnimating
                      ? "translate-y-2 opacity-0"
                      : "translate-y-0 opacity-100"
                  }`}
                  style={{ transitionDelay: isAnimating ? "0ms" : "350ms" }}
                >
                  <div className="flex items-center space-x-3">
                    <HeartIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Wishlist
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {wishlistItems?.length > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {wishlistItems.length}
                      </span>
                    )}
                    <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>

                <Link
                  to="/orders"
                  onClick={onClose}
                  className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-sm transform ease-out ${
                    isAnimating
                      ? "translate-y-2 opacity-0"
                      : "translate-y-0 opacity-100"
                  }`}
                  style={{ transitionDelay: isAnimating ? "0ms" : "400ms" }}
                >
                  <div className="flex items-center space-x-3">
                    <TruckIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Orders
                    </span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                </Link>
              </div>
            )}

            {/* Categories with staggered animation */}
            <div
              className={`border-t border-gray-200 dark:border-gray-700 transform transition-all duration-500 ease-out ${
                isAnimating
                  ? "translate-y-4 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
              style={{ transitionDelay: isAnimating ? "0ms" : "300ms" }}
            >
              <div className="p-4">
                <h3
                  className={`text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 transform transition-all duration-400 ease-out ${
                    isAnimating
                      ? "translate-y-2 opacity-0"
                      : "translate-y-0 opacity-100"
                  }`}
                  style={{ transitionDelay: isAnimating ? "0ms" : "350ms" }}
                >
                  Categories
                </h3>
                <div className="space-y-1">
                  {categories.map((category, index) => (
                    <Link
                      key={category.path}
                      to={category.path}
                      onClick={onClose}
                      className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-sm hover:translate-x-2 transform ease-out ${
                        isAnimating
                          ? "translate-y-2 opacity-0"
                          : "translate-y-0 opacity-100"
                      }`}
                      style={{
                        transitionDelay: isAnimating
                          ? "0ms"
                          : `${400 + index * 50}ms`,
                      }}
                    >
                      <span className="text-gray-700 dark:text-gray-300">
                        {category.name}
                      </span>
                      <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Navigation with staggered animation */}
            <div
              className={`border-t border-gray-200 dark:border-gray-700 transform transition-all duration-500 ease-out ${
                isAnimating
                  ? "translate-y-4 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
              style={{ transitionDelay: isAnimating ? "0ms" : "400ms" }}
            >
              <div className="p-4">
                <h3
                  className={`text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 transform transition-all duration-400 ease-out ${
                    isAnimating
                      ? "translate-y-2 opacity-0"
                      : "translate-y-0 opacity-100"
                  }`}
                  style={{ transitionDelay: isAnimating ? "0ms" : "450ms" }}
                >
                  Menu
                </h3>
                <div className="space-y-1">
                  <Link
                    to="/products"
                    onClick={onClose}
                    className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-sm hover:translate-x-2 transform ease-out ${
                      isAnimating
                        ? "translate-y-2 opacity-0"
                        : "translate-y-0 opacity-100"
                    }`}
                    style={{ transitionDelay: isAnimating ? "0ms" : "500ms" }}
                  >
                    <div className="flex items-center space-x-3">
                      <TagIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        All Products
                      </span>
                    </div>
                    <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                  </Link>

                  <Link
                    to="/bulk-orders"
                    onClick={onClose}
                    className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-sm hover:translate-x-2 transform ease-out ${
                      isAnimating
                        ? "translate-y-2 opacity-0"
                        : "translate-y-0 opacity-100"
                    }`}
                    style={{ transitionDelay: isAnimating ? "0ms" : "550ms" }}
                  >
                    <div className="flex items-center space-x-3">
                      <BuildingOffice2Icon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Bulk Orders
                      </span>
                    </div>
                    <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                  </Link>

                  <Link
                    to="/contact"
                    onClick={onClose}
                    className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-sm hover:translate-x-2 transform ease-out ${
                      isAnimating
                        ? "translate-y-2 opacity-0"
                        : "translate-y-0 opacity-100"
                    }`}
                    style={{ transitionDelay: isAnimating ? "0ms" : "600ms" }}
                  >
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Contact Us
                      </span>
                    </div>
                    <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                  </Link>

                  <Link
                    to="/help"
                    onClick={onClose}
                    className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-sm hover:translate-x-2 transform ease-out ${
                      isAnimating
                        ? "translate-y-2 opacity-0"
                        : "translate-y-0 opacity-100"
                    }`}
                    style={{ transitionDelay: isAnimating ? "0ms" : "650ms" }}
                  >
                    <div className="flex items-center space-x-3">
                      <QuestionMarkCircleIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Help Center
                      </span>
                    </div>
                    <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Corporate Section with staggered animation */}
            {!isAuthenticated && (
              <div
                className={`border-t border-gray-200 dark:border-gray-700 transform transition-all duration-500 ease-out ${
                  isAnimating
                    ? "translate-y-4 opacity-0"
                    : "translate-y-0 opacity-100"
                }`}
                style={{ transitionDelay: isAnimating ? "0ms" : "500ms" }}
              >
                <div className="p-4">
                  <h3
                    className={`text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 transform transition-all duration-400 ease-out ${
                      isAnimating
                        ? "translate-y-2 opacity-0"
                        : "translate-y-0 opacity-100"
                    }`}
                    style={{ transitionDelay: isAnimating ? "0ms" : "550ms" }}
                  >
                    For Businesses
                  </h3>
                  <Link
                    to="/corporate/register"
                    onClick={onClose}
                    className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-sm hover:translate-x-2 transform ease-out ${
                      isAnimating
                        ? "translate-y-2 opacity-0"
                        : "translate-y-0 opacity-100"
                    }`}
                    style={{ transitionDelay: isAnimating ? "0ms" : "600ms" }}
                  >
                    <div className="flex items-center space-x-3">
                      <BuildingOffice2Icon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Corporate Account
                      </span>
                    </div>
                    <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                  </Link>
                </div>
              </div>
            )}

            {/* Account Section with staggered animation */}
            {isAuthenticated && (
              <div
                className={`border-t border-gray-200 dark:border-gray-700 transform transition-all duration-500 ease-out ${
                  isAnimating
                    ? "translate-y-4 opacity-0"
                    : "translate-y-0 opacity-100"
                }`}
                style={{ transitionDelay: isAnimating ? "0ms" : "550ms" }}
              >
                <div className="p-4">
                  <h3
                    className={`text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 transform transition-all duration-400 ease-out ${
                      isAnimating
                        ? "translate-y-2 opacity-0"
                        : "translate-y-0 opacity-100"
                    }`}
                    style={{ transitionDelay: isAnimating ? "0ms" : "600ms" }}
                  >
                    Account
                  </h3>
                  <div className="space-y-1">
                    <Link
                      to="/profile"
                      onClick={onClose}
                      className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-sm hover:translate-x-2 transform ease-out ${
                        isAnimating
                          ? "translate-y-2 opacity-0"
                          : "translate-y-0 opacity-100"
                      }`}
                      style={{ transitionDelay: isAnimating ? "0ms" : "650ms" }}
                    >
                      <div className="flex items-center space-x-3">
                        <UserIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Profile
                        </span>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                    </Link>

                    <Link
                      to="/settings"
                      onClick={onClose}
                      className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-sm hover:translate-x-2 transform ease-out ${
                        isAnimating
                          ? "translate-y-2 opacity-0"
                          : "translate-y-0 opacity-100"
                      }`}
                      style={{ transitionDelay: isAnimating ? "0ms" : "700ms" }}
                    >
                      <div className="flex items-center space-x-3">
                        <CogIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Settings
                        </span>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                    </Link>

                    {/* Corporate Admin Links */}
                    {user?.role === "corporate_admin" && (
                      <Link
                        to="/corporate/dashboard"
                        onClick={onClose}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <BuildingOffice2Icon className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Corporate Dashboard
                          </span>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                      </Link>
                    )}

                    {/* Super Admin Links */}
                    {user?.role === "super_admin" && (
                      <Link
                        to="/admin/dashboard"
                        onClick={onClose}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <CogIcon className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Admin Dashboard
                          </span>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions with staggered animation */}
          {isAuthenticated && (
            <div
              className={`border-t border-gray-200 dark:border-gray-700 p-4 transform transition-all duration-500 ease-out ${
                isAnimating
                  ? "translate-y-4 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
              style={{ transitionDelay: isAnimating ? "0ms" : "600ms" }}
            >
              <button
                onClick={handleLogout}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 text-red-600 dark:text-red-400 hover:scale-105 hover:shadow-sm font-medium transform ease-out ${
                  isAnimating
                    ? "translate-y-2 opacity-0"
                    : "translate-y-0 opacity-100"
                }`}
                style={{ transitionDelay: isAnimating ? "0ms" : "650ms" }}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
