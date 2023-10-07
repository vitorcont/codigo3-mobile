import { Row, Box, StyledText, Button } from '@mobile/components/elements';
import { calculateDistance } from '@mobile/services/location';
import theme from '@mobile/theme';
import { LocationObjectCoords } from 'expo-location';
import React, { useContext } from 'react';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import * as S from './styles';
import { useReduxState } from '@mobile/hooks/useReduxState';
import { SearchContext } from '@mobile/context/SearchContext';
import { LocationContext } from '@mobile/context/LocationContext';

interface IPlaceDetails {
  onStart: () => void;
}

const PlaceDetails = ({ onStart }: IPlaceDetails) => {
  const { placePressed, handleClose } = useContext(SearchContext)!;
  const { userLocation } = useContext(LocationContext)!;

  return (
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
          <StyledText
            value={placePressed!.text}
            fontSize={18}
            fontFamily={theme.fonts.semiBold}
            color={theme.colors.placeText}
          />
          <Box
            width="34px"
            height="34px"
            alignItems="center"
            justifyContent="center"
            backgroundColor={theme.colors.primary}
            borderRadius="30px">
            <S.MapButton onPress={handleClose}>
              <MaterialCommunityIcons name="close" size={26} color="white" />
            </S.MapButton>
          </Box>
        </Box>
        <Box width="75%">
          <StyledText
            value={
              placePressed!.place_name.includes(`${placePressed!.text}, `)
                ? placePressed!.place_name.split(`${placePressed!.text}, `)[1]
                : placePressed!.place_name
            }
            color={theme.colors.placeText}
          />
        </Box>
        <Box flexDirection="row" flex={1} justifyContent="space-between" alignItems="center">
          <StyledText
            value={`${calculateDistance(
              userLocation?.latitude!,
              userLocation?.longitude!,
              placePressed!.center[1],
              placePressed!.center[0]
            ).toFixed(1)} KM`}
            fontFamily={theme.fonts.semiBold}
            fontSize={18}
            color={theme.colors.placeText}
          />
          <Button
            label="Iniciar"
            onPress={onStart}
            StartAdornment={<FontAwesome5 name="play" size={12} color="white" />}
          />
        </Box>
      </Box>
    </Row>
  );
};

export default PlaceDetails;
