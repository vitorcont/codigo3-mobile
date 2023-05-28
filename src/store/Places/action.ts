import { getMapboxInstance } from '@mobile/api/axios';
import { LocationObjectCoords } from 'expo-location';
import { Dispatch } from 'redux';
import {
  ACTION_LOADING_END,
  ACTION_LOADING_START,
  SET_BOTTOM_MODAL,
  SET_PLACES_LIST,
} from '../actionsType';

export const searchPlace =
  (searchText: string, userLocation: LocationObjectCoords) => async (dispatch: Dispatch) => {
    try {
      const geocodingInstance = await getMapboxInstance();
      const { data } = await geocodingInstance.get(`${searchText}.json`, {
        params: {
          proximity: `${userLocation.longitude},${userLocation.latitude}`,
        },
      });
      dispatch({
        type: SET_PLACES_LIST,
        payload: data,
      });
    } catch (err) {
      console.log('ERRO', err);
    }
  };
