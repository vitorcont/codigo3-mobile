import React, { useContext, useRef, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { LocationObjectCoords } from 'expo-location';
import {
  Box,
  CodeModal,
  MapBottomModal,
  MapMarker,
  PathBuilder,
  PolylineBuilder,
  Row,
} from '@mobile/components';
import * as S from './styles';
import theme from '@mobile/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useReduxState } from '@mobile/hooks/useReduxState';
import GPSIcon from '@mobile/assets/icons/ic_gps.svg';
import { useDispatch } from 'react-redux';
import { setBottomModal } from '@mobile/store/Modal/action';
import { PlaceFound } from '@mobile/models/module';
import CardsList from '@mobile/components/modules/CardsList/CardsList';
import PlaceDetails from '@mobile/components/modules/PlaceDetails/PlaceDetails';
import { SocketContext } from '@mobile/context/SocketContext';
import { SearchContext } from '@mobile/context/SearchContext';
import PolygonBuilder from '@mobile/components/modules/PolygonBuilder/PolygonBuilder';

const Map = () => {
  const [strokeWidth, setStrokeWidth] = useState(10);
  const [priorityModal, setPriorityModal] = useState(false);
  const {
    places: { placesList, activeRoute },
    user: { userLocation },
  } = useReduxState();
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
          zoom: 21,
          pitch: 84,
        },
        { duration: 500 }
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

  return (
    <>
      <CodeModal
        setVisible={setPriorityModal}
        visible={priorityModal}
        onSelectPriority={(code) => {
          setPriorityModal(false);
          socketContext.socketStartTrip(placePressed!, code, userLocation!);
          centerNavigation();
        }}
      />
      <Box flex={1}>
        <S.Map
          showsTraffic
          pitchEnabled
          showsMyLocationButton
          followsUserLocation={true}
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
          {!!activeRoute && <PathBuilder path={activeRoute} />}
        </S.Map>
        <Box position="absolute" height="100%" width="100%" justifyContent="flex-end">
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
              top="6%"
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
                onCardPress={() => {}}
                zoomTo={zoomTo}
              />
            </Row>
          )}
          {showDetails && placePressed && <PlaceDetails onStart={() => setPriorityModal(true)} />}
        </Box>
        <MapBottomModal onCardPress={(place) => handleCardPress(place)} onSearch={handleOnSearch} />
      </Box>
    </>
  );
};

export default Map;
