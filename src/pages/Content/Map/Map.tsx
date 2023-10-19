import React, { useContext, useEffect, useRef, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { LocationObjectCoords } from 'expo-location';
import {
  Box,
  CodeModal,
  Directions,
  MapBottomModal,
  MapMarker,
  PathBuilder,
  Row,
  TopBar,
} from '@mobile/components';
import * as S from './styles';
import theme from '@mobile/theme';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useReduxState } from '@mobile/hooks/useReduxState';
import GPSIcon from '@mobile/assets/icons/ic_gps.svg';
import { useDispatch } from 'react-redux';
import { setBottomModal } from '@mobile/store/Modal/action';
import { PlaceFound } from '@mobile/models/module';
import CardsList from '@mobile/components/modules/CardsList/CardsList';
import PlaceDetails from '@mobile/components/modules/PlaceDetails/PlaceDetails';
import { SocketContext } from '@mobile/context/SocketContext';
import { SearchContext } from '@mobile/context/SearchContext';
import { setActiveRoute } from '@mobile/store/Places/action';
import { LocationContext } from '@mobile/context/LocationContext';

const Map = () => {
  const [priorityModal, setPriorityModal] = useState(false);
  const [lockUser, setLockUser] = useState(false);

  const {
    places: { placesList, activeRoute },
  } = useReduxState();
  const { userLocation } = useContext(LocationContext)!;
  const socketContext = useContext(SocketContext)!;
  const {
    handleClose,
    markers,
    placePressed,
    setMarkers,
    setPlacePressed,
    setShowDetails,
    setShowList,
    showDetails,
    showList,
  } = useContext(SearchContext)!;

  const dispatch = useDispatch();
  const mapRef = useRef<MapView | null>(null);

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
            latitude: userLocation?.latitude ?? 0,
            longitude: userLocation?.longitude ?? 0,
          },
          zoom: 16,
          pitch: 0,
        },
        { duration: 500 }
      );
    }
  };

  const centerNavigation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateCamera(
        {
          heading: userLocation?.heading!,
          center: {
            latitude: userLocation?.latitude ?? 0,
            longitude: userLocation?.longitude ?? 0,
          },
          zoom: 19,
          pitch: 56,
        },
        { duration: 1400 }
      );
    }
  };

  const handleCardPress = (placeClicked: PlaceFound) => {
    dispatch(setBottomModal('hide'));
    setPlacePressed(placeClicked);
    setShowDetails(true);
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
    setMarkers([location]);

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

  const handleStartTrip = (code: number) => {
    setPriorityModal(false);
    setMarkers([]);
    socketContext.socketStartTrip(placePressed!, code, userLocation!);
    setLockUser(true);
    centerNavigation();
  };

  const handleEndTrip = () => {
    dispatch(setActiveRoute(null));
    socketContext.socketEndTrip();
    centerUserLocation();
  };

  useEffect(() => {
    if (activeRoute && lockUser) {
      centerNavigation();
    }
  }, [userLocation, lockUser]);

  return (
    <>
      <CodeModal
        setVisible={setPriorityModal}
        visible={priorityModal}
        onSelectPriority={(code) => {
          handleStartTrip(code);
        }}
      />
      <Box flex={1}>
        <S.Map
          pitchEnabled
          showsIndoors={false}
          showsCompass={false}
          showsBuildings={false}
          initialRegion={{
            latitude: -16.255448,
            longitude: -47.150932,
            latitudeDelta: 40,
            longitudeDelta: 40,
          }}
          onTouchStart={() => {
            if (activeRoute) {
              setLockUser(false);
            }
          }}
          ref={mapRef}
          provider={PROVIDER_GOOGLE}>
          {/* {activeRoute && <PathPolygon />} */}
          {!!activeRoute && (
            <Marker
              coordinate={{
                latitude:
                  activeRoute.routes[0].geometry.coordinates[
                    activeRoute.routes[0].geometry.coordinates.length - 1
                  ][1],
                longitude:
                  activeRoute.routes[0].geometry.coordinates[
                    activeRoute.routes[0].geometry.coordinates.length - 1
                  ][0],
              }}
              onPress={() => {}}></Marker>
          )}
          {!!userLocation && (
            <>
              <MapMarker
                coordinate={userLocation}
                backgroundColor={theme.colors.primary}
                onPress={() => centerUserLocation()}
                icon={
                  <Box width="80px" height="80px" justifyContent="center" alignItems="center">
                    <Box width="10px" height="10px">
                      <GPSIcon width={50} height={50} />
                    </Box>
                  </Box>
                }
              />
            </>
          )}
          {!!markers.length &&
            markers.map((marker) => (
              <Marker
                coordinate={marker}
                onPress={() => {
                  zoomTo(marker);
                }}></Marker>
            ))}
          {!!activeRoute && <PathBuilder path={activeRoute} />}
        </S.Map>
        <Box position="absolute" height="100%" width="100%" justifyContent="flex-end">
          <TopBar />
          {!showList && !showDetails && (
            <Row alignSelf="flex-end" alignItems="flex-end" right="2%" bottom="40%">
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
          {!!markers.length && (
            <Row
              position="absolute"
              top="12%"
              justifyContent="space-between"
              alignSelf="center"
              alignItems="flex-end"
              zIndex={5}
              flexDirection="column"
              right="5%">
              {!showDetails && (
                <Box
                  marginTop="20px"
                  width="46px"
                  height="46px"
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor={theme.colors.primary}
                  borderRadius="30px">
                  <S.MapButton onPress={handleClose}>
                    <MaterialCommunityIcons name="close" size={30} color="white" />
                  </S.MapButton>
                </Box>
              )}
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
              <CardsList
                data={
                  placePressed
                    ? [placePressed]
                        .concat(placesList.features)
                        .filter((item, index, arr) => arr.indexOf(item) === index)
                    : placesList.features
                }
                onCardPress={(place) => handleCardPress(place)}
                zoomTo={zoomTo}
              />
            </Row>
          )}
          {activeRoute && (
            <Row alignSelf="flex-end" alignItems="flex-end" right="2%" bottom="40%">
              <Box
                marginTop="20px"
                width="46px"
                height="46px"
                alignItems="center"
                justifyContent="center"
                backgroundColor={theme.colors.primary}
                borderRadius="30px">
                <S.MapButton onPress={() => setLockUser(true)}>
                  <Ionicons name="ios-navigate-circle" size={30} color="white" />
                </S.MapButton>
              </Box>
            </Row>
          )}
          {!activeRoute && showDetails && placePressed && (
            <PlaceDetails onStart={() => setPriorityModal(true)} />
          )}
          {activeRoute && <Directions onEndTrip={() => handleEndTrip()} />}
        </Box>
        <MapBottomModal onCardPress={(place) => handleCardPress(place)} onSearch={handleOnSearch} />
      </Box>
    </>
  );
};

export default Map;
