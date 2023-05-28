import theme from '@mobile/theme';
import MapView from 'react-native-maps';
import React from 'react';
import styled from 'styled-components/native';

export const PlaceCard = styled.TouchableOpacity`
  width: 90%;
  border-radius: 16px;
  border-width: 1.5px;
  border-color: ${theme.colors.placeBorder};
  margin-top: 17px;
`;
