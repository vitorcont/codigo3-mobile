import { winHeight } from '@mobile/services/dimensions';
import theme from '@mobile/theme';
import React from 'react';
import styled from 'styled-components/native';

export const ScrollWrapper = styled.ScrollView`
  width: 100%;
  height: 100%;
`;

export const InformationWrapper = styled.View`
  width: 100%;
  margin-top: ${winHeight * 0.5}px;
  background-color: ${theme.colors.white};
  min-height: ${winHeight * 0.55}px;
  align-items: center;
  flex: 1;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
`;

export const Visibutton = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  align-items: center;
  justify-content: center;
`;
