import { BET_REQUEST, BET_SUCCESS, BET_FAILURE } from './actionTypes';

import { BetRequest, BetSuccess, BetSuccessPayload, BetFailure, BetFailurePayload } from './types';

export const betRequest = (): BetRequest => ({
  type: BET_REQUEST,
});

export const betSuccess = (payload: BetSuccessPayload): BetSuccess => ({
  type: BET_SUCCESS,
  payload,
});

export const betFailure = (payload: BetFailurePayload): BetFailure => ({
  type: BET_FAILURE,
  payload,
});
