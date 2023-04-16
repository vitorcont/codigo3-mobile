import { Box, Col, MapMarker, StyledText } from '@mobile/components/elements';
import theme from '@mobile/theme';
import { StatusCard } from '@mobile/components';
import { LatLng, MapPolygon, MapPolygonProps, Marker, Region } from 'react-native-maps';
import { AntDesign, MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { RiskStatusEnum } from '@mobile/enum/status';

export interface PolygonBuilderProps extends MapPolygonProps {
  variant: RiskStatusEnum;
  onPressIcon?: (coord: LatLng) => void;
  iconsVisible: boolean;
}

const PolygonBuilder = (props: PolygonBuilderProps) => {
  const getFillColor = () => {
    const colors = {
      [RiskStatusEnum.SAFE]: 'transparent',
      [RiskStatusEnum.ATTENTION]: theme.colors.attentionFill,
      [RiskStatusEnum.DANGER]: theme.colors.dangerFill,
      [RiskStatusEnum.EVACUATE]: theme.colors.evacuateFill,
    };

    return colors[props.variant];
  };

  const getStrokeColor = () => {
    const colors = {
      [RiskStatusEnum.SAFE]: 'transparent',
      [RiskStatusEnum.ATTENTION]: theme.colors.attention,
      [RiskStatusEnum.DANGER]: theme.colors.danger,
      [RiskStatusEnum.EVACUATE]: theme.colors.evacuate,
    };

    return colors[props.variant];
  };

  const getIcon = () => {
    const colors = {
      [RiskStatusEnum.SAFE]: 'transparent',
      [RiskStatusEnum.ATTENTION]: (
        <AntDesign name="exclamationcircle" size={18} color={theme.colors.white} />
      ),
      [RiskStatusEnum.DANGER]: <FontAwesome name="warning" size={18} color={theme.colors.white} />,
      [RiskStatusEnum.EVACUATE]: (
        <MaterialCommunityIcons name="run-fast" size={24} color={theme.colors.white} />
      ),
    };

    return colors[props.variant];
  };

  const getMarkerCoordinates = () => {
    const latSum = props.coordinates.reduce((prev, current) => ({
      latitude: prev.latitude + current.latitude,
      longitude: prev.longitude + current.longitude,
    }));

    const markerCoords = {
      latitude: latSum.latitude / props.coordinates.length ?? 1,
      longitude: latSum.longitude / props.coordinates.length ?? 1,
    };

    return markerCoords;
  };

  return (
    <>
      {props.variant !== RiskStatusEnum.SAFE && (
        <>
          <MapPolygon
            {...props}
            strokeColor={getStrokeColor()}
            strokeWidth={2}
            fillColor={getFillColor()}
          />
          {props.iconsVisible && (
            <MapMarker
              onPress={() => props.onPressIcon && props.onPressIcon(getMarkerCoordinates())}
              backgroundColor={getStrokeColor()}
              icon={getIcon()}
              coordinate={getMarkerCoordinates()}
            />
          )}
        </>
      )}
    </>
  );
};

export default PolygonBuilder;
