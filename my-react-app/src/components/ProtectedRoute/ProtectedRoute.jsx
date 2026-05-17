import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../store/slices/authSlice';

function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Save attempted URL for post-login redirect (optional enhancement)
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;