import { ACTION_LOADING_END, ACTION_LOADING_START, SET_LOADING } from '../actionsType';

export const startLoading = () => ({
  type: ACTION_LOADING_START,
});

export const stopLoading = () => ({
  type: ACTION_LOADING_END,
});

export const setLoading = (value: number) => ({
  type: SET_LOADING,
  payload: value,
});
