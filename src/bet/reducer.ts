import { BET_FAILURE, BET_REQUEST, BET_SUCCESS } from './actionTypes';
import { BetState, BetActions } from './types';

const initialState: BetState = {
  pending: false,
  error: null,
  winningTeam: 0,
  state: 1, // 1=CLOSED
};

export default (state = initialState, action: BetActions) => {
  switch (action.type) {
    case BET_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case BET_SUCCESS:
      return {
        ...state,
        pending: false,
        error: null,
      };
    case BET_FAILURE:
      return {
        ...state,
        pending: false,
        error: action.payload.error,
      };
    default:
      return {
        ...state,
      };
  }
};
