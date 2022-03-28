import { combineReducers } from 'redux';
// import vrfReducer from './vrf/reducer';

const rootReducer = combineReducers({
  // vrf: vrfReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;
