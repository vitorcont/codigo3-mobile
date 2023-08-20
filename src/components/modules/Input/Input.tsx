import Box, { IBoxProps } from '@mobile/components/elements/Box/Box';
import theme from '@mobile/theme';
import React, { ReactNode } from 'react';
import { StyleProp, TextInput, TextInputProps } from 'react-native';

export interface IInputProps {
  boxProps: IBoxProps;
  inputProps: TextInputProps;
  EndAdornment?: ReactNode;
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
      flexDirection="row"
      justifyContent="space-between"
      pdHorizontal="15px">
      <TextInput
        {...props.inputProps}
        style={{ fontSize: 16, width: !!props.EndAdornment ? '90%' : '100%' }}
        placeholderTextColor={theme.colors.placeholder}
      />
      {props.EndAdornment}
    </Box>
  );
};

export default Input;
