import { ConstructorPage, Feed } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';

import {
  AppHeader,
  BurgerIngredient,
  IngredientDetails,
  Modal
} from '@components';
import { Preloader } from '@ui';
import {
  fetchIngredients,
  getError,
  getIngredients,
  getIsLoading
} from '../../features/burger-ingredients/burger-ingredientsSlice';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

const App = () => {
  /** TODO: взять переменные из стора */
  const isIngredientsLoading = useSelector(getIsLoading);
  const ingredients = useSelector(getIngredients);
  const error = useSelector(getError);
  // const { image, price, name, _id } = ingredient;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchIngredients());
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = location.state?.background;

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes>
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
        </Routes>
      )}

      <Routes>
        <Route path='/feed' element={<Feed />} />
      </Routes>
    </div>
  );
};

export default App;
