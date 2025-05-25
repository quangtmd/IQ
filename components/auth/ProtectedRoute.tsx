import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is admin or staff for /admin route
  if (location.pathname.startsWith('/admin') && currentUser?.role !== 'admin' && currentUser?.role !== 'staff') {
    // If not admin or staff, redirect to home or a "not authorized" page
    return <Navigate to="/" state={{ from: location }} replace />;
  }


  return children;
};

export default ProtectedRoute;