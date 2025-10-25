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
  ChevronRightIcon,
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
  const [couponCode, setCouponCode] = useState("");
  const [isVisible, setIsVisible] = useState(false);
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

  // Handle visibility for smooth animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Delay hiding to allow close animation
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
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

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      dispatch(applyCoupon(couponCode.trim()));
      setCouponCode("");
    }
  };

  return (
    <>
      {/* Enhanced Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Professional Sidebar - Smooth Animation */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 transform transition-all duration-300 ease-in-out ${
          isOpen
            ? "translate-x-0 opacity-100 visible"
            : "translate-x-full opacity-0 invisible"
        }`}
      >
        {/* Compact Header */}
        <div className="relative p-3 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                <ShoppingBagIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Shopping Cart
                </h2>
                <p className="text-xs text-gray-500">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            /* Empty Cart - More Compact */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBagIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-6 text-sm max-w-xs">
                Add some products to your cart to get started with your order.
              </p>
              <Link
                to="/products"
                onClick={onClose}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items - Compact */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-3 space-y-2">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className={`group bg-white border border-gray-200 rounded-lg p-2.5 hover:shadow-md transition-all duration-200 ${
                        isOpen
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      }`}
                      style={{
                        transitionDelay: isOpen ? `${index * 30}ms` : "0ms",
                      }}
                    >
                      <div className="flex space-x-2.5">
                        {/* Product Image - Smaller */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.imageUrl || "/api/placeholder/48/48"}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Details - Compact */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm font-bold text-purple-600">
                            ${item.price?.toFixed(2) || "0.00"}
                          </p>

                          {/* Customizations - Compact */}
                          {item.customization && (
                            <div className="mt-1 space-y-0.5">
                              {item.customization.message && (
                                <p className="text-xs text-gray-500 truncate">
                                  {item.customization.message}
                                </p>
                              )}
                              {item.customization.color && (
                                <p className="text-xs text-gray-500">
                                  Color: {item.customization.color}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Quantity Controls - Compact */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                onClick={() =>
                                  handleQuantityUpdate(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                className="p-1 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-l-md transition-colors"
                              >
                                <MinusIcon className="w-3 h-3" />
                              </button>
                              <span className="px-2 py-1 text-xs font-semibold text-gray-900 min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityUpdate(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                className="p-1 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-r-md transition-colors"
                              >
                                <PlusIcon className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            >
                              <TrashIcon className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clear Cart Button - Compact */}
                {items.length > 0 && (
                  <div className="px-4 pb-3">
                    <button
                      onClick={handleClearCart}
                      className="w-full text-xs text-red-600 hover:text-red-700 py-2 hover:bg-red-50 rounded-lg font-medium transition-colors"
                    >
                      Clear All Items
                    </button>
                  </div>
                )}
              </div>

              {/* Cart Summary - Compact */}
              <div className="border-t border-gray-200 bg-gray-50 p-3 space-y-3">
                {/* Coupon Section - Compact */}
                <div className="space-y-2">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 p-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <TagIcon className="w-4 h-4 text-green-600" />
                        <div>
                          <span className="text-xs font-semibold text-green-800">
                            {appliedCoupon.code}
                          </span>
                          <p className="text-xs text-green-600">Applied</p>
                        </div>
                      </div>
                      <button
                        onClick={() => dispatch(removeCoupon())}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700">
                        Promo Code
                      </label>
                      <div className="flex space-x-1">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter code"
                          className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleApplyCoupon()
                          }
                        />
                        <button
                          onClick={handleApplyCoupon}
                          className="px-3 py-1.5 bg-gray-600 text-white text-xs font-medium rounded-md hover:bg-gray-700 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="bg-white rounded-lg p-4 space-y-3 text-sm border border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      ${subtotal?.toFixed(2) || "0.00"}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-semibold">
                        -${discount?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold text-gray-900">
                      ${tax?.toFixed(2) || "0.00"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-gray-900">
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `$${shippingCost?.toFixed(2) || "0.00"}`
                      )}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-xl font-bold text-purple-600">
                        ${total?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-lg font-semibold text-center hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
                  >
                    <span>Proceed to Checkout</span>
                    <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/cart"
                    onClick={onClose}
                    className="w-full bg-white text-gray-700 border border-gray-300 py-3 px-6 rounded-lg font-semibold text-center hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    View Full Cart
                  </Link>
                </div>

                {/* Free Shipping Progress */}
                {shippingCost > 0 && subtotal < 100 && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-blue-800 font-medium">
                        Add ${(100 - subtotal).toFixed(2)} more for free
                        shipping
                      </span>
                      <TruckIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
