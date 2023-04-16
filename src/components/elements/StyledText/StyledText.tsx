import React from 'react';
import { Text } from 'react-native';
import * as S from './StyledText.style';

export interface StyledTextProps {
  value: string;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  textAlign?: string;
}

const StyledText = (props: StyledTextProps) => {
  return <S.Text {...props}>{props.value}</S.Text>;
};

export default StyledText;
