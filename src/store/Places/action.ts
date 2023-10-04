import { SET_ACTIVE_ROUTE } from './../actionsType';
import { getMapboxInstance } from '@mobile/api/axios';
import { calculateDistance } from '@mobile/services/location';
import { LocationObjectCoords } from 'expo-location';
import { Dispatch } from 'redux';
import { SET_PLACES_LIST } from '../actionsType';

export const searchPlace =
  (searchText: string, userLocation: LocationObjectCoords) => async (dispatch: Dispatch) => {
    try {
      const geocodingInstance = await getMapboxInstance();
      const { data }: { data: models.PlacesResponse } = await geocodingInstance.get(
        `${searchText}.json`,
        {
          params: {
            proximity: `${userLocation.longitude},${userLocation.latitude}`,
          },
        }
      );
      const sortedPlaces: models.PlacesResponse = {
        ...data,
        features: data.features.sort((a, b) => {
          const aDistance = calculateDistance(
            userLocation?.latitude!,
            userLocation?.longitude!,
            a.center[1],
            a.center[0]
          );
          const bDistance = calculateDistance(
            userLocation?.latitude!,
            userLocation?.longitude!,
            b.center[1],
            b.center[0]
          );
          return aDistance - bDistance;
        }),
      };
      dispatch({
        type: SET_PLACES_LIST,
        payload: sortedPlaces,
      });
    } catch (err) {
      console.log('searchPlace_error', err);
    }
  };

export const setActiveRoute =
  (data: mapbox.MapboxglRouteList | null) => async (dispatch: Dispatch) => {
    dispatch({
      type: SET_ACTIVE_ROUTE,
      payload: data,
    });
  };
