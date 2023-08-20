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
import { PlaceFound } from '@mobile/models/module';
import CardsList from '@mobile/components/modules/CardsList/CardsList';

const Map = () => {
  const [strokeWidth, setStrokeWidth] = useState(10);
  const [firstSearch, setFirstSearch] = useState(false);
  const {
    modal,
    places: { placesList },
    user: { userLocation },
  } = useReduxState();
  const dispatch = useDispatch();
  const mapRef = useRef<MapView | null>(null);
  const modalRef = useRef<BottomSheet | null>(null);
  const [searchText, setSearchText] = useState('');
  const [showList, setShowList] = useState(false);
  const [markers, setMarkers] = useState<models.PlaceMarker[]>([]);

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

  const handleCardPress = (placeClicked: PlaceFound) => {
    dispatch(setBottomModal('hide'));
    const location = {
      ...placeClicked,
      latitude: placeClicked.center[1],
      longitude: placeClicked.center[0],
      accuracy: null,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    };
    setMarkers(
      placesList.features.map((place) => ({
        ...place,
        latitude: place.center[1],
        longitude: place.center[0],
        accuracy: null,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      }))
    );

    zoomTo(location);
  };

  const handleOnSearch = () => {
    dispatch(setBottomModal('hide'));
    setShowList(true);
    setMarkers(
      placesList.features.map((place) => ({
        ...place,
        latitude: place.center[1],
        longitude: place.center[0],
        accuracy: null,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      }))
    );

    zoomTo({
      ...placesList.features[0],
      latitude: placesList.features[0].center[1],
      longitude: placesList.features[0].center[0],
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
          {!!markers.length &&
            markers.map((marker) => (
              <Marker
                coordinate={marker}
                onPress={() => {
                  zoomTo(marker);
                }}></Marker>
            ))}
        </S.Map>
        {!!markers.length && (
          <Row
            position="absolute"
            top="6%"
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
              <S.MapButton
                onPress={() => {
                  setMarkers([]);
                  dispatch(setBottomModal('close'));
                  setShowList(false);
                  setSearchText('');
                }}>
                <MaterialCommunityIcons name="close" size={30} color="white" />
              </S.MapButton>
            </Box>
          </Row>
        )}

        <MapBottomModal
          ref={modalRef}
          searchText={searchText}
          setSearchText={setSearchText}
          onCardPress={(place) => handleCardPress(place)}
          onSearch={handleOnSearch}
        />

        {!showList && (
          <Row
            position="absolute"
            bottom="16%"
            justifyContent="space-between"
            alignSelf="center"
            alignItems="flex-end"
            zIndex={2}
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
        )}
        {showList && (
          <Row
            position="absolute"
            bottom="0px"
            alignSelf="center"
            alignItems="flex-end"
            zIndex={2}
            width="100%">
            <CardsList data={placesList.features} onCardPress={() => {}} zoomTo={zoomTo} />
          </Row>
        )}
      </Box>
    </>
  );
};

export default Map;
