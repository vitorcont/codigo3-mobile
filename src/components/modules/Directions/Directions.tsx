import { Row, Box, StyledText, Button } from '@mobile/components/elements';
import {
  calculateDistance,
  getCenterCoordinates,
  getDistanceFromPoints,
  isPointInsideRoute,
} from '@mobile/services/location';
import theme from '@mobile/theme';
import { LocationObjectCoords } from 'expo-location';
import React, { useContext, useEffect, useState } from 'react';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import * as S from './styles';
import { useReduxState } from '@mobile/hooks/useReduxState';
import { SearchContext } from '@mobile/context/SearchContext';
import { LocationContext } from '@mobile/context/LocationContext';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '@mobile/store/Loading/action';

interface IDirections {
  onEndTrip: () => void;
}

const Directions = (props: IDirections) => {
  const { userLocation } = useContext(LocationContext)!;
  const {
    places: { activeRoute },
    loading,
  } = useReduxState();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState<mapbox.Steps | null>(null);

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

  useEffect(() => {
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
        if (isInside) {
          indexInside = i + 1;
          break;
        }
      }

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

          if (distance > shortestPoint) {
            if (i === 1) {
              indexInside = i - 1;
            } else {
              indexInside = i;
            }
            break;
          } else {
            shortestPoint = distance;
          }
        }
      }

      const step = steps[indexInside];

      setCurrentStep(step);
    };

    defineStep();
  }, []);

  return !currentStep ? (
    <></>
  ) : (
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
            <S.MapButton onPress={props.onEndTrip}>
              <MaterialCommunityIcons name="close" size={26} color="white" />
            </S.MapButton>
          </Box>
        </Box>
      </Box>
    </Row>
  );
};

export default Directions;
