import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import { login, clearError } from "../../store/slices/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const result = await dispatch(
        login({
          email: formData.email,
          password: formData.password,
          rememberMe,
        })
      ).unwrap();

      toast.success(
        `Welcome back, ${result.data.user.firstName} ${result.data.user.lastName}!`
      );

      // Redirect based on user role
      const redirectTo =
        location.state?.from?.pathname ||
        (result.data.user.role === "super_admin"
          ? "/admin/dashboard"
          : result.data.user.role === "corporate_admin"
            ? "/corporate/dashboard"
            : "/");

      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎁</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Gift Galore</h1>
              <p className="text-white/80 text-sm">Premium Corporate Gifts</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              Welcome Back to
              <span className="block text-yellow-200">Premium Gifting</span>
            </h2>

            <p className="text-white/90 text-lg leading-relaxed max-w-md">
              Transform your business relationships with our curated collection
              of premium corporate gifts and custom solutions.
            </p>

            <div className="space-y-4 pt-6">
              <div className="flex items-center space-x-3 text-white/90">
                <div className="w-2 h-2 bg-yellow-200 rounded-full"></div>
                <span className="text-sm">Premium quality guaranteed</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <div className="w-2 h-2 bg-yellow-200 rounded-full"></div>
                <span className="text-sm">Custom branding available</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <div className="w-2 h-2 bg-yellow-200 rounded-full"></div>
                <span className="text-sm">Bulk order discounts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-32 w-24 h-24 bg-yellow-300/20 rounded-full blur-2xl"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-xl">🎁</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              Gift Galore
            </span>
          </div>
        </div>

        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to access your premium gifting account
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors placeholder-gray-500 text-gray-900 bg-gray-50 focus:bg-white"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors placeholder-gray-500 text-gray-900 bg-gray-50 focus:bg-white"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-4 w-4 text-gray-500" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-yellow-500 focus:ring-yellow-400 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-600"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-yellow-600 hover:text-yellow-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <div className="text-sm text-red-700 font-medium">
                    {error}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <UserIcon className="h-5 w-5 text-white/80 group-hover:text-white" />
                      </span>
                      Sign In to Your Account
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
            </div>

            {/* Corporate Account Link */}
            <div className="mt-6">
              <Link
                to="/corporate/register"
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-200 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <BuildingOffice2Icon className="h-5 w-5 mr-2 text-gray-600" />
                Need a Corporate Account?
              </Link>
            </div>
          </div>

          {/* Additional Links */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-yellow-600 hover:text-yellow-700 transition-colors"
              >
                Create one now
              </Link>
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              By signing in, you agree to our{" "}
              <Link
                to="/terms"
                className="underline hover:text-yellow-600 transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="underline hover:text-yellow-600 transition-colors"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
