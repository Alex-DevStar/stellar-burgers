import { configureStore } from '@reduxjs/toolkit';
import { combineSlices } from '@reduxjs/toolkit';
import { IngredientsSlice } from '../features/burger-ingredients/burger-ingredientsSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { constructorSlice } from '../features/burger-constructor/burger-constructorSlice';
import { orderSlice } from '../features/order/orderSlice';
import { feedSlice } from '../features/feed/feedSlice';
import { userSlice } from '../features/user/userSlice';
import { profileOrdersSlice } from '../features/profile-orders/profileOrdersSlice';

const rootReducer = combineSlices(
  IngredientsSlice,
  constructorSlice,
  orderSlice,
  feedSlice,
  userSlice,
  profileOrdersSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
