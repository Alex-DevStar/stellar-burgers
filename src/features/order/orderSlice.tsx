import { getOrderByNumberApi, orderBurgerApi, TNewOrder } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export interface OrderState {
  orderRequest: boolean;
  orderResponse: TNewOrder | null;
  currentOrder: TOrder | null;
  currentOrderRequest: boolean;
  error: string | null;
  currentOrderError: string | null;
}

const initialState: OrderState = {
  orderRequest: false, /// идёт ли сейчас запрос на оформление заказа
  orderResponse: null, /// данные для модалки после успешного заказа
  error: null,
  currentOrder: null,
  currentOrderRequest: false,
  currentOrderError: null
};

export const fetchOrder = createAsyncThunk(
  'order/postOrder',
  async (data: string[]) => orderBurgerApi(data)
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/getOrder',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders;
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    cleanOrderResponse: (state) => {
      state.orderResponse = null;
    },
    cleanCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  selectors: {
    getOrderResponse: (state) => state.orderResponse,
    getOrderRequest: (state) => state.orderRequest,
    getOrderError: (state) => state.error,
    getCurrentOrder: (state) => state.currentOrder,
    getCurrentOrderRequest: (state) => state.currentOrderRequest,
    getCurrentOrderError: (state) => state.currentOrderError
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка оформления заказа';
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderResponse = action.payload.order;
        state.error = null;
      })

      .addCase(fetchOrderByNumber.pending, (state) => {
        state.currentOrderRequest = true;
        state.currentOrderError = null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.currentOrderRequest = false;
        state.currentOrderError =
          action.error.message || 'Ошибка получения заказа';
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrderRequest = false;
        state.currentOrder = action.payload[0] || null;
        state.currentOrderError = null;
      });
  }
});

export const {
  getOrderResponse,
  getOrderRequest,
  getOrderError,
  getCurrentOrder,
  getCurrentOrderRequest,
  getCurrentOrderError
} = orderSlice.selectors;

export const { cleanOrderResponse, cleanCurrentOrder } = orderSlice.actions;
