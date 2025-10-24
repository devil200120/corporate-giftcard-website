import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  CreditCardIcon,
  TruckIcon,
  MapPinIcon,
  UserIcon,
  CheckCircleIcon,
  LockClosedIcon,
  GiftIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { placeOrder } from "../../store/slices/orderSlice";
import { clearCart } from "../../store/slices/cartSlice";
import { fetchUserAddresses } from "../../store/slices/userSlice";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, total, subtotal, shipping, tax } = useSelector(
    (state) => state.cart
  );
  const { user, addresses } = useSelector((state) => state.user);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    method: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
  });

  const [giftOptions, setGiftOptions] = useState({
    isGift: false,
    message: "",
    wrapping: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { returnTo: "/checkout" } });
      return;
    }

    if (items.length === 0) {
      navigate("/cart");
      return;
    }

    dispatch(fetchUserAddresses());

    // Pre-fill user info
    if (user) {
      setShippingInfo((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [isAuthenticated, items.length, navigate, dispatch, user]);

  const handleAddressSelect = (address) => {
    setShippingInfo({
      ...shippingInfo,
      ...address,
    });
  };

  const validateShippingInfo = () => {
    const required = [
      "firstName",
      "lastName",
      "email",
      "address",
      "city",
      "state",
      "zipCode",
    ];
    const missing = required.filter((field) => !shippingInfo[field]);

    if (missing.length > 0) {
      toast.error(`Please fill in: ${missing.join(", ")}`);
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(shippingInfo.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const validatePaymentInfo = () => {
    if (paymentInfo.method === "card") {
      const required = ["cardNumber", "expiryDate", "cvv", "cardHolder"];
      const missing = required.filter((field) => !paymentInfo[field]);

      if (missing.length > 0) {
        toast.error("Please fill in all card details");
        return false;
      }

      if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ""))) {
        toast.error("Please enter a valid card number");
        return false;
      }
    }

    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateShippingInfo()) return;
    if (step === 2 && !validatePaymentInfo()) return;

    setStep(step + 1);
  };

  const handlePlaceOrder = async () => {
    if (!validateShippingInfo() || !validatePaymentInfo()) return;

    setIsPlacingOrder(true);
    try {
      const orderData = {
        items,
        shippingInfo,
        paymentInfo,
        giftOptions,
        totals: { subtotal, shipping, tax, total },
      };

      const result = await dispatch(placeOrder(orderData)).unwrap();
      dispatch(clearCart());

      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${result.orderId}`);
    } catch (error) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((stepNum) => (
        <div key={stepNum} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              stepNum <= step
                ? "bg-primary-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
            }`}
          >
            {stepNum < step ? <CheckCircleIcon className="w-5 h-5" /> : stepNum}
          </div>
          {stepNum < 3 && (
            <div
              className={`w-16 h-0.5 mx-2 ${
                stepNum < step
                  ? "bg-primary-600"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderShippingStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <TruckIcon className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Shipping Information
        </h2>
      </div>

      {/* Saved Addresses */}
      {addresses.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Choose from saved addresses
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <button
                key={address.id}
                onClick={() => handleAddressSelect(address)}
                className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg text-left hover:border-primary-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {address.firstName} {address.lastName}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {address.address}, {address.city}, {address.state}{" "}
                  {address.zipCode}
                </div>
              </button>
            ))}
          </div>
          <div className="my-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Or enter a new address
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            First Name *
          </label>
          <input
            type="text"
            required
            value={shippingInfo.firstName}
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, firstName: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            required
            value={shippingInfo.lastName}
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, lastName: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email *
          </label>
          <input
            type="email"
            required
            value={shippingInfo.email}
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, email: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={shippingInfo.phone}
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, phone: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Address *
        </label>
        <input
          type="text"
          required
          value={shippingInfo.address}
          onChange={(e) =>
            setShippingInfo({ ...shippingInfo, address: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            City *
          </label>
          <input
            type="text"
            required
            value={shippingInfo.city}
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, city: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            State *
          </label>
          <input
            type="text"
            required
            value={shippingInfo.state}
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, state: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            ZIP Code *
          </label>
          <input
            type="text"
            required
            value={shippingInfo.zipCode}
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, zipCode: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <CreditCardIcon className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Payment Information
        </h2>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <input
            type="radio"
            id="card"
            name="paymentMethod"
            value="card"
            checked={paymentInfo.method === "card"}
            onChange={(e) =>
              setPaymentInfo({ ...paymentInfo, method: e.target.value })
            }
            className="text-primary-600 focus:ring-primary-500"
          />
          <label
            htmlFor="card"
            className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            <CreditCardIcon className="w-5 h-5" />
            Credit/Debit Card
          </label>
        </div>
      </div>

      {paymentInfo.method === "card" && (
        <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Card Holder Name *
            </label>
            <input
              type="text"
              required
              value={paymentInfo.cardHolder}
              onChange={(e) =>
                setPaymentInfo({ ...paymentInfo, cardHolder: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Card Number *
            </label>
            <input
              type="text"
              required
              placeholder="1234 5678 9012 3456"
              value={paymentInfo.cardNumber}
              onChange={(e) => {
                const formatted = e.target.value
                  .replace(/\s/g, "")
                  .replace(/(.{4})/g, "$1 ")
                  .trim();
                setPaymentInfo({ ...paymentInfo, cardNumber: formatted });
              }}
              maxLength={19}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expiry Date *
              </label>
              <input
                type="text"
                required
                placeholder="MM/YY"
                value={paymentInfo.expiryDate}
                onChange={(e) => {
                  const formatted = e.target.value
                    .replace(/\D/g, "")
                    .replace(/(\d{2})(\d{0,2})/, "$1/$2");
                  setPaymentInfo({ ...paymentInfo, expiryDate: formatted });
                }}
                maxLength={5}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                CVV *
              </label>
              <input
                type="text"
                required
                placeholder="123"
                value={paymentInfo.cvv}
                onChange={(e) =>
                  setPaymentInfo({
                    ...paymentInfo,
                    cvv: e.target.value.replace(/\D/g, ""),
                  })
                }
                maxLength={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Gift Options */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <GiftIcon className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Gift Options
          </h3>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={giftOptions.isGift}
              onChange={(e) =>
                setGiftOptions({ ...giftOptions, isGift: e.target.checked })
              }
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-900 dark:text-white">
              This is a gift
            </span>
          </label>

          {giftOptions.isGift && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gift Message
                </label>
                <textarea
                  rows={3}
                  value={giftOptions.message}
                  onChange={(e) =>
                    setGiftOptions({ ...giftOptions, message: e.target.value })
                  }
                  placeholder="Write your gift message here..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={giftOptions.wrapping}
                  onChange={(e) =>
                    setGiftOptions({
                      ...giftOptions,
                      wrapping: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-900 dark:text-white">
                  Add gift wrapping (+$5.00)
                </span>
              </label>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <CheckCircleIcon className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Review Your Order
        </h2>
      </div>

      {/* Order Items */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">
          Order Items
        </h3>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.size}-${item.color}`}
              className="flex items-center gap-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Qty: {item.quantity} × ${item.price}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">
          Shipping Address
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {shippingInfo.firstName} {shippingInfo.lastName}
          <br />
          {shippingInfo.address}
          <br />
          {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
        </p>
      </div>

      {/* Order Total */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">
          Order Summary
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span className="text-gray-900 dark:text-white">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Shipping</span>
            <span className="text-gray-900 dark:text-white">
              {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Tax</span>
            <span className="text-gray-900 dark:text-white">
              ${tax.toFixed(2)}
            </span>
          </div>
          {giftOptions.wrapping && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Gift Wrapping
              </span>
              <span className="text-gray-900 dark:text-white">$5.00</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-900 dark:text-white">Total</span>
            <span className="text-gray-900 dark:text-white">
              ${(total + (giftOptions.wrapping ? 5 : 0)).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : navigate("/cart"))}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            {step > 1 ? "Back" : "Back to Cart"}
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Checkout
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <LockClosedIcon className="w-4 h-4" />
            <span>Secure Checkout</span>
          </div>
        </div>

        {renderStepIndicator()}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 lg:p-8">
          {step === 1 && renderShippingStep()}
          {step === 2 && renderPaymentStep()}
          {step === 3 && renderReviewStep()}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => (step > 1 ? setStep(step - 1) : navigate("/cart"))}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {step > 1 ? "Previous" : "Back to Cart"}
            </button>

            {step < 3 ? (
              <button
                onClick={handleNextStep}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="px-8 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlacingOrder ? "Placing Order..." : "Place Order"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
