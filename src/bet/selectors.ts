import { createSelector } from 'reselect';
import { AppState } from '../reducer';

const getPending = (state: AppState) => state.bet.pending;

const getWinningTeam = (state: AppState) => state.bet.winningTeam;

const getError = (state: AppState) => state.bet.error;
