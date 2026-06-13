import { describe, expect, test } from '@jest/globals';
import type { TIngredient } from '@utils-types';
import {
  BurgerIngredientsState,
  fetchIngredients,
  IngredientsSlice
} from '../burger-ingredients/burger-ingredientsSlice';

const initialState: BurgerIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 200,
    price: 100,
    image: 'bun.png',
    image_mobile: 'bun-mobile.png',
    image_large: 'bun-large.png'
  },
  {
    _id: '2',
    name: 'Котлета',
    type: 'main',
    proteins: 15,
    fat: 10,
    carbohydrates: 2,
    calories: 180,
    price: 120,
    image: 'main.png',
    image_mobile: 'main-mobile.png',
    image_large: 'main-large.png'
  },
  {
    _id: '3',
    name: 'Соус',
    type: 'sauce',
    proteins: 1,
    fat: 8,
    carbohydrates: 6,
    calories: 70,
    price: 40,
    image: 'sauce.png',
    image_mobile: 'sauce-mobile.png',
    image_large: 'sauce-large.png'
  }
];

const expectedPendingState: BurgerIngredientsState = {
  ingredients: [],
  isLoading: true,
  error: null
};

const expectedFulfilledState: BurgerIngredientsState = {
  ingredients: mockIngredients,
  isLoading: false,
  error: null
};

const expectedRejectedState: BurgerIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: 'что-то пошло не так'
};

describe('тесты редьюсера ingredients на экшенах thunk', () => {
  test('обрабатывает fetchIngredients.pending', () => {
    const action = fetchIngredients.pending('requestId', undefined);
    const res = IngredientsSlice.reducer(initialState, action);

    expect(res).toEqual(expectedPendingState);
  });

  test('обрабатывает fetchIngredients.fulfilled', () => {
    const action = fetchIngredients.fulfilled(
      mockIngredients,
      'requestId',
      undefined
    );
    const res = IngredientsSlice.reducer(initialState, action);

    expect(res).toEqual(expectedFulfilledState);
  });

  test('обрабатывает fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'что-то пошло не так' }
    };
    const res = IngredientsSlice.reducer(initialState, action);

    expect(res).toEqual(expectedRejectedState);
  });

  test('обрабатывает экшен, несуществующий в приложении', () => {
    const action = { type: 'UNKNOWN' };
    const res = IngredientsSlice.reducer(undefined, action);

    expect(res).toEqual(initialState);
  });
});
