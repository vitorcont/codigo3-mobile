import { LocationObjectCoords } from 'expo-location';
import { PlacesResponse } from '../module';

export as namespace reducers;

export interface SearchState {
  placesList: PlacesResponse;
  activeRoute: mapbox.MapboxglRouteList | null;
}

export interface UserState {
  userLocation: LocationObjectCoords | null;
}

export interface ReduxState {
  loading: number;
  modal: 'hide' | 'close' | 'open';
  places: SearchState;
  user: UserState;
}
