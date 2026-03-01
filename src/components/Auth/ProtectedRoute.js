import { useAuth } from '../../store/auth-context';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  
  if (!isLoggedIn) {
    return <div>Please log in to access this page.</div>;
  }

  return children;
};

export default ProtectedRoute;