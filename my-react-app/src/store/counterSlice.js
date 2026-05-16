// counterSlice.js - Redux Toolkit slice for counter
// Optimized approach: Using action payloads instead of multiple specific actions
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    increment: (state) => {
      // RTK + Immer allows "mutation" syntax
      // Behind the scenes, Immer creates a new immutable state
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    // Optimized: Single action that accepts any amount via payload
    // This replaces incrementBy2, incrementBy5, etc.
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    // Optimized: Single action that accepts any amount via payload
    // This replaces decrementBy2, decrementBy5, etc.
    decrementByAmount: (state, action) => {
      state.value -= action.payload;
    }
  }
});

export const { increment, decrement, incrementByAmount, decrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
