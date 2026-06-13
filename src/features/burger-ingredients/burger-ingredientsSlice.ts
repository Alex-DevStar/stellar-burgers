import { createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';

export interface BurgerIngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BurgerIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/getIngridients',
  async () => getIngredientsApi()
);

export const IngredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIsLoading: (state) => state.isLoading,
    getIngredients: (state) => state.ingredients,
    getError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message!;
        // вернуться к обработке ощибки при понимании входных данных
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      });
  }
});

export const { getIsLoading, getIngredients, getError } =
  IngredientsSlice.selectors;
