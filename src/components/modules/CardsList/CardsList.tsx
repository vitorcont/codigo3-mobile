import { PureModal, Col, Box, StyledText, StatusCard, Button } from '@mobile/components';
import { PureModalProps } from '@mobile/components/elements/PureModal/PureModal';
import { RiskStatusEnum } from '@mobile/enum/status';
import { useReduxState } from '@mobile/hooks/useReduxState';
import { calculateDistance } from '@mobile/services/location';
import theme from '@mobile/theme';
import React, { useCallback, useRef } from 'react';
import { Dimensions, FlatList, ViewToken } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as S from './CardsList.style';
import { LocationObjectCoords } from 'expo-location';

export interface CardsListProps {
  data: models.PlaceFound[];
  onCardPress: (place: models.PlaceFound) => void;
  zoomTo?: (coords: LocationObjectCoords) => void;
}

const CardsList = (props: CardsListProps) => {
  const {
    places: { placesList },
    user: { userLocation },
  } = useReduxState();
  const onViewableItemsChanged = useCallback(
    (props: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      console.log(props.changed);
    },
    []
  );

  return (
    <FlatList
      data={props.data}
      horizontal
      snapToAlignment="center"
      decelerationRate={'fast'}
      snapToInterval={Dimensions.get('window').width * 0.925}
      // onViewableItemsChanged={onViewableItemsChanged}
      contentContainerStyle={{
        paddingHorizontal: Dimensions.get('window').width * 0.025,
      }}
      onScroll={(event) => {
        const index = Math.round(
          event.nativeEvent.contentOffset.x / (Dimensions.get('window').width * 0.9)
        );
        const location = {
          ...props.data[index],
          latitude: props.data[index].center[1],
          longitude: props.data[index].center[0],
          accuracy: null,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        };
        props.zoomTo && props.zoomTo(location);
      }}
      renderItem={({ item }) => (
        <Box
          width={Dimensions.get('window').width * 0.9 + 'px'}
          marginHorizontal={Dimensions.get('window').width * 0.01 + 'px'}
          marginBottom={'10%'}>
          <S.PlaceCard activeOpacity={0.75} onPress={() => props.onCardPress(item)}>
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
                  value={item.text}
                  fontSize={18}
                  fontFamily={theme.fonts.semiBold}
                  color={theme.colors.placeText}
                />
                {!!item.place_name && (
                  <StyledText
                    value={
                      item.place_name.includes(`${item.text}, `)
                        ? item.place_name.split(`${item.text}, `)[1]
                        : item.place_name
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
                    item.center[1],
                    item.center[0]
                  ).toFixed(1)} KM`}
                  fontSize={18}
                  textAlign="center"
                  color={theme.colors.placeText}
                />
              </Box>
            </Box>
          </S.PlaceCard>
        </Box>
      )}
    />
  );
};

export default CardsList;
