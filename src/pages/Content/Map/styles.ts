import MapView from 'react-native-maps';
import React from 'react';
import styled from 'styled-components/native';

export const Map = styled(MapView)`
  position: absolute;
  width: 100%;
  height: 100%;
`;

export const MapButton = styled.TouchableOpacity`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;
