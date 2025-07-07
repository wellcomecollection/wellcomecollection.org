import styled from 'styled-components';

import Space from '@weco/common/views/components/styled/Space';
import { controlDimensions } from '@weco/content/views/works/work/work.helpers';

import { TreeItemProps, verticalGuidePosition } from './ArchiveTree.helpers';

export const TreeContainer = styled.div`
  border-right: 1px solid ${props => props.theme.color('warmNeutral.400')};
`;

export const ButtonWrap = styled(Space).attrs({
  $v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
})`
  button {
    width: 100%;
    justify-content: center;
  }
`;

export const TreeItem = styled.li.attrs<TreeItemProps>(props => ({
  className: props.$showGuideline ? 'guideline' : '',
}))<TreeItemProps>`
  position: relative;
  list-style: ${props => (props.$isEnhanced ? 'none' : 'disc')};

  &.guideline::before,
  &.guideline::after {
    content: '';
    position: absolute;
    z-index: 2;
  }

  &.guideline::before {
    border-left: 1px solid ${props => props.theme.color('yellow')};
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
    background: ${props => props.theme.color('yellow')};
    left: ${controlDimensions.controlWidth / 2 - 3}px;
    bottom: ${controlDimensions.controlHeight / 2}px;
  }
`;

export const TreeControl = styled.span<{ $highlightCondition?: string }>`
  display: inline-block;
  cursor: pointer;
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

    /* centre the circle in the control */
    top: ${(controlDimensions.controlHeight - controlDimensions.circleHeight) /
    2}px;
    left: ${(controlDimensions.controlWidth - controlDimensions.circleWidth) /
    2}px;

    background: ${props =>
      props.theme.color(
        props.$highlightCondition === 'primary'
          ? 'yellow'
          : props.$highlightCondition === 'secondary'
            ? 'lightYellow'
            : 'neutral.300'
      )};
    border: ${props =>
      props.$highlightCondition === 'secondary'
        ? `1px solid ${props.theme.color('yellow')}`
        : `2px solid ${props.theme.color('white')}`};
    border-radius: 50%;
  }

  .icon {
    position: absolute;
    z-index: 1;

    /* centre the icon in the control
       icons have a height and width of 24px */
    top: ${(controlDimensions.controlHeight - 24) / 2}px;
    left: ${(controlDimensions.controlWidth - 24) / 2}px;
  }
`;

type StyledLinkProps = {
  $isCurrent?: boolean;
  $hasControl?: boolean;
  'data-gtm-trigger': 'tree_link';
  'data-gtm-data-tree-level': number;
};

export const StyledLink = styled.a<StyledLinkProps>`
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
