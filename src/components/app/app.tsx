import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';

import { AppHeader } from '@components';
import { Preloader } from '@ui';
import {
  fetchIngredients,
  getError,
  getIngredients,
  getIsLoading
} from '../../features/burger-ingredients/burger-ingredientsSlice';
import { Routes, Route } from 'react-router-dom';

const App = () => {
  /** TODO: взять переменные из стора */
  const isIngredientsLoading = useSelector(getIsLoading);
  const ingredients = useSelector(getIngredients);
  const error = useSelector(getError);

  const dispatch = useDispatch();
  // const selector = useSelector()
  useEffect(() => {
    dispatch(fetchIngredients());
  }, []);

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
      </Routes>
    </div>
  );
};

export default App;
