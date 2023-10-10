import { AnimatedMarker, useAnimatedRegion } from '@mobile/hooks/useAnimatedRegion';
import { useEffect } from 'react';
import MapView, { Marker, Callout, LatLng } from 'react-native-maps';
import { Easing } from 'react-native-reanimated';
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
  const animatedRegion = useAnimatedRegion(props.coordinate);

  useEffect(() => {
    animatedRegion.animate({
      latitude: props.coordinate.latitude,
      longitude: props.coordinate.longitude,
      duration: 1000,
      easing: Easing.linear,
    });
  }, [props.coordinate]);

  return (
    <AnimatedMarker
      coordinate={props.coordinate}
      animatedProps={animatedRegion.props}
      onPress={props.onPress}>
      <Button backgroundColor={props.backgroundColor} StartAdornment={props.icon} />
    </AnimatedMarker>
  );
};

export default MapMarker;
