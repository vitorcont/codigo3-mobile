import { Dispatch } from 'redux';
import { ACTION_LOADING_END, ACTION_LOADING_START, SET_BOTTOM_MODAL } from '../actionsType';

export const setBottomModal = (data: models.BottomModalVisibility) => (dispatch: Dispatch) => {
  dispatch({
    type: SET_BOTTOM_MODAL,
    payload: data,
  });
};
