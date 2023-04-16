import { StyledTextProps } from './StyledText';
import React from 'react';
import theme from '../../../theme';
import styled from 'styled-components/native';

interface IProps extends StyledTextProps {}

export const Text = styled.Text`
  font-size: ${(props: IProps) => props.fontSize ?? 16}px;
  font-family: ${(props: IProps) => props.fontFamily ?? theme.fonts.regular};
  color: ${(props: IProps) => props.color ?? theme.colors.white};
  ${(props: IProps) => props.textAlign && `text-align: ${props.textAlign}`};
`;
