import { SET_LOADING } from './../actionsType';
import { ACTION_LOADING_END, ACTION_LOADING_START } from '../actionsType';

export const loadingReducer = (state: number = 0, action: any) => {
  switch (action.type) {
    case ACTION_LOADING_START:
      return state + 1;
    case ACTION_LOADING_END:
      return state - 1;
    case SET_LOADING:
      return action.payload;
    default:
      return state;
  }
};

export default loadingReducer;
