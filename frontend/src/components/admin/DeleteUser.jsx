import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  UserIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import { deleteUser } from "../../store/slices/adminSlice";

const DeleteUser = ({ user, show, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleteMode, setDeleteMode] = useState("soft"); // 'soft' or 'permanent'

  const confirmationText = `DELETE ${user?.firstName} ${user?.lastName}`;
  const isConfirmationValid = confirmText === confirmationText;

  const handleDelete = async () => {
    if (!isConfirmationValid) {
      toast.error("Please type the confirmation text correctly");
      return;
    }

    setLoading(true);
    try {
      await dispatch(deleteUser({
        userId: user._id,
        permanent: deleteMode === "permanent"
      })).unwrap();
      
      const message = deleteMode === "permanent" 
        ? "User permanently deleted successfully!" 
        : "User deactivated successfully!";
      toast.success(message);
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error(error?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setConfirmText("");
      setDeleteMode("soft");
      onClose();
    }
  };

  if (!show || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-red-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-red-900">Delete User</h2>
              <p className="text-red-700 text-sm">This action requires confirmation</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar || "/api/placeholder/60/60"}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.type === "corporate"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {user.type === "corporate" ? "Corporate" : "Individual"}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.status === "active"
                      ? "bg-green-100 text-green-800"
                      : user.status === "suspended"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {user.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* User Stats Warning */}
          {(user.totalOrders > 0 || user.totalSpent > 0) && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <ShieldExclamationIcon className="h-6 w-6 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="text-yellow-800 font-semibold mb-2">Warning: User has transaction history</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-yellow-700">
                    <div>
                      <span className="font-medium">Total Orders:</span> {user.totalOrders || 0}
                    </div>
                    <div>
                      <span className="font-medium">Total Spent:</span> ${user.totalSpent?.toFixed(2) || "0.00"}
                    </div>
                  </div>
                  <p className="text-yellow-700 text-sm mt-2">
                    Consider soft deletion to preserve transaction history and data integrity.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Delete Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Deletion Type
            </label>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  id="soft-delete"
                  name="deleteMode"
                  value="soft"
                  checked={deleteMode === "soft"}
                  onChange={(e) => setDeleteMode(e.target.value)}
                  className="mt-1 text-orange-600 focus:ring-orange-500"
                />
                <div className="flex-1">
                  <label htmlFor="soft-delete" className="block text-sm font-medium text-gray-900 cursor-pointer">
                    Soft Delete (Recommended)
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    Deactivate the user account. Data is preserved and can be restored later.
                    User won't be able to login but order history remains intact.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                <input
                  type="radio"
                  id="permanent-delete"
                  name="deleteMode"
                  value="permanent"
                  checked={deleteMode === "permanent"}
                  onChange={(e) => setDeleteMode(e.target.value)}
                  className="mt-1 text-red-600 focus:ring-red-500"
                />
                <div className="flex-1">
                  <label htmlFor="permanent-delete" className="block text-sm font-medium text-red-900 cursor-pointer">
                    Permanent Delete (Dangerous)
                  </label>
                  <p className="text-sm text-red-700 mt-1">
                    Completely remove all user data from the system. This action cannot be undone
                    and may affect order history and reporting.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{confirmationText}</code> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                confirmText && !isConfirmationValid
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              }`}
              placeholder="Type the confirmation text"
              disabled={loading}
            />
            {confirmText && !isConfirmationValid && (
              <p className="text-red-500 text-sm mt-1">
                Confirmation text doesn't match. Please type exactly as shown above.
              </p>
            )}
          </div>

          {/* Impact Warning */}
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-red-800 font-semibold mb-2 flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5" />
              Potential Impact
            </h4>
            <ul className="text-sm text-red-700 space-y-1">
              {deleteMode === "permanent" ? (
                <>
                  <li>• All user personal information will be permanently deleted</li>
                  <li>• Order history may become incomplete or broken</li>
                  <li>• Customer support references will be lost</li>
                  <li>• This action cannot be undone</li>
                </>
              ) : (
                <>
                  <li>• User will be unable to login to their account</li>
                  <li>• Account can be restored by admin if needed</li>
                  <li>• Order history and data integrity preserved</li>
                  <li>• User data remains for reporting and analytics</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading || !isConfirmationValid}
            className={`px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
              deleteMode === "permanent"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-yellow-600 hover:bg-yellow-700 text-white"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {deleteMode === "permanent" ? "Deleting..." : "Deactivating..."}
              </>
            ) : (
              <>
                <TrashIcon className="h-5 w-5" />
                {deleteMode === "permanent" ? "Permanently Delete" : "Deactivate User"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUser;