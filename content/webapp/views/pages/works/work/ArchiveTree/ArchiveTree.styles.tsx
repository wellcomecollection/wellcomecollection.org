import NextLink from 'next/link';
import styled from 'styled-components';

import Space from '@weco/common/views/components/styled/Space';
import { controlDimensions } from '@weco/content/views/pages/works/work/work.helpers';

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
