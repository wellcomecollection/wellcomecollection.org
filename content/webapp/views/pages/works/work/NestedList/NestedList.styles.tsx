import styled, { css } from 'styled-components';

import { getControlDimensions } from '@weco/content/views/pages/works/work/work.helpers';

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

  ${props => {
    const { controlWidth, controlHeight } = getControlDimensions(
      props.$isCompact
    );
    const guidelinePosition = getVerticalGuidePosition(props.$isCompact);
    const guidelineColor = props.$isDarkMode
      ? props.theme.color('neutral.600')
      : props.theme.color('yellow');

    return css`
      &.guideline::before {
        border-left: 1px solid ${guidelineColor};
        width: 0;
        top: ${guidelinePosition}px;
        left: ${controlWidth / 2}px;
        height: calc(100% - ${guidelinePosition + controlHeight / 2}px);
      }

      &.guideline::after {
        display: block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: ${guidelineColor};
        left: ${controlWidth / 2 - 3}px;
        bottom: ${controlHeight / 2}px;
      }
    `;
  }}
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
  position: relative;
  z-index: 1;

  ${props => {
    const { controlWidth, controlHeight, circleWidth, circleHeight, iconSize } =
      getControlDimensions(props.$isCompact);

    return css`
      height: ${controlHeight}px;
      width: ${controlWidth}px;
      min-width: ${controlWidth}px;

      &::before {
        content: '';
        position: absolute;
        height: ${circleHeight}px;
        width: ${circleWidth}px;
        top: calc((${controlHeight}px - ${circleHeight}px) / 2);
        left: calc((${controlWidth}px - ${circleWidth}px) / 2);
      }

      .icon {
        top: ${(controlHeight - iconSize) / 2}px;
        left: ${(controlWidth - iconSize) / 2}px;
      }
    `;
  }}

  &::before {
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
    color: ${props =>
      props.$isDarkMode ? props.theme.color('white') : 'inherit'};
  }
`;
