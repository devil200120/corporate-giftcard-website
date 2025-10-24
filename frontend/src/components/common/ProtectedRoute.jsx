import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '../../store/slices/authSlice';
import Loading from './Loading';

const ProtectedRoute = ({ 
  children, 
  requireAdmin = false, 
  requireCorporate = false,
  redirectTo = '/login'
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const location = useLocation();

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return <Loading fullScreen text="Checking authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check admin access
  if (requireAdmin && user?.role !== 'super_admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <h1 className="text-4xl font-bold text-error-600 mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 text-lg">
          You don't have permission to access this page. Admin access required.
        </p>
      </div>
    );
  }

  // Check corporate access
  if (requireCorporate && 
      (user?.role !== 'corporate_admin' || 
       !user?.corporateDetails?.isApproved)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <h1 className="text-4xl font-bold text-warning-600 mb-4">
          Corporate Access Required
        </h1>
        <p className="text-gray-600 text-lg">
          This page is only available for approved corporate accounts.
        </p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
