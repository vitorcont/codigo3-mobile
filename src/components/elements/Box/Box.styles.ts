import { IBoxProps } from './Box';
import styled from 'styled-components/native';

import Window from '@mobile/services/dimensions';
import theme from '@mobile/theme';

interface IProps extends IBoxProps {}

export const Box = styled.View`
  ${(props: IProps) => props.alignItems && `align-items: ${props.alignItems}`}
  ${(props: IProps) => props.overflow && `overflow: ${props.overflow}`}
  ${(props: IProps) => props.flex && `flex: ${props.flex}`}
  ${(props: IProps) => props.alignSelf && `align-self: ${props.alignSelf}`}
  ${(props: IProps) => props.justifyContent && `justify-content: ${props.justifyContent}`}
    ${(props: IProps) => props.flexDirection && `flex-direction: ${props.flexDirection}`}
    ${(props: IProps) => props.flexWrap && `flex-wrap: ${props.flexWrap}`}
    
  ${(props: IProps) => props.width && `width: ${props.width}`}
  ${(props: IProps) => props.height && `height: ${props.height}`}
  ${(props: IProps) => props.backgroundColor && `backgroundColor: ${props.backgroundColor}`}
  ${(props: IProps) => props.position && `position: ${props.position}`}

  ${(props: IProps) => props.pdHorizontal && `padding-horizontal: ${props.pdHorizontal}`}
  ${(props: IProps) => props.pdVertical && `padding-vertical: ${props.pdVertical}`}  
  ${(props: IProps) => props.pdLeft && `padding-left: ${props.pdLeft}`}
  ${(props: IProps) => props.pdRight && `padding-right: ${props.pdRight}`}
  ${(props: IProps) => props.pdTop && `padding-top: ${props.pdTop}`}
  ${(props: IProps) => props.pdBottom && `padding-bottom: ${props.pdBottom}`}

  ${(props: IProps) => props.marginHorizontal && `margin-horizontal: ${props.marginHorizontal}`}
  ${(props: IProps) => props.marginVertical && `margin-vertical: ${props.marginVertical}`}  
  ${(props: IProps) => props.marginLeft && `margin-left: ${props.marginLeft}`}
  ${(props: IProps) => props.marginRight && `margin-right: ${props.marginRight}`}
  ${(props: IProps) => props.marginTop && `margin-top: ${props.marginTop}`}
  ${(props: IProps) => props.marginBottom && `margin-bottom: ${props.marginBottom}`}
    
  ${(props: IProps) => props.borderColor && `border-color: ${props.borderColor}`}
  ${(props: IProps) => props.left && `left: ${props.left}`}
    ${(props: IProps) => props.right && `right: ${props.right}`}
    ${(props: IProps) => props.bottom && `bottom: ${props.bottom}`}
    ${(props: IProps) => props.top && `top: ${props.top}`}
  ${(props: IProps) => props.borderRadius && `border-radius: ${props.borderRadius}`}
  ${(props: IProps) => props.borderWidth && `border-width: ${props.borderWidth}`}


  ${(props: IProps) => props.shadowBox && `elevation: 5;`}
  ${(props: IProps) => props.shadowBox && `shadow-color: ${theme.colors.black};`}
  ${(props: IProps) => props.shadowBox && `shadow-offset: 0px 2px;`}
  ${(props: IProps) => props.shadowBox && 'shadow-opacity: 0.25;'}
  ${(props: IProps) => props.shadowBox && `shadow-radius: 3px;`}   
  ${(props: IProps) => props.zIndex && `z-index: ${props.zIndex}`}
`;
