import React, { useEffect, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";

// Import components
import Layout from "./components/layout/Layout";
import Loading from "./components/common/Loading";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { getCurrentUser } from "./store/slices/authSlice";
import { selectToken } from "./store/slices/authSlice";

// Lazy load pages for better performance
const HomePage = React.lazy(() => import("./pages/HomePage"));
const ProductsPage = React.lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage = React.lazy(
  () => import("./pages/product/ProductDetailPage")
);
const CategoryPage = React.lazy(() => import("./pages/category/CategoryPage"));
const CategoriesPage = React.lazy(
  () => import("./pages/category/CategoriesPage")
);
const CartPage = React.lazy(() => import("./pages/cart/CartPage"));
const CheckoutPage = React.lazy(() => import("./pages/checkout/CheckoutPage"));
const WishlistPage = React.lazy(() => import("./pages/wishlist/WishlistPage"));
const OrdersPage = React.lazy(() => import("./pages/orders/OrdersPage"));
const OrderDetailPage = React.lazy(
  () => import("./pages/orders/OrderDetailPage")
);
const ProfilePage = React.lazy(() => import("./pages/profile/ProfilePage"));
const CorporateDashboard = React.lazy(
  () => import("./pages/corporate/CorporateDashboard")
);
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
const LoginPage = React.lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = React.lazy(() => import("./pages/auth/RegisterPage"));
const ForgotPasswordPage = React.lazy(
  () => import("./pages/auth/ForgotPasswordPage")
);
const ResetPasswordPage = React.lazy(
  () => import("./pages/auth/ResetPasswordPage")
);
const EmailVerificationPage = React.lazy(
  () => import("./pages/auth/EmailVerificationPage")
);
const CorporateRegisterPage = React.lazy(
  () => import("./pages/auth/CorporateRegisterPage")
);
const AboutPage = React.lazy(() => import("./pages/about/AboutPage"));
const ContactPage = React.lazy(() => import("./pages/contact/ContactPage"));
const NotFoundPage = React.lazy(() => import("./pages/NotFoundPage"));

function App() {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  // Check authentication status on app load
  useEffect(() => {
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token]);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <Layout>
                    <HomePage />
                  </Layout>
                }
              />

              <Route
                path="/products"
                element={
                  <Layout>
                    <ProductsPage />
                  </Layout>
                }
              />

              <Route
                path="/products/:id"
                element={
                  <Layout>
                    <ProductDetailPage />
                  </Layout>
                }
              />

              <Route
                path="/categories"
                element={
                  <Layout>
                    <CategoriesPage />
                  </Layout>
                }
              />

              <Route
                path="/categories/:slug"
                element={
                  <Layout>
                    <CategoryPage />
                  </Layout>
                }
              />

              <Route
                path="/cart"
                element={
                  <Layout>
                    <CartPage />
                  </Layout>
                }
              />

              <Route
                path="/about"
                element={
                  <Layout>
                    <AboutPage />
                  </Layout>
                }
              />

              <Route
                path="/contact"
                element={
                  <Layout>
                    <ContactPage />
                  </Layout>
                }
              />

              {/* Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />

              <Route path="/register" element={<RegisterPage />} />

              <Route
                path="/corporate/register"
                element={<CorporateRegisterPage />}
              />

              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              <Route
                path="/reset-password/:token"
                element={<ResetPasswordPage />}
              />

              <Route
                path="/verify-email/:token"
                element={
                  <Layout>
                    <EmailVerificationPage />
                  </Layout>
                }
              />

              {/* Protected Routes - Require Authentication */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CheckoutPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <WishlistPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <OrdersPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/orders/:id"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <OrderDetailPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ProfilePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Corporate Routes - Require Corporate Access */}
              <Route
                path="/corporate/*"
                element={
                  <ProtectedRoute requireCorporate>
                    <Layout>
                      <CorporateDashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes - Require Admin Access */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Redirect /home to / */}
              <Route path="/home" element={<Navigate to="/" replace />} />

              {/* 404 Page */}
              <Route
                path="*"
                element={
                  <Layout>
                    <NotFoundPage />
                  </Layout>
                }
              />
            </Routes>
          </Suspense>

          {/* Global Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                theme: {
                  primary: "#22c55e",
                  secondary: "white",
                },
              },
              error: {
                duration: 5000,
                theme: {
                  primary: "#ef4444",
                  secondary: "white",
                },
              },
            }}
          />
        </div>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
