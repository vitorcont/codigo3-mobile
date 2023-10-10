import { ACTION_LOADING_END, ACTION_LOADING_START } from '../actionsType';

export const startLoading = () => ({
  type: ACTION_LOADING_START,
});

export const stopLoading = () => ({
  type: ACTION_LOADING_END,
});

export const setLoading = (value: number) => ({
  type: ACTION_LOADING_END,
  payload: value,
});
