import { SET_USER_LOCATION } from './../actionsType';
import { LocationObjectCoords } from 'expo-location';
import { Dispatch } from 'redux';

export const setUserLocation =
  (userLocation: LocationObjectCoords) => async (dispatch: Dispatch) => {
    dispatch({
      type: SET_USER_LOCATION,
      payload: userLocation,
    });
  };
