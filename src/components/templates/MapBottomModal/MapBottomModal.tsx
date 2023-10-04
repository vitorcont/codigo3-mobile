import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Box, RawBottomModal, StyledText } from '@mobile/components/elements';
import theme from '@mobile/theme';
import React, { forwardRef, useContext, useEffect, useRef, useState } from 'react';
import { Feather, MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Input } from '@mobile/components/modules';
import { useDispatch } from 'react-redux';
import { setBottomModal } from '@mobile/store/Modal/action';
import { useReduxState } from '@mobile/hooks/useReduxState';
import * as S from './MapBottomModal.style';
import Window from '@mobile/services/dimensions';
import { calculateDistance } from '@mobile/services/location';
import { searchPlace } from '@mobile/store/Places/action';
import { PlaceFound } from '@mobile/models/module';
import { FontAwesome } from '@expo/vector-icons';
import { SearchContext } from '@mobile/context/SearchContext';

export interface MapBottomModalProps {
  onCardPress: (place: PlaceFound) => void;
  onSearch: () => void;
}

const MapBottomModal = (props: MapBottomModalProps) => {
  const [blockSearch, setBlockSearch] = useState(false);
  const modalRef = useRef<BottomSheet | null>(null);
  const dispatch = useDispatch();
  const {
    places: { placesList },
    user: { userLocation },
    modal,
  } = useReduxState();
  const { searchText, setSearchText } = useContext(SearchContext)!;

  useEffect(() => {
    if (!blockSearch && userLocation) {
      setBlockSearch(true);
      setTimeout(() => {
        setBlockSearch(false);
        dispatch(searchPlace(searchText.length ? searchText : 'hospital', userLocation!));
      }, 1500);
    }
  }, [searchText]);

  useEffect(() => {
    if (!blockSearch && userLocation) {
      dispatch(searchPlace(searchText.length ? searchText : 'hospital', userLocation));
    }
  }, [blockSearch]);

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

  return (
    <RawBottomModal
      {...props}
      ref={modalRef}
      onChange={(index) => {
        if (index === 0) {
          dispatch(setBottomModal('close'));
        }
        if (index === 1) {
          dispatch(setBottomModal('open'));
        }
      }}
      style={{
        zIndex: 100,
        elevation: 10,
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
              setSearchText(value);
            },
            onFocus: () => {
              dispatch(setBottomModal('open'));
            },
          }}
          EndAdornment={
            <S.SearchButton onPress={() => props.onSearch()}>
              <FontAwesome name="search" size={18} color="white" />
            </S.SearchButton>
          }
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
              <S.PlaceCard onPress={() => props.onCardPress(place)}>
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
};

export default MapBottomModal;
