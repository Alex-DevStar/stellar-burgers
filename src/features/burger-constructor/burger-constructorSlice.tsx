import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

export interface BurgerConstructorState {
  ingredients: TConstructorIngredient[];
  bun: TIngredient | null;
}

const initialState: BurgerConstructorState = {
  ingredients: [],
  bun: null
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    removeBun: (state) => {
      state.bun = null;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    }
  },
  selectors: {
    getConstructorBun: (state) => state.bun,
    getConstructorIngredients: (state) => state.ingredients
  }
});

export const { getConstructorBun, getConstructorIngredients } =
  constructorSlice.selectors;

export const {
  addBun,
  addIngredient,
  removeIngredient,
  removeBun,
  clearConstructor
} = constructorSlice.actions;
export default constructorSlice.reducer;
