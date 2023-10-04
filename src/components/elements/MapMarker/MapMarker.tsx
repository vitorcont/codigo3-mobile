import MapView, { Marker, Callout, LatLng } from 'react-native-maps';
import Box from '../Box/Box';
import Button from '../Button/Button';

export interface MapMarkerProps {
  coordinate: LatLng;
  icon?: React.ReactNode;
  backgroundColor?: string;
  onPress?: () => void;
  bearing?: number;
}

const MapMarker = (props: MapMarkerProps) => {
  return (
    <Marker
      coordinate={props.coordinate}
      onPress={props.onPress}
      style={{ transform: [{ rotate: `${props.bearing}deg` }] }}>
      <Button backgroundColor={props.backgroundColor} StartAdornment={props.icon} />
    </Marker>
  );
};

export default MapMarker;
