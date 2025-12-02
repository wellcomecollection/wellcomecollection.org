import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

export const StyledTasl = styled.div.attrs({
  className: `${font('lr', -2)} plain-text tasl`, // Need the tasl class as it's used with ImageGallery styled components
})<{ $positionAtTop: boolean; $isEnhanced: boolean }>`
  text-align: right;
  top: ${props => (props.$positionAtTop ? 0 : 'auto')};
  bottom: ${props => (props.$positionAtTop ? 'auto' : 0)};
  left: 0;
  right: 0;
  z-index: 2;
  position: ${props => (props.$isEnhanced ? 'absolute' : 'static')};
`;

type TaslButtonProps = {
  $positionAtTop: boolean;
};

export const TaslButton = styled.button<TaslButtonProps>`
  position: absolute;
  right: 0;
  top: ${props => (props.$positionAtTop ? '2px' : 'auto')};
  bottom: ${props => (props.$positionAtTop ? 'auto' : '2px')};
`;

type TaslIconProps = {
  $isEnhanced: boolean;
};
export const TaslIcon = styled.span<TaslIconProps>`
  align-items: center;
  justify-content: center;
  background: rgb(29, 29, 29, 0.61);
  color: ${props => props.theme.color('white')};
  width: ${props => `${props.theme.iconDimension}px`};
  height: ${props => `${props.theme.iconDimension}px`};
  border-radius: 50%;
  display: ${props => (props.$isEnhanced ? 'flex' : 'inline')};
`;

export const InfoContainer = styled(Space).attrs({
  $v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 's', properties: ['padding-left'] },
})`
  color: ${props => props.theme.color('white')};
  background-color: ${props => props.theme.color('black')};
  padding-right: 36px;
`;
