import styled from 'styled-components';

import { typography } from '@weco/common/utils/classnames';

export const ViewerButton = styled.button.attrs({
  className: typography('body', 'md', 'strong'),
})<{ $isDark?: boolean }>`
  line-height: 1.5;
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  text-decoration: none;
  text-align: center;
  white-space: nowrap;
  padding: 6px 12px;
  position: relative;
  display: flex;
  align-items: center;

  &:not([disabled]):hover {
    cursor: pointer;
  }

  &[disabled],
  &.disabled {
    background: ${props => props.theme.color('neutral.600')};
    border-color: ${props => props.theme.color('neutral.600')};
    cursor: not-allowed;
  }

  &.disabled {
    pointer-events: none;
  }

  .icon {
    display: inline-block;
    vertical-align: middle;
  }

  overflow: hidden;

  ${props =>
    props.$isDark &&
    `
    border: 2px solid transparent;
    color: ${props.theme.color('white')};
    background: transparent;

    &:not([disabled]):hover {
      border: 2px solid ${props.theme.color('white')};
    }
  `}

  ${props =>
    !props.$isDark &&
    `
    background: ${props.theme.color('white')};
    color: ${props.theme.color('accent.green')};
    border: 1px solid ${props.theme.color('accent.green')};

    &:not([disabled]):hover {
      background: ${props.theme.color('accent.green')};
      color: ${props.theme.color('white')};
    }
  `}
`;
