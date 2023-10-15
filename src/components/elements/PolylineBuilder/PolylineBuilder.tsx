import theme from '@mobile/theme';
import { LatLng, Polyline } from 'react-native-maps';
import { useMemo } from 'react';

export interface PolylineBuilderProps {
  path: mapbox.MapboxglRouteList;
}

const PolylineBuilder = (props: PolylineBuilderProps) => {
  const treatedPath: LatLng[] = props.path.routes[0].geometry.coordinates.map((value) => ({
    latitude: value[1],
    longitude: value[0],
  }));

  return <Polyline coordinates={treatedPath} strokeColor={theme.colors.primary} strokeWidth={14} />;
};

export default PolylineBuilder;
