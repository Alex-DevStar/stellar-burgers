import { Navigate, useLocation } from 'react-router-dom';
import { getIsAuthenticated } from '../../features/user/userSlice';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const isAuth = useSelector(getIsAuthenticated);
  const location = useLocation();

  if (onlyUnAuth && isAuth) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate replace to={from} />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return children;
};
