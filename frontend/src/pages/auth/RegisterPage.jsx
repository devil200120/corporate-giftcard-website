import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { register, clearError } from "../../store/slices/authSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordErrors, setPasswordErrors] = useState([]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Password strength validation
  useEffect(() => {
    const password = formData.password;
    let strength = 0;
    const errors = [];

    if (password.length >= 8) strength += 1;
    else errors.push("At least 8 characters");

    if (/[A-Z]/.test(password)) strength += 1;
    else errors.push("One uppercase letter");

    if (/[a-z]/.test(password)) strength += 1;
    else errors.push("One lowercase letter");

    if (/\d/.test(password)) strength += 1;
    else errors.push("One number");

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    else errors.push("One special character");

    setPasswordStrength(strength);
    setPasswordErrors(errors);
  }, [formData.password]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast.error("Please enter your first name");
      return false;
    }

    if (!formData.lastName.trim()) {
      toast.error("Please enter your last name");
      return false;
    }

    if (!formData.email) {
      toast.error("Please enter your email address");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!formData.phone) {
      toast.error("Please enter your phone number");
      return false;
    }

    if (passwordStrength < 4) {
      toast.error("Please create a stronger password");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    if (!formData.agreeToTerms) {
      toast.error("Please agree to the Terms of Service");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await dispatch(
        register({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.toLowerCase(),
          phone: formData.phone,
          password: formData.password,
        })
      ).unwrap();

      toast.success(
        "Account created successfully! Please check your email to verify your account."
      );
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Registration failed");
    }
  };

  const getStrengthColor = (strength) => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength) => {
    if (strength <= 2) return "Weak";
    if (strength <= 3) return "Medium";
    return "Strong";
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
              Join Our Premium
              <span className="block text-yellow-200">Gifting Community</span>
            </h2>

            <p className="text-white/90 text-lg leading-relaxed max-w-md">
              Create your account and unlock access to our exclusive collection
              of premium corporate gifts, custom solutions, and bulk order
              benefits.
            </p>

            <div className="space-y-4 pt-6">
              <div className="flex items-center space-x-3 text-white/90">
                <div className="w-2 h-2 bg-yellow-200 rounded-full"></div>
                <span className="text-sm">Exclusive member pricing</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <div className="w-2 h-2 bg-yellow-200 rounded-full"></div>
                <span className="text-sm">Priority customer support</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <div className="w-2 h-2 bg-yellow-200 rounded-full"></div>
                <span className="text-sm">Early access to new products</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-32 w-24 h-24 bg-yellow-300/20 rounded-full blur-2xl"></div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-8 px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center justify-center mb-6">
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
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Your Account
            </h2>
            <p className="text-gray-600">
              Join our premium gifting community today
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 max-h-[calc(100vh-12rem)] overflow-y-auto">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-semibold text-gray-700 mb-1.5"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors placeholder-gray-500 text-gray-900 bg-gray-50 focus:bg-white text-sm"
                      placeholder="First name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-semibold text-gray-700 mb-1.5"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors placeholder-gray-500 text-gray-900 bg-gray-50 focus:bg-white text-sm"
                      placeholder="Last name"
                    />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
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
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors placeholder-gray-500 text-gray-900 bg-gray-50 focus:bg-white text-sm"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors placeholder-gray-500 text-gray-900 bg-gray-50 focus:bg-white text-sm"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
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
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors placeholder-gray-500 text-gray-900 bg-gray-50 focus:bg-white text-sm"
                    placeholder="Create a strong password"
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          passwordStrength <= 2
                            ? "text-red-600"
                            : passwordStrength <= 3
                              ? "text-yellow-600"
                              : "text-green-600"
                        }`}
                      >
                        {getStrengthText(passwordStrength)}
                      </span>
                    </div>

                    {passwordErrors.length > 0 && (
                      <div className="space-y-0.5">
                        {passwordErrors.map((error, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-1.5 text-xs"
                          >
                            <XMarkIcon className="w-3 h-3 text-red-500 flex-shrink-0" />
                            <span className="text-red-600">{error}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors placeholder-gray-500 text-gray-900 bg-gray-50 focus:bg-white text-sm"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-4 w-4 text-gray-500" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-1.5 flex items-center space-x-2">
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <CheckIcon className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600">
                          Passwords match
                        </span>
                      </>
                    ) : (
                      <>
                        <XMarkIcon className="w-3 h-3 text-red-500" />
                        <span className="text-xs text-red-600">
                          Passwords don't match
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-2 pt-1">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-yellow-500 focus:ring-yellow-400 border-gray-300 rounded mt-0.5"
                />
                <label
                  htmlFor="agreeToTerms"
                  className="block text-xs text-gray-600 leading-relaxed"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-yellow-600 hover:text-yellow-700 underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-yellow-600 hover:text-yellow-700 underline"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Error Display */}
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                  <div className="text-sm text-red-700 font-medium">
                    {error}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={
                    isLoading || passwordStrength < 4 || !formData.agreeToTerms
                  }
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
                      Creating Account...
                    </>
                  ) : (
                    "Create Your Account"
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Need a corporate account?
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Link
                to="/corporate/register"
                className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                Register Corporate Account
              </Link>
            </div>
          </div>

          {/* Additional Links */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-yellow-600 hover:text-yellow-700 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
