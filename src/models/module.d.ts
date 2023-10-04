import { LocationObjectCoords } from 'expo-location';
import { RiskStatusEnum } from '@mobile/enum/status';
import { LatLng } from 'react-native-maps';
export as namespace models;

export type BottomModalVisibility = 'hide' | 'close' | 'open';

export interface Project {
  name: string;
}

export interface DropdownData {
  id?: string;
  name?: string;
  value?: string;
}

export interface HandleError {
  status: number;
  message: string;
}

export interface PolyArea {
  id?: string;
  status?: RiskStatusEnum;
  title?: string;
  description?: string;
  coordinates: LatLng[];
}

export interface PlaceProperties {
  address: string;
  category: string;
}

export interface PlaceFound {
  id: string;
  type: string;
  relevance: number;
  text_pt: string;
  text: string;
  place_name_pt: string;
  place_name: string;
  properties: PlaceProperties;
  center: number[];
}

export interface PlacesResponse {
  type: string;
  features: PlaceFound[];
}

export interface PlaceMarker extends LocationObjectCoords {
  id: string;
  type: string;
  relevance: number;
  text_pt: string;
  text: string;
  place_name_pt: string;
  place_name: string;
  properties: PlaceProperties;
  center: number[];
}

export interface ILocation {
  latitude: number;
  longitude: number;
  priority?: number;
}

export interface ISearchRoute {
  origin: ILocation;
  destination: ILocation;
  priority: number;
}

export interface IUpdateLocation {
  latitude: number;
  longitude: number;
  priority: number;
}

export interface IUserIndividual {
  origin: ILocation | null;
  destination: ILocation | null;
  currentLocation: ILocation | null;
  startedAt: Date | null;
  priority: number;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export interface IUserAuth {
  email: string;
  password: string;
}
