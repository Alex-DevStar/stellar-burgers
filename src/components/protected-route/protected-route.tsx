import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import {
  getIsAuthChecked,
  getIsAuthenticated,
  getUserData
} from '../../features/user/userSlice';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuth = useSelector(getIsAuthenticated);
  const user = useSelector(getUserData);

  if (onlyUnAuth && isAuth) return <Navigate replace to='/' />;
  if (!onlyUnAuth && !isAuth) return <Navigate replace to='/login' />;
  return children;
};
