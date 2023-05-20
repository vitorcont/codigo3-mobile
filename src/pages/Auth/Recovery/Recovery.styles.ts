import { winHeight } from '@mobile/services/dimensions';
import theme from '@mobile/theme';
import React from 'react';
import styled from 'styled-components/native';

export const ScrollWrapper = styled.ScrollView`
  width: 100%;
  height: 100%;
`;

export const InformationWrapper = styled.View`
  padding-horizontal: 5%;
  padding-top: 8%;
  width: 100%;
  margin-top: ${winHeight * 0.2}px;
  background-color: ${theme.colors.white};
  min-height: ${winHeight * 0.85}px;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
`;
