import Box, { IBoxProps } from '@mobile/components/elements/Box/Box';
import theme from '@mobile/theme';
import React from 'react';
import { StyleProp, TextInput, TextInputProps, View, ViewProps, ViewStyle } from 'react-native';

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
      <TextInput
        {...props.inputProps}
        style={{ fontSize: 16 }}
        placeholderTextColor={theme.colors.placeholder}
      />
    </Box>
  );
};

export default Input;
