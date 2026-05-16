// authSlice.js - Redux Toolkit slice for authentication
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null
  },
  reducers: {
    // Login action - sets isAuthenticated to true
    // We don't care about the form data, just log them in
    login: (state) => {
      state.isAuthenticated = true;
      state.user = { loggedIn: true };
    },
    // Logout action - sets isAuthenticated to false
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
