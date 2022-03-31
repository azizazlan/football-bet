import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { default as bettingReducer } from '../features/betting/bettingSlice';

export const store = configureStore({
  reducer: {
    betting: bettingReducer,
  },
  middleware: [thunk, logger],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
