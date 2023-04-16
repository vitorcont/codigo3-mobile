import { RiskStatusEnum } from '@mobile/enum/status';
import { LatLng } from 'react-native-maps';
export as namespace models;

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
