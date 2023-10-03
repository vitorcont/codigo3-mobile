import { userReducer } from './User/reducer';
import { placesReducer } from './Places/reducer';
import { loadingReducer } from './Loading/reducer';
import { combineReducers } from 'redux';
import modalReducer from './Modal/reducer';

const reducers = combineReducers({
  loading: loadingReducer,
  modal: modalReducer,
  places: placesReducer,
  user: userReducer,
});

const rootReducer = (state: any, action: any) => {
  console.log(state);
  if (action.type === 'LOGOUT') {
    state = undefined;
  }

  return reducers(state, action);
};

export default rootReducer;
