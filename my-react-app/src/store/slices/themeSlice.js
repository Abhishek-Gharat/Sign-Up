// themeSlice.js - Theme management for dark/light mode
import { createSlice } from '@reduxjs/toolkit';

// Load initial theme from localStorage or default to light
const loadThemeFromStorage = () => {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme === 'dark' ? 'dark' : 'light';
};

const initialState = {
  mode: loadThemeFromStorage(), // 'light' or 'dark'
  isPremiumActivated: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      // Save to localStorage
      localStorage.setItem('theme', state.mode);
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    activatePremium: (state) => {
      state.isPremiumActivated = true;
    },
    deactivatePremium: (state) => {
      state.isPremiumActivated = false;
    },
  },
});

export const { toggleTheme, setTheme, activatePremium, deactivatePremium } = themeSlice.actions;

// Selectors
export const selectTheme = (state) => state.theme.mode;
export const selectIsDarkMode = (state) => state.theme.mode === 'dark';
export const selectIsPremiumActivated = (state) => state.theme.isPremiumActivated;

export default themeSlice.reducer;
