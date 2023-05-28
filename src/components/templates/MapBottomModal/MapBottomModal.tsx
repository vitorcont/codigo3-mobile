import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Box, RawBottomModal, StyledText } from '@mobile/components/elements';
import theme from '@mobile/theme';
import React, { forwardRef, useEffect, useState } from 'react';
import { Feather, MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Input } from '@mobile/components/modules';
import { useDispatch } from 'react-redux';
import { setBottomModal } from '@mobile/store/Modal/action';
import { useReduxState } from '@mobile/hooks/useReduxState';
import * as S from './MapBottomModal.style';
import Window from '@mobile/services/dimensions';
import { calculateDistance } from '@mobile/services/location';
import { LocationObjectCoords } from 'expo-location';
import { searchPlace } from '@mobile/store/Places/action';

export interface MapBottomModalProps {
  onCardPress: (lat: number, long: number) => void;
}

const MapBottomModal = forwardRef<BottomSheet, MapBottomModalProps>((props, ref) => {
  const [searchText, setSearchText] = useState('');
  const [blockSearch, setBlockSearch] = useState(false);
  const dispatch = useDispatch();
  const {
    places: { placesList },
    user: { userLocation },
  } = useReduxState();

  const onSearchText = (value: string) => {};

  useEffect(() => {
    if (!blockSearch) {
      setBlockSearch(true);
      setTimeout(() => {
        setBlockSearch(false);
        dispatch(searchPlace(searchText.length ? searchText : 'hospital', userLocation!));
      }, 1500);
    }
  }, [searchText]);

  useEffect(() => {
    if (!blockSearch) {
      dispatch(searchPlace(searchText.length ? searchText : 'hospital', userLocation!));
    }
  }, [blockSearch]);

  return (
    <RawBottomModal
      {...props}
      ref={ref}
      onChange={(index) => {
        dispatch(setBottomModal(index ? 'open' : 'close'));
      }}
      snapPoints={['14%', '85%']}>
      <Box width="100%" alignSelf="center" alignItems="center">
        <Input
          boxProps={{
            width: '90%',
            marginTop: '6%',
          }}
          inputProps={{
            placeholder: 'Pesquisar...',
            value: searchText,
            onChangeText: (value) => {
              onSearchText(value);
              setSearchText(value);
            },
            onFocus: () => {
              dispatch(setBottomModal('open'));
            },
          }}
        />
      </Box>
      <BottomSheetScrollView
        style={{
          width: '100%',
          marginTop: Window.heightScale(0.025),
        }}>
        <Box width="100%" pdBottom="10%">
          <Box alignItems="center">
            {placesList.features.map((place) => (
              <S.PlaceCard onPress={() => props.onCardPress(place.center[1], place.center[0])}>
                <Box flexDirection="row" pdVertical="18px" pdHorizontal="14px" alignItems="center">
                  <Box width="10%">
                    <FontAwesome5 name="map-marker-alt" size={32} color={theme.colors.primary} />
                  </Box>
                  <Box
                    width="72%"
                    flexDirection="column"
                    alignItems="flex-start"
                    justifyContent="center">
                    <StyledText
                      value={place.text}
                      fontSize={18}
                      fontFamily={theme.fonts.semiBold}
                      color={theme.colors.placeText}
                    />
                    {!!place.place_name && (
                      <StyledText
                        value={
                          place.place_name.includes(`${place.text}, `)
                            ? place.place_name.split(`${place.text}, `)[1]
                            : place.place_name
                        }
                        color={theme.colors.placeText}
                      />
                    )}
                  </Box>
                  <Box width="18%">
                    <StyledText
                      value={`${calculateDistance(
                        userLocation?.latitude!,
                        userLocation?.longitude!,
                        place.center[1],
                        place.center[0]
                      ).toFixed(1)} KM`}
                      fontSize={18}
                      textAlign="center"
                      color={theme.colors.placeText}
                    />
                  </Box>
                </Box>
              </S.PlaceCard>
            ))}
          </Box>
        </Box>
      </BottomSheetScrollView>
    </RawBottomModal>
  );
});

export default MapBottomModal;
