import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

type PopupDialogOpenProps = {
  $shouldStartAnimation: boolean;
  $isActive: boolean;
};
export const PopupDialogOpen = styled(Space).attrs<PopupDialogOpenProps>(
  props => ({
    'aria-hidden': props.$isActive ? 'true' : 'false',
    'aria-controls': 'user-initiated-dialog-window',
    as: 'button',
    $v: {
      size: 'm',
      properties: ['padding-top', 'padding-bottom'],
      overrides: { small: 4, medium: 4, large: 4 },
    },
    $h: {
      size: 'm',
      properties: ['padding-left', 'padding-right'],
      overrides: { small: 5, medium: 5, large: 5 },
    },
    className: font('intb', 5),
  })
)<PopupDialogOpenProps>`
  line-height: 1;
  display: inline-flex;
  align-items: center;
  color: ${props => props.theme.color('accent.purple')};
  position: fixed;
  transform: ${props =>
    props.$isActive || !props.$shouldStartAnimation
      ? 'translateY(10px)'
      : 'translateY(0)'};
  bottom: 20px;
  left: 20px;
  z-index: 3;
  background: ${props => props.theme.color('white')};
  opacity: ${props =>
    props.$isActive || !props.$shouldStartAnimation ? 0 : 1};
  transition:
    opacity 500ms ease,
    filter 500ms ease,
    transform 500ms ease;
  transition-delay: ${props => (props.$isActive ? '0ms' : '500ms')};
  border-radius: 9999px;
  box-shadow: 0 4px 8px 0 rgb(0, 0, 0, 0.3);

  &:hover {
    border: 0;
    color: ${props => props.theme.color('white')};
    background: ${props => props.theme.color('accent.purple')};

    .icon__shape {
      fill: ${props => props.theme.color('white')};
    }
  }
`;

export const PopupDialogWindow = styled(Space).attrs({
  'aria-modal': true,
  id: 'user-initiated-dialog-window',
  $v: {
    size: 'l',
    properties: ['padding-top', 'padding-bottom'],
    overrides: { small: 6, medium: 6, large: 6 },
  },
  $h: {
    size: 'l',
    properties: ['padding-left', 'padding-right'],
    overrides: { small: 6, medium: 6, large: 6 },
  },
})<{ $isActive: boolean }>`
  background-color: ${props => props.theme.color('white')};
  color: ${props => props.theme.color('accent.purple')};
  border-radius: 20px 0;
  box-shadow: 0 2px 60px 0 rgb(0, 0, 0, 0.7);
  opacity: ${props => (props.$isActive ? 1 : 0)};
  pointer-events: ${props => (props.$isActive ? 'all' : 'none')};
  transform: ${props =>
    props.$isActive ? 'translateY(0)' : 'translateY(10px)'};
  transition:
    opacity 500ms ease,
    transform 500ms ease;
  transition-delay: ${props => (props.$isActive ? '500ms' : '0ms')};
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  max-width: 370px;
  z-index: 3;
`;

export const PopupDialogClose = styled.button`
  margin: 0 !important;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  top: 10px;
  right: 10px;
`;

export const PopupDialogCTA = styled(Space).attrs({
  as: 'a',
  $v: {
    size: 'm',
    properties: ['padding-top', 'padding-bottom'],
    overrides: { small: 3, medium: 3, large: 3 },
  },
  $h: {
    size: 'm',
    properties: ['padding-left', 'padding-right'],
    overrides: { small: 5, medium: 5, large: 5 },
  },
  className: font('intb', 5, { small: 3, medium: 3 }),
})`
  display: inline-block;
  background-color: ${props => props.theme.color('accent.purple')};
  color: ${props => props.theme.color('white')};
  transition: all 500ms ease;
  border: 2px solid transparent;
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  text-decoration: none;

  &:hover {
    color: ${props => props.theme.color('accent.purple')};
    border-color: ${props => props.theme.color('accent.purple')};
    background: ${props => props.theme.color('white')};
  }
`;
