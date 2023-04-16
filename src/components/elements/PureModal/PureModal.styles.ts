import styled from 'styled-components/native';
import theme from '@mobile/theme';
import Window from '@mobile/services/dimensions';

export const Blur = styled.View`
  position: absolute;
  z-index: 100;
  background-color: #000;
  opacity: 0.6;
  width: 100%;
  height: 100%;
`;

export const Overlay = styled.View`
  flex: 1;
  justify-content: center;
  padding: ${Window.widthScale(0.06)}px;
`;

export const Container = styled.View`
  overflow: hidden;
  background-color: ${theme.colors.secundary};
  border-radius: ${Window.widthScale(0.05)}px;
`;
