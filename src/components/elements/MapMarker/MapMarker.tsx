import MapView, { Marker, Callout, LatLng } from 'react-native-maps';
import Box from '../Box/Box';
import Button from '../Button/Button';

export interface MapMarkerProps {
  coordinate: LatLng;
  icon?: React.ReactNode;
  backgroundColor?: string;
  onPress?: () => void;
}

const MapMarker = (props: MapMarkerProps) => {
  return (
    <Marker coordinate={props.coordinate} onPress={props.onPress}>
      <Button backgroundColor={props.backgroundColor} StartAdornment={props.icon} />
    </Marker>
  );
};

export default MapMarker;
