import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type ProfileOrdersState = {
  orders: TOrder[];
  ordersRequest: boolean;
  error: string | null;
};

const initialState: ProfileOrdersState = {
  orders: [],
  ordersRequest: false,
  error: null
};

export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/getOrders',
  async () => getOrdersApi()
);

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  selectors: {
    getProfileOrders: (state) => state.orders,
    getProfileOrdersRequest: (state) => state.ordersRequest,
    getProfileOrdersError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.ordersRequest = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.ordersRequest = false;
        state.error =
          action.error.message || 'Не удалось получить историю заказов';
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.ordersRequest = false;
        state.orders = action.payload;
        state.error = null;
      });
  }
});

export const {
  getProfileOrders,
  getProfileOrdersRequest,
  getProfileOrdersError
} = profileOrdersSlice.selectors;

export default profileOrdersSlice.reducer;
