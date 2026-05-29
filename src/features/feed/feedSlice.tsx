import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  feedRequest: boolean;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  feedRequest: false,
  error: null
};

export const fetchFeed = createAsyncThunk('feed/getOrders', async () =>
  getFeedsApi()
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    getFeedOrders: (state) => state.orders,
    getFeedTotal: (state) => state.total,
    getFeedTodayTotal: (state) => state.totalToday,
    getFeedRequest: (state) => state.feedRequest,
    getFeedError: (state) => state.error
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.feedRequest = true;
        state.error = null;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.feedRequest = false;
        state.error = action.error.message!;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.feedRequest = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.error = null;
      });
  }
});

export const {
  getFeedError,
  getFeedRequest,
  getFeedTodayTotal,
  getFeedOrders,
  getFeedTotal
} = feedSlice.selectors;
