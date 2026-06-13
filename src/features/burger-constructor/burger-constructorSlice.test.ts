import { describe, expect, test, jest } from '@jest/globals';
import type { TConstructorIngredient, TIngredient } from '@utils-types';
import reducer, {
  addBun,
  addIngredient,
  removeIngredient,
  removeBun,
  clearConstructor,
  BurgerConstructorState
} from './burger-constructorSlice';

jest.mock('@reduxjs/toolkit', () => {
  const actual = jest.requireActual('@reduxjs/toolkit');
  return {
    ...actual,
    nanoid: () => 'test-id'
  };
});

const initialState: BurgerConstructorState = {
  ingredients: [],
  bun: null
};

const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 200,
  price: 100,
  image: 'bun.png',
  image_mobile: 'bun-mobile.png',
  image_large: 'bun-large.png'
};

const mockSecondBun: TIngredient = {
  _id: 'bun-2',
  name: 'Флюоресцентная булка',
  type: 'bun',
  proteins: 12,
  fat: 6,
  carbohydrates: 22,
  calories: 210,
  price: 110,
  image: 'bun2.png',
  image_mobile: 'bun2-mobile.png',
  image_large: 'bun2-large.png'
};

const mockIngredient: TIngredient = {
  _id: 'main-1',
  name: 'Биокотлета',
  type: 'main',
  proteins: 15,
  fat: 10,
  carbohydrates: 2,
  calories: 180,
  price: 120,
  image: 'main.png',
  image_mobile: 'main-mobile.png',
  image_large: 'main-large.png'
};

const mockConstructorIngredient: TConstructorIngredient = {
  ...mockIngredient,
  id: 'test-id'
};

describe('тесты редьюсера burgerConstructor', () => {
  test('обрабатывает экшен, несуществующий в приложении', () => {
    const action = { type: 'UNKNOWN' };
    const res = reducer(undefined, action);

    expect(res).toEqual(initialState);
  });

  test('обрабатывает addBun', () => {
    const action = addBun(mockBun);
    const res = reducer(initialState, action);

    expect(res).toEqual({
      ingredients: [],
      bun: mockBun
    });
  });

  test('заменяет булку при повторном addBun', () => {
    const stateWithBun: BurgerConstructorState = {
      ingredients: [],
      bun: mockBun
    };

    const action = addBun(mockSecondBun);
    const res = reducer(stateWithBun, action);

    expect(res).toEqual({
      ingredients: [],
      bun: mockSecondBun
    });
  });

  test('обрабатывает removeBun', () => {
    const stateWithBun: BurgerConstructorState = {
      ingredients: [],
      bun: mockBun
    };

    const action = removeBun();
    const res = reducer(stateWithBun, action);

    expect(res).toEqual({
      ingredients: [],
      bun: null
    });
  });

  test('обрабатывает addIngredient', () => {
    const action = addIngredient(mockIngredient);
    const res = reducer(initialState, action);

    expect(res).toEqual({
      ingredients: [mockConstructorIngredient],
      bun: null
    });
  });

  test('обрабатывает removeIngredient', () => {
    const stateWithIngredient: BurgerConstructorState = {
      ingredients: [mockConstructorIngredient],
      bun: null
    };

    const action = removeIngredient('test-id');
    const res = reducer(stateWithIngredient, action);

    expect(res).toEqual({
      ingredients: [],
      bun: null
    });
  });

  test('обрабатывает clearConstructor', () => {
    const filledState: BurgerConstructorState = {
      ingredients: [mockConstructorIngredient],
      bun: mockBun
    };

    const action = clearConstructor();
    const res = reducer(filledState, action);

    expect(res).toEqual(initialState);
  });
});
