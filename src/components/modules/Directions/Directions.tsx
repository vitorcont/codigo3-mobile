import { Row, Box, StyledText } from '@mobile/components/elements';
import { getDistanceFromPoints, isPointInsideRoute } from '@mobile/services/location';
import theme from '@mobile/theme';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as S from './styles';
import { useReduxState } from '@mobile/hooks/useReduxState';
import { LocationContext } from '@mobile/context/LocationContext';
import { useDispatch } from 'react-redux';
import EndTripModal from '../EndTripModal/EndTripModal';

interface IDirections {
  onEndTrip: () => void;
}

const Directions = (props: IDirections) => {
  const { userLocation } = useContext(LocationContext)!;
  const {
    places: { activeRoute },
  } = useReduxState();
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

  const defineStep = () => {
    const steps = activeRoute?.routes[0].legs[0].steps!;
    const path = activeRoute?.routes[0].geometry.coordinates!;
    let indexInside = -1;

    for (let i = 0; i < steps!.length! - 1; i++) {
      const isInside = isPointInsideRoute(
        {
          latitude: userLocation?.latitude!,
          longitude: userLocation?.longitude!,
        },
        {
          latitude: path[i][1],
          longitude: path[i][0],
        },
        {
          latitude: path[i + 1][1],
          longitude: path[i + 1][0],
        }
      );
      console.log('Is Inside', isInside);
      if (isInside) {
        indexInside = i + 1;
        console.log('Is Inside IF', indexInside);
        break;
      }
    }
    console.log('BF Point Validation', indexInside);

    if (indexInside === -1) {
      let shortestPoint = 999999;
      for (let i = 0; i < steps!.length!; i++) {
        const distance = getDistanceFromPoints(
          {
            latitude: path[i][1],
            longitude: path[i][0],
          },
          { ...userLocation! }
        );

        console.log('BF If Shortest', distance, shortestPoint, i);
        if (distance > shortestPoint) {
          if (i === 1) {
            indexInside = i;
          } else {
            indexInside = i - 1;
          }
          break;
        } else {
          console.log('Else Shortest', distance);
          shortestPoint = distance;
        }
      }
    }

    const step = steps[indexInside];

    setCurrentStep(step);
  };

  const midRoute = () => {
    const steps = activeRoute?.routes[0].legs[0].steps!;
    const path = activeRoute?.routes[0].geometry.coordinates!;
    let indexInside = stepIndex;
    for (let i = stepIndex; i < steps!.length - 1!; i++) {
      console.log('========== CICLO NOVO');
      console.log('stepIndex: ', stepIndex);
      console.log('i: ', i);

      const distanceUserToA = getDistanceFromPoints(
        {
          latitude: path[i][1],
          longitude: path[i][0],
        },
        { ...userLocation! }
      );

      const distanceUserToB = getDistanceFromPoints(
        {
          latitude: path[i + 1][1],
          longitude: path[i + 1][0],
        },
        { ...userLocation! }
      );

      const distanceBetween = getDistanceFromPoints(
        {
          latitude: path[i][1],
          longitude: path[i][0],
        },
        {
          latitude: path[i + 1][1],
          longitude: path[i + 1][0],
        }
      );

      console.log('distanceUserToA: ', distanceUserToA);
      console.log('distanceUserToB: ', distanceUserToB);
      console.log('distanceBetween: ', distanceBetween);

      if (stepIndex === 0) {
        console.log('>> IF stepIndex === 0');
        if (distanceUserToB > distanceBetween) {
          console.log('>> IF: distanceUserToB > distanceBetween: esta na rota 0');
          indexInside = 0;
        } else if (distanceBetween > distanceUserToA && distanceBetween > distanceUserToB) {
          console.log(
            '>> IF:distanceBetween > distanceUserToA && distanceBetween > distanceUserToB: esta dentro do meio da 1a rota'
          );
          indexInside = 1;
        }

        break;
      } else {
        console.log('>> ELSE: navegação normal');
        const distanceBetweenOld = getDistanceFromPoints(
          {
            latitude: path[i][1],
            longitude: path[i][0],
          },
          {
            latitude: path[i - 1][1],
            longitude: path[i - 1][0],
          }
        );
        if (distanceUserToA > distanceBetweenOld && i + 1 === stepIndex + 1) {
          console.log(
            '>> IF: distanceBetween < distanceUserToA && i + 1 === stepIndex + 1 :proximo passo'
          );
          indexInside = i + 1;
        }
        break;
      }
    }

    const step = steps[indexInside];
    setStepIndex(indexInside);
    setCurrentStep(step);
  };

  const detectInsideRoute = () => {
    console.log('====== NEW CYCLE');
    for (let i = 0; i < allGeometry.length - 1; i++) {
      console.log('Step: ', allGeometry[i][2]);
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
      const cycleStepIndex = allGeometry[i][2];

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
      }
    }
  };

  useEffect(() => {
    // defineStep();
    // midRoute();
    detectInsideRoute();
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
                    value={`300m`}
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
