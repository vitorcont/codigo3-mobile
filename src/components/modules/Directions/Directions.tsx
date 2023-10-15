import { Row, Box, StyledText } from '@mobile/components/elements';
import {
  getDistanceFromPoints,
  getPointOffset,
  getUserDistanceToStep,
  isPointInsidePolygon,
  isPointInsideRoute,
  maskDistance,
  Point,
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
  const [tolerance, setTolerance] = useState(0);

  const allGeometry = useMemo(() => {
    const steps = activeRoute?.routes[0].legs[0].steps!;
    const allGeometry = steps
      .map((step, stepIndex) => {
        return step.geometry.coordinates.map((coord) => coord.concat(stepIndex));
      })
      .flat(1);

    return allGeometry;
  }, [activeRoute]);

  const allPolyline = useMemo(() => {
    const minusOffsetPile = [];
    const plusOffsetQueue: Point[] = [];
    for (let i = 0; i < allGeometry.length - 2; i++) {
      const pointA = {
        latitude: allGeometry[i][1],
        longitude: allGeometry[i][0],
      };
      const pointB = {
        latitude: allGeometry[i + 2][1],
        longitude: allGeometry[i + 2][0],
      };
      const dy = pointB.longitude - pointA.longitude;
      const dx = pointB.latitude - pointA.latitude;
      const pathAngle = Math.atan2(dy, dx);

      const pointAOffsets = getPointOffset(pointA, pathAngle);
      const pointBOffsets = getPointOffset(pointB, pathAngle);

      plusOffsetQueue.push(pointAOffsets.plusOffset);
      plusOffsetQueue.push(pointBOffsets.plusOffset);

      minusOffsetPile.push(pointAOffsets.minusOffset);
      minusOffsetPile.push(pointBOffsets.minusOffset);
    }
    const allOffsets = plusOffsetQueue.concat(minusOffsetPile.reverse());
    return allOffsets;
  }, [allGeometry]);

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

      console.log('Is Inside Geometries: ', isInsidePath);
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

  const detectInsideRouteUpdated = () => {
    console.log('==================== NEW POSITION');
    console.log('Tolerance: ', tolerance);
    const endDistance = getDistanceFromPoints(
      { ...userLocation! },
      {
        latitude: allGeometry[allGeometry.length - 1][1],
        longitude: allGeometry[allGeometry.length - 1][0],
      }
    );

    //Usuário a menos de 50m do final?
    if (endDistance < 0.05) {
      props.onEndTrip();
      return;

      //Erro de Tolerância > 8?
    } else if (tolerance > 8) {
      console.log('RELOAD PATH');
      setStepIndex(0);
      setCurrentStep(null);
      setDistanceNext(0);
      setTolerance(0);
      socketReloadPath();
      return;
    }

    const isPointInsidePoly = isPointInsidePolygon({ ...userLocation! }, allPolyline);
    let userGeometryIndex = 0;
    let stepFound = -1;

    console.log('Inside Polygon: ', isPointInsidePoly);
    //usuário está dentro do polygon de rota?
    if (isPointInsidePoly) {
      for (let i = 0; i < allGeometry.length - 1; i++) {
        console.log('------------------ new geo');
        const isInsideGeometry = isPointInsideRoute(
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

        console.log('Inside Geometries: ', isInsideGeometry);
        // Está dentro da geo[i] geo[i+1]?
        if (isInsideGeometry) {
          stepFound = allGeometry[i][2] + 1;
          userGeometryIndex = i + 1;

          const step = activeRoute?.routes[0].legs[0].steps[stepFound]!;
          setStepIndex(stepFound);
          setCurrentStep(step);
          setTolerance(0);
          break;

          //Está no ultimo?
        } else if (i === allGeometry.length - 1) {
          //Está na ultima geometria!
          setTolerance(tolerance + 1);
          break;
        }
      }

      console.log(userGeometryIndex, stepFound);
      // Cálculo de distância
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
    } else {
      //Usuário está fora do poly principal!
      const startDistance = getDistanceFromPoints(
        { ...userLocation! },
        {
          latitude: allGeometry[0][1],
          longitude: allGeometry[0][0],
        }
      );

      //Está a menos de 80m do inicio?
      if (startDistance < 0.08) {
        console.log('Near Start');
        const step = activeRoute?.routes[0].legs[0].steps[1];
        setStepIndex(1);
        setCurrentStep(step!);
        setTolerance(0);
        userGeometryIndex = 1;
        stepFound = 1;

        const distance = getUserDistanceToStep(
          { ...userLocation! },
          userGeometryIndex,
          stepFound,
          allGeometry
        );
        if (stepFound > stepIndex) {
          setDistanceNext(distance);
        } else if (distance < distanceNext) {
          setDistanceNext(distance);
        }
      } else {
        setTolerance(tolerance + 1);
      }
    }
  };

  useEffect(() => {
    if (userLocation) {
      detectInsideRouteUpdated();
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
