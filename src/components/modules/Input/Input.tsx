import Box, { IBoxProps } from '@mobile/components/elements/Box/Box';
import theme from '@mobile/theme';
import React from 'react';
import { StyleProp, TextInput, TextInputProps, View, ViewProps, ViewStyle } from 'react-native';
import { onChange } from 'react-native-reanimated';

import * as S from './Box.styles';

export interface IInputProps {
  boxProps: IBoxProps;
  inputProps: TextInputProps;
}

const Input = (props: IInputProps) => {
  return (
    <Box
      {...props.boxProps}
      backgroundColor={theme.colors.inputBackground}
      borderColor={theme.colors.inputBorder}
      borderRadius="18px"
      borderWidth="1px"
      pdVertical="10px"
      pdHorizontal="15px">
      <TextInput {...props.inputProps} placeholderTextColor={theme.colors.placeholder} />
    </Box>
  );
};

export default Input;
