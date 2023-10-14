import { Row, Box, StyledText } from '@mobile/components/elements';
import {
  getDistanceFromPoints,
  getUserDistanceToStep,
  isPointInsideRoute,
  maskDistance,
} from '@mobile/services/location';
import theme from '@mobile/theme';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as S from './styles';
import { useReduxState } from '@mobile/hooks/useReduxState';
import { LocationContext } from '@mobile/context/LocationContext';
import { useDispatch } from 'react-redux';
import EndTripModal from '../EndTripModal/EndTripModal';
import { SocketContext } from '@mobile/context/SocketContext';
import { startLoading } from '@mobile/store/Loading/action';

interface IDirections {
  onEndTrip: () => void;
}

const Directions = (props: IDirections) => {
  const { userLocation } = useContext(LocationContext)!;
  const { socketReloadPath } = useContext(SocketContext)!;

  const {
    places: { activeRoute },
    loading,
  } = useReduxState();
  const dispatch = useDispatch();
  const [endTrip, setEndTrip] = useState(false);
  const [currentStep, setCurrentStep] = useState<mapbox.Steps | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [distanceNext, setDistanceNext] = useState(0);
  const allGeometry = useMemo(() => {
    const steps = activeRoute?.routes[0].legs[0].steps!;
    const allGeometry = steps
      .map((step, stepIndex) => {
        return step.geometry.coordinates.map((coord) => coord.concat(stepIndex));
      })
      .flat(1);

    return allGeometry;
  }, [activeRoute]);

  const getIcon = () => {
    if (!currentStep || !currentStep.maneuver || !currentStep.maneuver.modifier) {
      return <MaterialCommunityIcons name="arrow-up" size={70} color="black" />;
    }
    if (currentStep?.maneuver.modifier.includes('right')) {
      return <MaterialCommunityIcons name="arrow-right-top" size={70} color="black" />;
    }
    if (currentStep?.maneuver.modifier.includes('left')) {
      return <MaterialCommunityIcons name="arrow-left-top" size={70} color="black" />;
    }
    return <MaterialCommunityIcons name="arrow-up" size={70} color="black" />;
  };

  const detectInsideRoute = () => {
    const endDistance = getDistanceFromPoints(
      { ...userLocation! },
      {
        latitude: allGeometry[allGeometry.length - 1][1],
        longitude: allGeometry[allGeometry.length - 1][0],
      }
    );
    if (endDistance < 0.05) {
      props.onEndTrip();
      return;
    }
    let userGeometryIndex = 0;
    let stepFound = -1;

    for (let i = 0; i < allGeometry.length - 1; i++) {
      console.log('----------------------');
      const isInsidePath = isPointInsideRoute(
        {
          ...userLocation!,
        },
        {
          latitude: allGeometry[i][1],
          longitude: allGeometry[i][0],
        },
        {
          latitude: allGeometry[i + 1][1],
          longitude: allGeometry[i + 1][0],
        }
      );

      console.log('Is Inside: ', isInsidePath);
      if (isInsidePath) {
        stepFound = allGeometry[i][2] + 1;
        userGeometryIndex = i + 1;

        const step = activeRoute?.routes[0].legs[0].steps[stepFound]!;
        setStepIndex(stepFound);
        setCurrentStep(step);
        break;
      } else if (i === 0) {
        const startDistance = getDistanceFromPoints(
          { ...userLocation! },
          {
            latitude: allGeometry[i][1],
            longitude: allGeometry[i][0],
          }
        );
        if (startDistance <= 0.1) {
          const step = activeRoute?.routes[0].legs[0].steps[1];
          setStepIndex(1);
          setCurrentStep(step!);
          userGeometryIndex = 1;
          stepFound = 1;
          break;
        } else {
          setStepIndex(0);
          setCurrentStep(null);
          setDistanceNext(0);
          socketReloadPath();
          break;
        }
      } else if (i === allGeometry.length - 1) {
        setStepIndex(0);
        setCurrentStep(null);
        setDistanceNext(0);
        socketReloadPath();
        break;
      }
    }

    console.log(userGeometryIndex, stepFound);

    if (userGeometryIndex > 0) {
      const distance = getUserDistanceToStep(
        { ...userLocation! },
        userGeometryIndex,
        stepFound,
        allGeometry
      );
      console.log('aqui', distance, stepFound);
      if (stepFound > stepIndex) {
        setDistanceNext(distance);
      } else if (distance < distanceNext) {
        setDistanceNext(distance);
      }
    }
  };

  useEffect(() => {
    console.log('Loading', loading);
    if (userLocation && loading < 1) {
      detectInsideRoute();
    }
  }, [userLocation, activeRoute]);

  return !currentStep ? (
    <></>
  ) : (
    <>
      <EndTripModal
        setVisible={setEndTrip}
        visible={endTrip}
        onAccept={() => {
          setEndTrip(false);
          props.onEndTrip();
        }}
      />
      <Row
        position="absolute"
        bottom="0px"
        justifyContent="space-between"
        alignSelf="center"
        alignItems="flex-end"
        zIndex={2}
        width="100%"
        flexDirection="column">
        <Box
          pdHorizontal="28px"
          borderRadius="10px"
          width="100%"
          shadowBox
          pdVertical="20px"
          pdBottom="30px"
          marginBottom="-15px"
          flexDirection="column"
          backgroundColor={theme.colors.white}>
          <Box flex={1} alignItems="center" flexDirection="row" justifyContent="space-between">
            <Box flexDirection="row">
              <Box flexDirection="column" alignItems="center">
                {getIcon()}
                <Box>
                  <StyledText
                    value={`${distanceNext > 0 ? maskDistance(distanceNext) : ''}`}
                    fontFamily={theme.fonts.semiBold}
                    fontSize={18}
                    color={theme.colors.placeText}
                  />
                </Box>
              </Box>
              <Box width="65%" marginLeft="20px" marginTop="1px">
                <StyledText
                  value={currentStep.maneuver.instruction}
                  color={theme.colors.placeText}
                  fontFamily={theme.fonts.bold}
                  fontSize={18}
                />
              </Box>
            </Box>
            <Box
              width="34px"
              height="34px"
              alignItems="center"
              alignSelf="flex-start"
              justifyContent="center"
              backgroundColor={theme.colors.primary}
              borderRadius="30px">
              <S.MapButton onPress={() => setEndTrip(true)}>
                <MaterialCommunityIcons name="close" size={26} color="white" />
              </S.MapButton>
            </Box>
          </Box>
        </Box>
      </Row>
    </>
  );
};

export default Directions;
