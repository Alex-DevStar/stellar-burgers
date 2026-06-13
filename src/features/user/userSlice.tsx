import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

export interface UserState {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  user: TUser | null;
  authRequest: boolean;
  authError: string | null;
}

const initialState: UserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  user: null,
  authRequest: false,
  authError: null
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  const data = await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
  return data;
});

export const getUser = createAsyncThunk('user/get', async () => getUserApi());

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => updateUserApi(data)
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  selectors: {
    getIsAuthChecked: (state) => state.isAuthChecked,
    getIsAuthenticated: (state) => state.isAuthenticated,
    getUserData: (state) => state.user,
    getAuthRequest: (state) => state.authRequest,
    getAuthError: (state) => state.authError
  },
  extraReducers: (builder) => {
    builder
      // регистрация
      .addCase(registerUser.pending, (state) => {
        state.authRequest = true;
        state.authError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.authRequest = false;
        state.authError = action.error.message || 'Ошибка регистрации';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.authRequest = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.authError = null;
      })

      // логин
      .addCase(loginUser.pending, (state) => {
        state.authRequest = true;
        state.authError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.authRequest = false;
        state.authError = action.error.message || 'Ошибка входа';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authRequest = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.authError = null;
      })

      // разлогин
      .addCase(logoutUser.pending, (state) => {
        state.authRequest = true;
        state.authError = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.authRequest = false;
        state.authError = action.error.message || 'Ошибка выхода';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.authRequest = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.authError = null;
      })

      // получение данных
      .addCase(getUser.pending, (state) => {
        state.authRequest = true;
        state.authError = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.authRequest = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.authError =
          action.error.message || 'Не удалось получить пользователя';
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.authRequest = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.authError = null;
      })

      // обновление данных
      .addCase(updateUser.pending, (state) => {
        state.authRequest = true;
        state.authError = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.authRequest = false;
        state.authError = action.error.message || 'Не удалось обновить профиль';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.authRequest = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.authError = null;
      });
  }
});

export const {
  getIsAuthChecked,
  getIsAuthenticated,
  getUserData,
  getAuthRequest,
  getAuthError
} = userSlice.selectors;

export const { setAuthChecked } = userSlice.actions;

export default userSlice.reducer;
