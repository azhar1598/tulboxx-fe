import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../../services/apiService';
// import { setToken, removeToken } from '../../services/tokenService';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

export const login = createAsyncThunk('auth/login', async (credentials: { email: string; password: string }) => {
  // const response = await api.post('/login', credentials);
  // setToken(response.data.accessToken, response.data.refreshToken);
  // return response.data.user;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      // removeToken();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state:any, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    });
  },
});

export const { logout } = authSlice.actions;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export default authSlice.reducer;
