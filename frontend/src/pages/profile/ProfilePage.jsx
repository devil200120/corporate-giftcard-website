import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import {
  UserIcon,
  MapPinIcon,
  LockClosedIcon,
  BellIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  updateUserProfile,
  changePassword,
  updateNotificationPreferences,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  fetchUserProfile,
} from "../../store/slices/userSlice";
import { fetchOrders } from "../../store/slices/orderSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, addresses, isLoading } = useSelector((state) => state.user);
  const { orders: recentOrders, isLoading: ordersLoading } = useSelector(
    (state) => state.orders
  );

  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [addressForm, setAddressForm] = useState({
    type: "home",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    isDefault: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: false,
    smsNotifications: false,
  });

  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
      });
      setNotificationSettings({
        orderUpdates: user.preferences?.orderUpdates ?? true,
        promotions: user.preferences?.promotions ?? false,
        newsletter: user.preferences?.newsletter ?? false,
        smsNotifications: user.preferences?.smsNotifications ?? false,
      });
    }

    // Fetch recent orders
    dispatch(fetchOrders({ page: 1, limit: 5 }));
  }, [user, dispatch]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserProfile(profileForm)).unwrap();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      await dispatch(
        changePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        })
      ).unwrap();
      toast.success("Password changed successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to change password");
    }
  };

  const handleNotificationUpdate = async (setting, value) => {
    const newSettings = { ...notificationSettings, [setting]: value };
    setNotificationSettings(newSettings);

    try {
      await dispatch(updateNotificationPreferences(newSettings)).unwrap();
      toast.success("Notification settings updated");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingAddress) {
        await dispatch(
          updateUserAddress({ id: editingAddress.id, addressData: addressForm })
        ).unwrap();
        toast.success("Address updated successfully");
      } else {
        await dispatch(addUserAddress(addressForm)).unwrap();
        toast.success("Address added successfully");
      }

      setShowAddressForm(false);
      setEditingAddress(null);
      setAddressForm({
        type: "home",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
        isDefault: false,
      });
    } catch (error) {
      toast.error(error.message || "Failed to save address");
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await dispatch(deleteUserAddress(addressId)).unwrap();
        toast.success("Address deleted successfully");
      } catch (error) {
        toast.error("Failed to delete address");
      }
    }
  };

  const tabs = [
    { id: "profile", name: "Profile", icon: UserIcon },
    { id: "addresses", name: "Addresses", icon: MapPinIcon },
    { id: "security", name: "Security", icon: LockClosedIcon },
    { id: "notifications", name: "Notifications", icon: BellIcon },
    { id: "orders", name: "Order History", icon: ShoppingBagIcon },
  ];

  const renderProfileTab = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        Personal Information
      </h3>

      <form onSubmit={handleProfileUpdate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              First Name *
            </label>
            <input
              type="text"
              required
              value={profileForm.firstName}
              onChange={(e) =>
                setProfileForm({ ...profileForm, firstName: e.target.value })
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
              value={profileForm.lastName}
              onChange={(e) =>
                setProfileForm({ ...profileForm, lastName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={profileForm.email}
              onChange={(e) =>
                setProfileForm({ ...profileForm, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={profileForm.phone}
              onChange={(e) =>
                setProfileForm({ ...profileForm, phone: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={profileForm.dateOfBirth}
              onChange={(e) =>
                setProfileForm({ ...profileForm, dateOfBirth: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gender
            </label>
            <select
              value={profileForm.gender}
              onChange={(e) =>
                setProfileForm({ ...profileForm, gender: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {isLoading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );

  const renderAddressesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Saved Addresses
        </h3>
        <button
          onClick={() => setShowAddressForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <PlusIcon className="w-4 h-4" />
          Add Address
        </button>
      </div>

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      address.type === "home"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    }`}
                  >
                    {address.type.charAt(0).toUpperCase() +
                      address.type.slice(1)}
                  </span>
                  {address.isDefault && (
                    <span className="px-2 py-1 text-xs bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="text-gray-500 hover:text-primary-600"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-900 dark:text-white">
                <p className="font-medium">
                  {address.firstName} {address.lastName}
                </p>
                <p>{address.address}</p>
                <p>
                  {address.city}, {address.state} {address.zipCode}
                </p>
                <p>{address.country}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No saved addresses
          </p>
          <button
            onClick={() => setShowAddressForm(true)}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Add Your First Address
          </button>
        </div>
      )}

      {/* Address Form Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h3>
              <button
                onClick={() => {
                  setShowAddressForm(false);
                  setEditingAddress(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address Type
                </label>
                <select
                  value={addressForm.type}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.firstName}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        firstName: e.target.value,
                      })
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
                    value={addressForm.lastName}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        lastName: e.target.value,
                      })
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
                  value={addressForm.address}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
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
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
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
                    value={addressForm.zipCode}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        zipCode: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressForm.isDefault}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      isDefault: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label
                  htmlFor="isDefault"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Set as default address
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddressForm(false);
                    setEditingAddress(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {isLoading
                    ? "Saving..."
                    : editingAddress
                      ? "Update Address"
                      : "Add Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderSecurityTab = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        Change Password
      </h3>

      <form onSubmit={handlePasswordChange} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Current Password *
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              required
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value,
                })
              }
              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showCurrentPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            New Password *
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              required
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showNewPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirm New Password *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {isLoading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        Notification Preferences
      </h3>

      <div className="space-y-4">
        {[
          {
            key: "orderUpdates",
            title: "Order Updates",
            description:
              "Get notified about order confirmations, shipping updates, and delivery confirmations",
          },
          {
            key: "promotions",
            title: "Promotional Offers",
            description:
              "Receive emails about sales, discounts, and special promotions",
          },
          {
            key: "newsletter",
            title: "Newsletter",
            description:
              "Stay updated with new products, features, and company news",
          },
          {
            key: "smsNotifications",
            title: "SMS Notifications",
            description: "Receive text messages for important order updates",
          },
        ].map((setting) => (
          <div
            key={setting.key}
            className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                {setting.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {setting.description}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings[setting.key]}
                onChange={(e) =>
                  handleNotificationUpdate(setting.key, e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrdersTab = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Recent Orders
        </h3>
        <a
          href="/orders"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          View All Orders →
        </a>
      </div>

      {recentOrders?.length > 0 ? (
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Order #{order.orderNumber}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()} • $
                    {order.total.toFixed(2)}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : order.status === "shipped"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {order.items.slice(0, 3).map((item, index) => (
                  <img
                    key={index}
                    src={item.image}
                    alt={item.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                ))}
                {order.items.length > 3 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{order.items.length - 3} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <ShoppingBagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No recent orders</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <ul className="space-y-2">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      {tab.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "profile" && renderProfileTab()}
            {activeTab === "addresses" && renderAddressesTab()}
            {activeTab === "security" && renderSecurityTab()}
            {activeTab === "notifications" && renderNotificationsTab()}
            {activeTab === "orders" && renderOrdersTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
