import NextLink from 'next/link';
import styled from 'styled-components';

import Space from '@weco/common/views/components/styled/Space';
import { controlDimensions } from '@weco/content/views/pages/works/work/work.helpers';

import { TreeItemProps, verticalGuidePosition } from './ArchiveTree.helpers';

export type TreeItemStyledProps = TreeItemProps & {
  $darkMode?: boolean;
  $listItem?: boolean;
};

export const TreeContainer = styled.div`
  border-right: 1px solid ${props => props.theme.color('warmNeutral.400')};
`;

export const ButtonWrap = styled(Space).attrs({
  $v: { size: 'sm', properties: ['padding-top', 'padding-bottom'] },
})`
  button {
    width: 100%;
    justify-content: center;
  }
`;

export const TreeItem = styled.li.attrs<TreeItemStyledProps>(props => ({
  className: props.$showGuideline ? 'guideline' : '',
}))<TreeItemStyledProps>`
  position: relative;
  list-style: ${props => (props.$isEnhanced ? 'none' : 'disc')};

  &.guideline::before,
  &.guideline::after {
    content: '';
    position: absolute;
    z-index: 2;
  }

  &.guideline::before {
    border-left: 1px solid
      ${props =>
        props.$darkMode
          ? props.theme.color('neutral.600')
          : props.theme.color('yellow')};
    width: 0;
    top: ${verticalGuidePosition}px;
    left: ${controlDimensions.controlWidth / 2}px;
    height: calc(
      100% - ${verticalGuidePosition + controlDimensions.controlHeight / 2}px
    );
  }

  &.guideline::after {
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props =>
      props.$darkMode
        ? props.theme.color('neutral.600')
        : props.theme.color('yellow')};
    left: ${controlDimensions.controlWidth / 2 - 3}px;
    bottom: ${controlDimensions.controlHeight / 2}px;
  }
`;

export type TreeControlStyledProps = {
  $highlightCondition?: string;
  $flatMode?: boolean;
  $controlBackground?: string;
  $controlBorder?: string;
  $darkMode?: boolean;
};

export const TreeControl = styled.span<TreeControlStyledProps>`
  display: inline-block;
  cursor: ${props => (props.$flatMode ? 'default' : 'pointer')};
  height: ${controlDimensions.controlHeight}px;
  width: ${controlDimensions.controlWidth}px;
  min-width: ${controlDimensions.controlWidth}px;
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    height: ${controlDimensions.circleHeight}px;
    width: ${controlDimensions.circleWidth}px;
    top: calc(
      (
          ${controlDimensions.controlHeight}px -
            ${controlDimensions.circleHeight}px
        ) /
        2
    );
    left: calc(
      (
          ${controlDimensions.controlWidth}px -
            ${controlDimensions.circleWidth}px
        ) /
        2
    );
    background: ${props =>
      props.$controlBackground ||
      (props.$darkMode
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
      (props.$darkMode
        ? `2px solid ${props.theme.color('neutral.700')}`
        : props.$highlightCondition === 'secondary'
          ? `1px solid ${props.theme.color('yellow')}`
          : `2px solid ${props.theme.color('white')}`)};
    border-radius: 50%;
  }

  .icon {
    position: absolute;
    z-index: 1;
    top: ${(controlDimensions.controlHeight - 24) / 2}px;
    left: ${(controlDimensions.controlWidth - 24) / 2}px;
    color: ${props =>
      props.$darkMode ? props.theme.color('white') : 'inherit'};
  }
`;

type StyledLinkProps = {
  $isCurrent?: boolean;
  $hasControl?: boolean;
  'data-gtm-trigger': 'tree_link';
  'data-gtm-data-tree-level': number;
};

export const StyledLink = styled(NextLink)<StyledLinkProps>`
  display: inline-block;
  min-height: ${controlDimensions.controlHeight}px;
  line-height: 1;
  color: ${props => props.theme.color('black')};
  background: ${props =>
    props.$isCurrent ? props.theme.color('yellow') : 'transparent'};
  cursor: pointer;
  margin-left: ${props =>
    props.$hasControl
      ? `-${controlDimensions.controlWidth / 2}px`
      : `${controlDimensions.controlWidth / 2}px`};
  text-decoration: none;

  /* Keeping this readable */
  /* stylelint-disable declaration-block-no-redundant-longhand-properties */
  padding-top: ${props => `${props.theme.spacingUnit}px`};
  padding-bottom: ${props => `${props.theme.spacingUnit}px`};
  padding-left: ${props =>
    props.$hasControl
      ? `${controlDimensions.circleWidth / 2 + props.theme.spacingUnit}px`
      : props.$isCurrent
        ? `${props.theme.spacingUnit}px`
        : 0};
  padding-right: ${props => `${props.theme.spacingUnit * 2}px`};
  /* stylelint-enable declaration-block-no-redundant-longhand-properties */

  &:focus,
  &:hover {
    text-decoration: underline;
  }
`;
