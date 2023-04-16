import React, { useEffect, useMemo, useRef, useState } from 'react';
import MapView, { LatLng, Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Linking, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { LocationObjectCoords } from 'expo-location';
import { useLinkTo } from '@react-navigation/native';
import {
  AnimatedWarning,
  Box,
  Button,
  Col,
  MapBottomModal,
  MapMarker,
  MapStatusCard,
  PolygonBuilder,
  PureModal,
  Row,
  StatusCard,
  StyledText,
} from '@mobile/components';
import * as S from './styles';
import theme from '@mobile/theme';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import {
  getUserLocation,
  isPointInside,
  verifyAreaInsideAreas,
  verifyPointInsideAreas,
} from '@mobile/services/location';
import WarningModal from '@mobile/components/modules/WarningModal/WarningModal';
import { mapPolygons } from '@mobile/services/polyMocks';
import { RiskStatusEnum } from '@mobile/enum/status';
import { route } from '@mobile/assets/mock/route';

const Map = () => {
  const [userLocation, setUserLocation] = useState<LocationObjectCoords | null>(null);
  const [strokeWidth, setStrokeWidth] = useState(10);
  const [riskStatus, setRiskStatus] = useState<models.PolyArea | null>(null);
  const mapRef = useRef<MapView | null>(null);
  const [informationModal, setInformationModal] = useState({
    information: false,
    index: 0,
  });

  const handleIconVisibility = (region: Region) => {
    console.log(strokeWidth, region.longitudeDelta, region.longitudeDelta > 0.06);
    if (strokeWidth !== 20 && region.longitudeDelta < 0.007) {
      setStrokeWidth(20);
    }
    if (strokeWidth !== 15 && region.longitudeDelta > 0.007 && region.longitudeDelta < 0.1) {
      setStrokeWidth(15);
    }
    if (strokeWidth !== 10 && region.longitudeDelta > 0.1) {
      setStrokeWidth(10);
    }
  };

  const setDeviceLocation = async () => {
    const location = await getUserLocation();
    if (location) setRiskStatus(verifyPointInsideAreas(location, mapPolygons));
    setUserLocation(location);
  };

  const zoomIn = (coord: LatLng) => {
    mapRef.current &&
      mapRef.current.animateToRegion({
        latitude: coord.latitude,
        longitude: coord.longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      });
  };

  const centerUserLocation = () => {
    if (userLocation && mapRef.current) {
      zoomIn(userLocation);
    }
  };

  useEffect(() => {
    setDeviceLocation();

    const timeout = setTimeout(() => {
      setDeviceLocation();
    }, 10000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Box flex={1}>
        <S.Map
          showsTraffic
          showsCompass
          showsScale
          showsMyLocationButton
          initialRegion={{
            latitude: -16.255448,
            longitude: -47.150932,
            latitudeDelta: 40,
            longitudeDelta: 40,
          }}
          onRegionChange={handleIconVisibility}
          ref={mapRef}
          provider={PROVIDER_GOOGLE}>
          {!!userLocation && (
            <MapMarker
              coordinate={userLocation}
              backgroundColor={theme.colors.secundary}
              onPress={() => zoomIn(userLocation)}
              icon={<MaterialIcons name="location-history" size={30} color={theme.colors.white} />}
            />
          )}
          <Polyline
            coordinates={route.map((marker) => ({
              latitude: marker[1],
              longitude: marker[0],
            }))}
            strokeColor="#9000ff"
            strokeWidth={strokeWidth}
          />
        </S.Map>
        <Row
          position="absolute"
          bottom="8%"
          justifyContent="space-between"
          alignSelf="center"
          alignItems="flex-end"
          width="90%">
          <Box alignItems="flex-end">
            <Box marginBottom="15px">
              <Button
                StartAdornment={
                  <MaterialIcons name="gps-fixed" size={24} color={theme.colors.white} />
                }
                backgroundColor={theme.colors.secundary}
                onPress={centerUserLocation}
              />
            </Box>
          </Box>
        </Row>
      </Box>
    </>
  );
};

export default Map;
