import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  ShoppingBagIcon,
  TagIcon,
  TruckIcon,
  SparklesIcon,
  GiftIcon,
} from "@heroicons/react/24/outline";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
} from "../../store/slices/cartSlice";

const CartSidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [isAnimating, setIsAnimating] = useState(false);
  const {
    items,
    total,
    subtotal,
    tax,
    shippingCost,
    discount,
    appliedCoupon,
    itemCount,
  } = useSelector((state) => state.cart);

  // Handle smooth animations
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
      // Add slight delay to trigger animation
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleQuantityUpdate = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateQuantity({ itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      dispatch(clearCart());
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with smooth fade */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 ${
          isAnimating ? "opacity-0" : "opacity-100"
        }`}
        onClick={onClose}
      />

      {/* Sidebar with smooth slide-in animation */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-gradient-to-br from-white via-gray-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-950 shadow-2xl z-50 transform transition-all duration-500 ease-out ${
          isAnimating
            ? "translate-x-full opacity-0"
            : "translate-x-0 opacity-100"
        }`}
      >
        {/* Header with giftkyade design */}
        <div className="relative p-6 border-b border-gradient-to-r from-yellow-200/30 to-orange-200/30 bg-gradient-to-r from-yellow-400/10 to-orange-400/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                <GiftIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-orange-600 bg-clip-text text-transparent dark:from-white dark:to-orange-400">
                  Shopping Cart
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all duration-200 transform hover:scale-110"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          {/* Decorative gradient line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            /* Empty Cart with modern design */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-full flex items-center justify-center">
                  <ShoppingBagIcon className="w-10 h-10 text-gradient bg-gradient-to-r from-orange-400 to-yellow-500" />
                </div>
                <SparklesIcon className="w-6 h-6 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-orange-600 bg-clip-text text-transparent dark:from-white dark:to-orange-400 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm">
                Discover amazing corporate gifts and promotional items to boost
                your business
              </p>
              <Link
                to="/products"
                onClick={onClose}
                className="group bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center space-x-2">
                  <span>Explore Products</span>
                  <SparklesIcon className="w-4 h-4 group-hover:animate-spin" />
                </span>
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items with smooth animations */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-orange-100/50 dark:border-orange-800/30 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ${
                      isAnimating
                        ? "opacity-0 translate-y-4"
                        : "opacity-100 translate-y-0"
                    }`}
                    style={{
                      transitionDelay: isAnimating ? `${index * 100}ms` : "0ms",
                    }}
                  >
                    <div className="flex space-x-4">
                      {/* Product Image with overlay */}
                      <div className="flex-shrink-0 relative">
                        <img
                          src={item.imageUrl || "/api/placeholder/64/64"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 to-orange-500/0 group-hover:from-yellow-400/20 group-hover:to-orange-500/20 rounded-lg transition-all duration-300"></div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-lg font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                          ${item.price?.toFixed(2) || "0.00"}
                        </p>

                        {/* Customizations with modern styling */}
                        {item.customization && (
                          <div className="mt-2 space-y-1">
                            {item.customization.message && (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                  {item.customization.message}
                                </p>
                              </div>
                            )}
                            {item.customization.color && (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                  Color: {item.customization.color}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Modern Quantity Controls */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                            <button
                              onClick={() =>
                                handleQuantityUpdate(item.id, item.quantity - 1)
                              }
                              className="p-1.5 text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-md transition-all duration-200 transform hover:scale-110"
                            >
                              <MinusIcon className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-gray-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityUpdate(item.id, item.quantity + 1)
                              }
                              className="p-1.5 text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-md transition-all duration-200 transform hover:scale-110"
                            >
                              <PlusIcon className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200 transform hover:scale-110"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear Cart Button with modern design */}
                {items.length > 0 && (
                  <div className="pt-4 border-t border-orange-100/50 dark:border-orange-800/30">
                    <button
                      onClick={handleClearCart}
                      className="w-full text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                    >
                      Clear All Items
                    </button>
                  </div>
                )}
              </div>

              {/* Modern Cart Summary */}
              <div className="bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-800/90 dark:to-orange-900/20 backdrop-blur-sm border-t border-gradient-to-r from-yellow-200/30 to-orange-200/30 p-6 space-y-6">
                {/* Premium Coupon Section */}
                <div className="space-y-3">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg">
                          <TagIcon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-green-800 dark:text-green-300">
                            {appliedCoupon.code}
                          </span>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            Coupon Applied
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => dispatch(removeCoupon())}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 text-sm font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Promo Code
                      </label>
                      <div className="flex space-x-3">
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          className="flex-1 px-4 py-3 border border-orange-200 dark:border-orange-800 rounded-xl bg-white/50 dark:bg-gray-800/50 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
                        />
                        <button className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Price Breakdown */}
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 space-y-3 text-sm backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Subtotal
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${subtotal?.toFixed(2) || "0.00"}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                      <span className="flex items-center space-x-2">
                        <SparklesIcon className="w-4 h-4" />
                        <span>Discount</span>
                      </span>
                      <span className="font-semibold">
                        -${discount?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Tax
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${tax?.toFixed(2) || "0.00"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <TruckIcon className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Shipping
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {shippingCost === 0 ? (
                        <span className="text-green-600 dark:text-green-400">
                          Free
                        </span>
                      ) : (
                        `$${shippingCost?.toFixed(2) || "0.00"}`
                      )}
                    </span>
                  </div>

                  <div className="border-t border-orange-200/50 dark:border-orange-800/30 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        Total
                      </span>
                      <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                        ${total?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Premium Action Buttons */}
                <div className="space-y-3">
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="group w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white py-4 px-6 rounded-xl font-bold text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 block"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>Proceed to Checkout</span>
                      <GiftIcon className="w-5 h-5 group-hover:animate-pulse" />
                    </span>
                  </Link>

                  <Link
                    to="/cart"
                    onClick={onClose}
                    className="w-full bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-orange-200 dark:border-orange-800 py-3 px-6 rounded-xl font-semibold text-center hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 transform hover:scale-105 block backdrop-blur-sm"
                  >
                    View Full Cart
                  </Link>
                </div>

                {/* Enhanced Free Shipping Progress */}
                {shippingCost > 0 && subtotal < 100 && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-blue-800 dark:text-blue-300 font-medium">
                        Add ${(100 - subtotal).toFixed(2)} more for free
                        shipping
                      </span>
                      <TruckIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-cyan-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                        style={{
                          width: `${Math.min((subtotal / 100) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
