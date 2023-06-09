import React, { useEffect, useMemo, useRef, useState } from 'react';
import MapView, { LatLng, Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { TouchableOpacity } from 'react-native';
import { LocationObjectCoords, watchPositionAsync, Accuracy } from 'expo-location';
import { Box, MapBottomModal, MapMarker, Row } from '@mobile/components';
import * as S from './styles';
import theme from '@mobile/theme';
import { FontAwesome, AntDesign, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { getUserLocation, verifyPointInsideAreas } from '@mobile/services/location';
import { mapPolygons } from '@mobile/services/polyMocks';
import { route } from '@mobile/assets/mock/route';
import { useReduxState } from '@mobile/hooks/useReduxState';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import GPSIcon from '@mobile/assets/icons/ic_gps.svg';
import { searchPlace } from '@mobile/store/Places/action';
import { useDispatch } from 'react-redux';
import { setUserLocation } from '@mobile/store/User/action';
import { setBottomModal } from '@mobile/store/Modal/action';

const Map = () => {
  const [strokeWidth, setStrokeWidth] = useState(10);
  const [firstSearch, setFirstSearch] = useState(false);
  const {
    modal,
    user: { userLocation },
  } = useReduxState();
  const dispatch = useDispatch();
  const mapRef = useRef<MapView | null>(null);
  const modalRef = useRef<BottomSheet | null>(null);

  const handleIconVisibility = (region: Region) => {
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

  const zoomTo = (coords: LocationObjectCoords) => {
    if (mapRef.current) {
      mapRef.current.animateCamera(
        {
          center: {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
          zoom: 16,
        },
        { duration: 500 }
      );
    }
  };

  const centerUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateCamera(
        {
          heading: userLocation?.heading!,
          center: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
          zoom: 18,
        },
        { duration: 500 }
      );
    }
  };

  const handleCardPress = (lat: number, long: number) => {
    dispatch(setBottomModal('close'));
    zoomTo({
      latitude: lat,
      longitude: long,
      accuracy: null,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    });
  };

  useEffect(() => {
    const watchLocation = async () => {
      try {
        const watchId = await watchPositionAsync(
          { accuracy: Accuracy.High, timeInterval: 500, distanceInterval: 5 },
          (position) => {
            dispatch(setUserLocation(position.coords));
          }
        );

        return () => {
          watchId.remove();
        };
      } catch (error) {
        console.log('Error watching location:', error);
      }
    };

    watchLocation();
  }, []);

  useEffect(() => {
    if (modalRef) {
      if (modal === 'close') {
        modalRef.current?.snapToIndex(0);
      }
      if (modal === 'open') {
        modalRef.current?.snapToIndex(1);
      }
      if (modal === 'hide') {
        modalRef.current?.close();
      }
    }
  }, [modal]);

  useEffect(() => {
    if (!firstSearch && userLocation) {
      setFirstSearch(true);
      dispatch(searchPlace('hospital', userLocation));
    }
  }, [userLocation]);

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
              backgroundColor={theme.colors.primary}
              onPress={() => centerUserLocation()}
              icon={
                <Box
                  width="80px"
                  height="80px"
                  backgroundColor="blue"
                  justifyContent="center"
                  alignItems="center">
                  <Box
                    width="2px"
                    height="2px"
                    style={{ transform: [{ rotate: `${userLocation.heading}deg` }] }}>
                    <GPSIcon />
                  </Box>
                </Box>
              }
            />
          )}
        </S.Map>
        <Row
          position="absolute"
          bottom="16%"
          justifyContent="space-between"
          alignSelf="center"
          alignItems="flex-end"
          zIndex={5}
          flexDirection="column"
          right="5%">
          <Box
            marginTop="20px"
            width="46px"
            height="46px"
            alignItems="center"
            justifyContent="center"
            backgroundColor={theme.colors.primary}
            borderRadius="30px">
            <S.MapButton onPress={() => centerUserLocation()}>
              <MaterialCommunityIcons name="crosshairs-gps" size={30} color="white" />
            </S.MapButton>
          </Box>
        </Row>
        <MapBottomModal ref={modalRef} onCardPress={(lat, long) => handleCardPress(lat, long)} />
      </Box>
    </>
  );
};

export default Map;
