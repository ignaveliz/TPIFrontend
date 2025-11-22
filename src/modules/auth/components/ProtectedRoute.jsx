import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

function ProtectedRoute({ children }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }

  if (role !== 'Admin' && role !== 'Tester') {
    return <Navigate to='/unauthorized' />;
  }

  return children;
};

export default ProtectedRoute;
