import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';

import * as S from './Box.styles';

export interface IBoxProps {
  children?: React.ReactNode;
  justifyContent?: string;
  alignItems?: string;
  alignSelf?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
  position?: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  marginVertical?: string;
  marginHorizontal?: string;
  pdTop?: string;
  pdBottom?: string;
  pdLeft?: string;
  pdRight?: string;
  pdVertical?: string;
  pdHorizontal?: string;
  left?: string;
  right?: string;
  bottom?: string;
  top?: string;
  borderRadius?: string;
  shadowBox?: boolean;
  shadowColor?: string;
  borderColor?: string;
  elevation?: number;
  borderWidth?: string;
  flexDirection?: string;
  flexWrap?: string;
  overflow?: string;
  zIndex?: number;
  ref?: React.Ref<View>;
  style?: StyleProp<ViewStyle>;
  flex?: number;
}

const Box = (props: IBoxProps) => <S.Box {...props}>{props.children}</S.Box>;

export default Box;
