import { BET_REQUEST, BET_SUCCESS, BET_FAILURE } from './actionTypes';

export interface Bet {
  id: number;
  selectedTeam: number;
  betAmount: number;
}

export interface BetState {
  winningTeam: number;
  state: number;
  error: string | null;
  pending: boolean;
}

export interface BetSuccessPayload {
  payload: Bet;
}

export interface BetFailurePayload {
  error: string;
}

export interface BetRequest {
  type: typeof BET_REQUEST;
}

export interface BetSuccess {
  type: typeof BET_SUCCESS;
  payload: BetSuccessPayload;
}

export interface BetFailure {
  type: typeof BET_FAILURE;
  payload: BetFailurePayload;
}

export type BetActions = BetRequest | BetSuccess | BetFailure;
