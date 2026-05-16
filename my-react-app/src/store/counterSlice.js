// counterSlice.js - Redux Toolkit slice for counter
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    incrementBy2: (state) => {
      state.value += 2;
    },
    decrementBy2: (state) => {
      state.value -= 2;
    }
  }
});

export const { increment, decrement, incrementByAmount, incrementBy2, decrementBy2 } = counterSlice.actions;
export default counterSlice.reducer;
