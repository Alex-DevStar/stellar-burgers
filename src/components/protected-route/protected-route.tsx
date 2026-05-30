import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import {
  getIsAuthChecked,
  getIsAuthenticated,
  getUserData
} from '../../features/user/userSlice';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  children: React.ReactElement;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuth = useSelector(getIsAuthenticated);
  const user = useSelector(getUserData);
  const navigate = useNavigate();
  if (isAuth) {
    return;
  }

  if (user) {
    return <Navigate replace to='/login' />;
  }

  return children;
};
