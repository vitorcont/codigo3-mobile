import { PolylineBuilder } from '@mobile/components/elements';
import { Marker } from 'react-native-maps';

export interface PathBuilderProps {
  path: mapbox.MapboxglRouteList;
}

const PathBuilder = (props: PathBuilderProps) => {
  const finalWaypoint = {
    latitude: props.path.waypoints[1].location[1],
    longitude: props.path.waypoints[1].location[0],
  };
  return (
    <>
      <PolylineBuilder path={props.path} />
      <Marker coordinate={finalWaypoint}></Marker>
    </>
  );
};

export default PathBuilder;
