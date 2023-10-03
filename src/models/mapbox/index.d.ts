import { LocationObjectCoords } from 'expo-location';
import { PlacesResponse } from '../module';

export as namespace mapbox;

export interface MapboxglRouteList {
  routes: MapboxglRoute[];
  waypoints: Waypoint[];
  code: string;
  uuid: string;
}

export interface Geometry {
  coordinates: number[][];
  type: string;
}

export interface Maneuver {
  instruction: string;
  type: string;
  modifier: string;
  location: number[];
}

export interface Waypoint {
  distance: number;
  name: string;
  location: number[];
}

export interface Steps {
  name: string;
  weight: number;
  duration: number;
  distance: number;
  driving_side: string;
  geometry: Geometry;
  intersections: [];
  maneuver: [];
}

export interface Legs {
  via_waypoints: number[];
  weight_typical: number;
  duration_typical: number;
  weight: number;
  duration: number;
  distance: number;
  summary: string;
  annotation: {
    distance: number[];
  };
  steps: [];
}

export interface MapboxglRoute {
  weight_typical: number;
  duration_typical: number;
  weight_name: string;
  weight: number;
  duration: number;
  distance: number;
  legs: [];
  geometry: Geometry;
}
