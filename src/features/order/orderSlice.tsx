import { orderBurgerApi, TNewOrder } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface OrderState {
  orderRequest: boolean;
  orderResponse: TNewOrder | null;
  error: string | null;
}

const initialState: OrderState = {
  orderRequest: false, /// идёт ли сейчас запрос на оформление заказа
  orderResponse: null, /// данные для модалки после успешного заказа
  error: null
};

export const fetchOrder = createAsyncThunk(
  'order/postOrder',
  async (data: string[]) => orderBurgerApi(data)
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    cleanOrderResponse: (state) => {
      state.orderResponse = null;
    }
  },
  selectors: {
    getOrderResponse: (state) => state.orderResponse,
    getOrderRequest: (state) => state.orderRequest,
    getOrderError: (state) => state.error
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message!;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderResponse = action.payload.order;
        state.error = null;
      });
  }
});

export const { getOrderResponse, getOrderRequest, getOrderError } =
  orderSlice.selectors;
export const { cleanOrderResponse } = orderSlice.actions;
