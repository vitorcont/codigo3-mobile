import React, { useEffect, useRef } from 'react';

import * as S from './Button.styles';
import { Box, StyledText } from '@mobile/components';
import theme from '@mobile/theme';

interface IButtonProps {
  width?: string;
  borderRadius?: string;
  backgroundColor?: string;
  label?: string;
  onPress?: () => void;
  StartAdornment?: React.ReactNode;
}

const Button = (props: IButtonProps) => {
  return (
    <>
      {!props.label && !!props.StartAdornment && (
        <S.TouchableButton {...props}>
          <Box
            position="absolute"
            width="100%"
            alignItems="center"
            justifyContent="center"
            height="100%">
            {props.StartAdornment}
          </Box>
        </S.TouchableButton>
      )}
      {!!props.label && (
        <S.TouchableTextButton {...props} activeOpacity={0.7}>
          {!!props.StartAdornment && (
            <Box position={'absolute'} left={'10px'} overflow="visible">
              {props.StartAdornment}
            </Box>
          )}
          <Box
            pdLeft={!!props.StartAdornment ? '26px' : undefined}
            pdHorizontal={!props.StartAdornment ? '18px' : undefined}>
            <StyledText value={props.label ?? ''} fontFamily={theme.fonts.semiBold} />
          </Box>
        </S.TouchableTextButton>
      )}
    </>
  );
};

export default Button;
