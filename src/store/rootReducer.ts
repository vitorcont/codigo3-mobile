import { loadingReducer } from './Loading/reducer';
import { combineReducers } from 'redux';
import modalReducer from './Modal/reducer';

const reducers = combineReducers({
  loading: loadingReducer,
  modal: modalReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }

  return reducers(state, action);
};

export default rootReducer;
