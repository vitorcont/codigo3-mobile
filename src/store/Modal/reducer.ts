import { SET_BOTTOM_MODAL } from './../actionsType';

export const modalReducer = (state: 'hide' | 'close' | 'open' = 'close', action: any) => {
  switch (action.type) {
    case SET_BOTTOM_MODAL:
      return action.payload;
    default:
      return state;
  }
};

export default modalReducer;
