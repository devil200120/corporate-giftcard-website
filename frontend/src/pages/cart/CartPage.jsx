import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ShoppingBagIcon,
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ArrowLeftIcon,
  GiftIcon,
  TagIcon,
  TruckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import {
  updateCartQuantity,
  removeFromCart,
  clearCart,
  applyDiscount,
} from "../../store/slices/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, subtotal, shipping, tax, discount, discountCode } =
    useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateCartQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
    toast.success("Item removed from cart");
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    setIsApplyingPromo(true);
    try {
      await dispatch(applyDiscount(promoCode)).unwrap();
      toast.success("Promo code applied successfully!");
      setPromoCode("");
    } catch (error) {
      toast.error(error.message || "Invalid promo code");
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      dispatch(clearCart());
      toast.success("Cart cleared");
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please login to proceed with checkout");
      navigate("/login", { state: { returnTo: "/checkout" } });
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ShoppingBagIcon className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-yellow-50/30 dark:from-gray-900 dark:via-orange-950/30 dark:to-yellow-950/30 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Modern Header with giftkyade design */}
        <div className="relative mb-12">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-3xl blur-3xl"></div>

          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-orange-100 dark:border-orange-900/30 shadow-lg">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300"
              >
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-800/50 transition-colors">
                  <ArrowLeftIcon className="w-5 h-5" />
                </div>
                <span className="font-medium">Continue Shopping</span>
              </button>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg">
                    <ShoppingBagIcon className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-orange-600 bg-clip-text text-transparent dark:from-white dark:to-orange-400">
                    Shopping Cart
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {items.length}{" "}
                  {items.length === 1 ? "premium item" : "premium items"} ready
                  for checkout
                </p>
              </div>

              <button
                onClick={handleClearCart}
                className="group flex items-center gap-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-all duration-300"
              >
                <TrashIcon className="w-5 h-5 group-hover:animate-pulse" />
                <span className="font-medium">Clear All</span>
              </button>
            </div>

            {/* Decorative gradient line */}
            <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Modern Cart Items */}
          <div className="xl:col-span-2">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 dark:border-orange-900/30">
              <div className="p-6 border-b border-gradient-to-r from-yellow-200/30 to-orange-200/30">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-lg">
                    <GiftIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-orange-600 bg-clip-text text-transparent dark:from-white dark:to-orange-400">
                      Your Items
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Carefully selected corporate gifts & promotional items
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {items.map((item, index) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="group bg-gradient-to-r from-white/60 to-orange-50/60 dark:from-gray-800/60 dark:to-orange-950/60 backdrop-blur-sm border border-orange-200/30 dark:border-orange-800/30 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1"
                  >
                    <div className="flex gap-6">
                      {/* Enhanced Product Image */}
                      <div className="relative">
                        <img
                          src={item.image || "/api/placeholder/120/120"}
                          alt={item.name}
                          className="w-28 h-28 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 to-orange-500/0 group-hover:from-yellow-400/20 group-hover:to-orange-500/20 rounded-xl transition-all duration-300"></div>
                      </div>

                      <div className="flex-1 space-y-4">
                        {/* Product Info */}
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                              {item.name}
                            </h4>

                            {/* Personalization */}
                            {item.personalization && (
                              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg p-3 mb-3 border border-orange-200/50 dark:border-orange-800/30">
                                <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300">
                                  <GiftIcon className="w-4 h-4" />
                                  <span className="font-semibold">
                                    Personalized: {item.personalization}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Product Variants */}
                            <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                              {item.size && (
                                <div className="flex items-center space-x-1">
                                  <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                                  <span>Size: {item.size}</span>
                                </div>
                              )}
                              {item.color && (
                                <div className="flex items-center space-x-1">
                                  <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                                  <span>Color: {item.color}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200 transform hover:scale-110"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Modern Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* Quantity Control */}
                            <div className="flex items-center bg-white dark:bg-gray-700 border border-orange-200 dark:border-orange-800 rounded-xl shadow-sm">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                className="p-3 text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-l-xl transition-all duration-200 transform hover:scale-110"
                              >
                                <MinusIcon className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                className="p-3 text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-r-xl transition-all duration-200 transform hover:scale-110"
                              >
                                <PlusIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Price Display */}
                          <div className="text-right">
                            <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ${item.price} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Premium Order Summary */}
          <div className="xl:col-span-1">
            <div className="bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-800/90 dark:to-orange-900/20 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 dark:border-orange-900/30 sticky top-24">
              <div className="relative p-6 border-b border-gradient-to-r from-yellow-200/30 to-orange-200/30 bg-gradient-to-r from-yellow-400/10 to-orange-400/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                    <TagIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-orange-600 bg-clip-text text-transparent dark:from-white dark:to-orange-400">
                      Order Summary
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Review your corporate order
                    </p>
                  </div>
                </div>
                {/* Decorative gradient line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>
              </div>

              <div className="p-6 space-y-6">
                {/* Enhanced Promo Code Section */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                    Promotional Code
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1 px-4 py-3 border border-orange-200 dark:border-orange-800 rounded-xl bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={!promoCode.trim() || isApplyingPromo}
                      className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      {isApplyingPromo ? "Applying..." : "Apply"}
                    </button>
                  </div>
                  {discountCode && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-3 rounded-xl border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-300">
                        <TagIcon className="w-4 h-4" />
                        <span className="font-semibold">
                          Applied: {discountCode}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Price Breakdown */}
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-5 space-y-4 backdrop-blur-sm">
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
                        <GiftIcon className="w-4 h-4" />
                        <span>Discount</span>
                      </span>
                      <span className="font-semibold">
                        -${discount?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Shipping
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {shipping === 0 ? (
                        <span className="text-green-600 dark:text-green-400">
                          Free
                        </span>
                      ) : (
                        `$${shipping?.toFixed(2) || "0.00"}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Tax
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${tax?.toFixed(2) || "0.00"}
                    </span>
                  </div>

                  <div className="border-t border-orange-200/50 dark:border-orange-800/30 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        Total
                      </span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                        ${total?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Premium Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="group w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>Proceed to Checkout</span>
                    <GiftIcon className="w-6 h-6 group-hover:animate-pulse" />
                  </span>
                </button>

                {/* Enhanced Info Section */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2 text-sm text-blue-800 dark:text-blue-300">
                    <TruckIcon className="w-4 h-4" />
                    <span className="font-medium">
                      Free shipping on orders over $50
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Secure checkout • 30-day return policy • Corporate billing
                    available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
