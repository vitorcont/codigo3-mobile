import Window from '@mobile/services/dimensions';
import theme from '@mobile/theme';
import { Animated } from 'react-native';
import styled from 'styled-components/native';

interface IProps {
  width?: string;
  borderRadius?: string;
  backgroundColor?: string;
}

export const TouchableTextButton = styled.TouchableOpacity`
  padding-vertical: 12px;
  padding-horizontal: 10px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  border-radius: ${({ borderRadius }: IProps) => borderRadius ?? '14px'};
  ${({ width }: IProps) => `width: ${width}`}
  background-color: ${({ backgroundColor }: IProps) => backgroundColor ?? theme.colors.primary};
`;

export const TouchableButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  border-radius: 26px;
  background-color: ${({ backgroundColor }: IProps) => backgroundColor ?? theme.colors.white};
`;
