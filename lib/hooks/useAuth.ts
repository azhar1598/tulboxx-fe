// /hooks/useAuth.ts
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../redux/slices/authSlice';

const useAuth = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return { isAuthenticated };
};

export default useAuth;
