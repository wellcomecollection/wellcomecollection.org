import styled from 'styled-components';

import {
  compactControlDimensions,
  controlDimensions,
} from '@weco/content/views/pages/works/work/work.helpers';

import { getVerticalGuidePosition, TreeItemProps } from './NestedList.helpers';

export type TreeItemStyledProps = TreeItemProps & {
  $isDarkMode?: boolean;
  $listItem?: boolean;
};

export const TreeItem = styled.li.attrs<TreeItemStyledProps>(props => ({
  className: props.$showGuideline ? 'guideline' : '',
}))<TreeItemStyledProps>`
  position: relative;

  &.guideline::before,
  &.guideline::after {
    content: '';
    position: absolute;
    z-index: 2;
  }

  &.guideline::before {
    border-left: 1px solid
      ${props =>
        props.$isDarkMode
          ? props.theme.color('neutral.600')
          : props.theme.color('yellow')};
    width: 0;
    top: ${props => getVerticalGuidePosition(props.$isCompact)}px;
    left: ${props =>
      (props.$isCompact
        ? compactControlDimensions.controlSize
        : controlDimensions.controlWidth) / 2}px;
    height: calc(
      100% -
        ${props =>
          getVerticalGuidePosition(props.$isCompact) +
          (props.$isCompact
            ? compactControlDimensions.controlSize
            : controlDimensions.controlHeight) /
            2}px
    );
  }

  &.guideline::after {
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props =>
      props.$isDarkMode
        ? props.theme.color('neutral.600')
        : props.theme.color('yellow')};
    left: ${props =>
      (props.$isCompact
        ? compactControlDimensions.controlSize
        : controlDimensions.controlWidth) /
        2 -
      3}px;
    bottom: ${props =>
      (props.$isCompact
        ? compactControlDimensions.controlSize
        : controlDimensions.controlHeight) / 2}px;
  }
`;

export type TreeControlStyledProps = {
  $highlightCondition?: string;
  $controlBackground?: string;
  $controlBorder?: string;
  $isDarkMode?: boolean;
  $isCompact?: boolean;
};

export const TreeControl = styled.span<TreeControlStyledProps>`
  display: inline-block;
  cursor: pointer;
  height: ${props =>
    props.$isCompact
      ? compactControlDimensions.controlSize
      : controlDimensions.controlHeight}px;
  width: ${props =>
    props.$isCompact
      ? compactControlDimensions.controlSize
      : controlDimensions.controlWidth}px;
  min-width: ${props =>
    props.$isCompact
      ? compactControlDimensions.controlSize
      : controlDimensions.controlWidth}px;
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    height: ${controlDimensions.circleHeight}px;
    width: ${controlDimensions.circleWidth}px;
    top: calc(
      (
          ${props =>
            props.$isCompact
              ? compactControlDimensions.controlSize
              : controlDimensions.controlHeight}px -
            ${controlDimensions.circleHeight}px
        ) /
        2
    );
    left: calc(
      (
          ${props =>
            props.$isCompact
              ? compactControlDimensions.controlSize
              : controlDimensions.controlWidth}px -
            ${controlDimensions.circleWidth}px
        ) /
        2
    );
    background: ${props =>
      props.$controlBackground ||
      (props.$isDarkMode
        ? props.theme.color('neutral.600')
        : props.theme.color(
            props.$highlightCondition === 'primary'
              ? 'yellow'
              : props.$highlightCondition === 'secondary'
                ? 'lightYellow'
                : 'neutral.300'
          ))};
    border: ${props =>
      props.$controlBorder ||
      (props.$isDarkMode
        ? `2px solid ${props.theme.color('neutral.700')}`
        : props.$highlightCondition === 'secondary'
          ? `1px solid ${props.theme.color('yellow')}`
          : `2px solid ${props.theme.color('white')}`)};
    border-radius: 50%;
  }

  .icon {
    position: absolute;
    z-index: 1;
    top: ${props =>
      ((props.$isCompact
        ? compactControlDimensions.controlSize
        : controlDimensions.controlHeight) -
        (props.$isCompact ? compactControlDimensions.iconSize : 24)) /
      2}px;
    left: ${props =>
      ((props.$isCompact
        ? compactControlDimensions.controlSize
        : controlDimensions.controlWidth) -
        (props.$isCompact ? compactControlDimensions.iconSize : 24)) /
      2}px;
    color: ${props =>
      props.$isDarkMode ? props.theme.color('white') : 'inherit'};
  }
`;
