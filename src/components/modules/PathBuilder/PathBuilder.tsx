import { PolylineBuilder } from '@mobile/components/elements';

export interface PathBuilderProps {
  path: mapbox.MapboxglRouteList;
}

const PathBuilder = (props: PathBuilderProps) => {
  return <PolylineBuilder path={props.path} />;
};

export default PathBuilder;
