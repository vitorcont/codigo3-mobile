import { Row, Box, StyledText } from '@mobile/components/elements';
import { getDistanceFromPoints, isPointInsideRoute, maskDistance } from '@mobile/services/location';
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
  const { socket } = useContext(SocketContext)!;

  const {
    places: { activeRoute },
    loading,
  } = useReduxState();
  const dispatch = useDispatch();
  const [endTrip, setEndTrip] = useState(false);
  const [currentStep, setCurrentStep] = useState<mapbox.Steps | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const allGeometry = useMemo(() => {
    const steps = activeRoute?.routes[0].legs[0].steps!;
    const allGeometry = steps
      .map((step, stepIndex) => {
        return step.geometry.coordinates.map((coord) => coord.concat(stepIndex));
      })
      .flat(1);

    return allGeometry;
  }, [activeRoute]);

  const stepDistance = useMemo(() => {
    for (let i = 0; i < allGeometry.length - 1; i++) {
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
      let cycleStepIndex = allGeometry[i][2];
      if (isInsidePath) {
        let distance = 0;
        for (let j = i; allGeometry[j + 1][2] === cycleStepIndex; j++) {
          if (j === i) {
            distance =
              distance +
              getDistanceFromPoints(
                { ...userLocation! },
                {
                  latitude: allGeometry[j][1],
                  longitude: allGeometry[j][0],
                }
              );
          } else {
            distance =
              distance +
              getDistanceFromPoints(
                {
                  latitude: allGeometry[j][1],
                  longitude: allGeometry[j][0],
                },
                {
                  latitude: allGeometry[j + 1][1],
                  longitude: allGeometry[j + 1][0],
                }
              );
          }
        }

        return distance;
      }
    }
    return 0;
  }, [currentStep, userLocation]);

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

    for (let i = 0; i < allGeometry.length - 1; i++) {
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
      let cycleStepIndex = allGeometry[i][2];
      if (cycleStepIndex !== activeRoute?.routes[0].legs[0].steps.length) {
        cycleStepIndex = allGeometry[i][2] + 1;
      }
      if (isInsidePath && cycleStepIndex !== stepIndex) {
        console.log(allGeometry[i][2] + ' ' + isInsidePath);
        const step = activeRoute?.routes[0].legs[0].steps[cycleStepIndex]!;
        setStepIndex(cycleStepIndex);
        setCurrentStep(step);
        break;
      }
      if (allGeometry.length - 2 === i && stepIndex === 0) {
        const step = activeRoute?.routes[0].legs[0].steps[0]!;
        setCurrentStep(step);
        break;
      } else if (allGeometry.length - 2 === i) {
        dispatch(startLoading());
        socket!.emit('reloadPath');
      }
    }
  };

  useEffect(() => {
    if (loading === 0) {
      detectInsideRoute();
    }
  }, [userLocation]);

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
                    value={`${stepDistance > 0 ? maskDistance(stepDistance) : ''}`}
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
