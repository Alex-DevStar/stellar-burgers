import { ConstructorPage, Feed, ForgotPassword, Login, NotFound404, Profile, ProfileOrders, Register, ResetPassword } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Preloader } from '@ui';
import {
  fetchIngredients,
  getError,
  getIngredients,
  getIsLoading
} from '../../features/burger-ingredients/burger-ingredientsSlice';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { getUser, setAuthChecked } from '../../features/user/userSlice';
import { getCookie } from '../../utils/cookie';
import { ProtectedRoute } from '../protected-route/protected-route';

const App = () => {
  /** TODO: взять переменные из стора */
  const isIngredientsLoading = useSelector(getIsLoading);
  const ingredients = useSelector(getIngredients);
  const error = useSelector(getError);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());

    if (getCookie('accessToken')) {
      dispatch(getUser());
    } else {
      dispatch(setAuthChecked());
    }
  }, [dispatch]);

  const location = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = location.state?.background;

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation || location}>
        <Route
          path='/'
          element={
            isIngredientsLoading ? (
              <Preloader />
            ) : error ? (
              <div
                className={`${styles.error} text text_type_main-medium pt-4`}
              >
                {error}
              </div>
            ) : ingredients.length > 0 ? (
              <ConstructorPage />
            ) : (
              <div
                className={`${styles.title} text text_type_main-medium pt-4`}
              >
                Нет игредиентов
              </div>
            )
          }
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />

        <Route
          path='/login'
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />

        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/reset-password'
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
      </Routes>

      {backgroundLocation && (
        <Routes>
          {' '}
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Детали ингредиента'} onClose={() => navigate(-1)}>
                {' '}
                <IngredientDetails />
                {''}
              </Modal>
            }
          />{' '}
          <Route
            path='/feed/:number'
            element={
              <Modal title={''} onClose={() => navigate(-1)}>
                {' '}
                <OrderInfo />
                {''}
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
