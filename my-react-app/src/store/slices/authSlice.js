// authSlice.js - Authentication state management for Expense Tracker
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const API_KEY = "AIzaSyD8L86KAfCrkrVLC3fNCHWXTnWaKuNFqek";

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, returnSecureToken: true }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Login failed');

      localStorage.setItem('token', data.idToken);
      localStorage.setItem('userId', data.localId);
      localStorage.setItem('email', data.email);

      return {
        token: data.idToken,
        userId: data.localId,
        email: data.email,
        isAuthenticated: true,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for signup
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, returnSecureToken: true }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Signup failed');

      localStorage.setItem('token', data.idToken);
      localStorage.setItem('userId', data.localId);
      localStorage.setItem('email', data.email);

      return {
        token: data.idToken,
        userId: data.localId,
        email: data.email,
        isAuthenticated: true,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  token: localStorage.getItem('token') || null,
  userId: localStorage.getItem('userId') || null,
  email: localStorage.getItem('email') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.email = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
    },
    clearError: (state) => {
      state.error = null;
    },
    initializeAuth: (state) => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const email = localStorage.getItem('email');
      if (token) {
        state.token = token;
        state.userId = userId;
        state.email = email;
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.email = action.payload.email;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.email = action.payload.email;
        state.isAuthenticated = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, initializeAuth } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectToken = (state) => state.auth.token;
export const selectUserId = (state) => state.auth.userId;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectEmail = (state) => state.auth.email;

export default authSlice.reducer;