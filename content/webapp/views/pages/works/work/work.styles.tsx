import styled from 'styled-components';

import { treeInstructions } from '@weco/common/data/microcopy';

import { controlDimensions } from './work.helpers';

export const TreeInstructions = styled.p.attrs({
  'aria-hidden': 'true',
  id: 'tree-instructions',
})`
  display: none;
`;

export const Tree = styled.div<{
  $isEnhanced?: boolean;
  $showFirstLevelGuideline?: boolean;
  $maxWidth?: number;
}>`
  ul {
    position: relative;
    padding-left: 0;
    margin: 0;
    width: 100%;

    ${props =>
      props.theme.media('sm')(`
      width: ${props.$maxWidth ? `${props.$maxWidth}px` : '100%'}
    `)}

    &::before {
      display: none;
      position: absolute;
      content: ${props => (props.$isEnhanced ? `'${treeInstructions}'` : null)};
      z-index: 2;
      top: 0;
      background: ${props => props.theme.color('yellow')};
      padding: ${props => `${props.theme.spacingUnit * 2}px`};
      margin: ${props => `${props.theme.spacingUnit}px`};
      border-radius: ${props => `${props.theme.borderRadiusUnit}px`};
      max-width: 600px;
    }

    &:focus::before {
      display: block;
    }

    ul {
      content: '';
      width: auto;
      padding-left: ${props =>
        props.$showFirstLevelGuideline
          ? `${controlDimensions.controlWidth}px`
          : 0};
    }
  }

  ul ul ul {
    padding-left: ${controlDimensions.controlWidth}px;
  }
`;
