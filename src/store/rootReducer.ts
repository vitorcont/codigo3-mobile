import { loadingReducer } from './Loading/reducer';
import { combineReducers } from 'redux';

const reducers = combineReducers({
  loading: loadingReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }

  return reducers(state, action);
};

export default rootReducer;
