import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { fetchBetState } from './bettingAPI';

interface BettingState {
  value: number;
  betState: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState = {
  value: 0,
  betState: -1,
  status: 'idle',
} as BettingState;

export const getBetStateAsync = createAsyncThunk(
  'thuleen.io.football.bet.features.betting.GET_BET_STATE',
  async (amount: number) => {
    const response = await fetchBetState();
    // The value we return becomes the `fulfilled` action payload
    return response;
  },
);

const bettingSlice = createSlice({
  name: 'betting',
  initialState,
  reducers: {
    increment(state) {
      state.value++;
    },
    decrement(state) {
      state.value--;
    },
    incrementByAmount(state, action: PayloadAction<number>) {
      state.value += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBetStateAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getBetStateAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.betState = action.payload;
      });
  },
});

export const { increment, decrement, incrementByAmount } = bettingSlice.actions;
export const selectBetting = (state: RootState) => state.betting.value;

export default bettingSlice.reducer;
