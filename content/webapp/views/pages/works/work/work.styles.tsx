import styled from 'styled-components';

import { treeInstructions } from '@weco/common/data/microcopy';
import Space from '@weco/common/views/components/styled/Space';

import { controlDimensions } from './work.helpers';

export const TreeInstructions = styled.p.attrs({
  'aria-hidden': 'true',
  id: 'tree-instructions',
})`
  display: none;
`;

export const TreeHeadings = styled(Space)<{ $isDarkMode?: boolean }>`
  ${props =>
    !props.$isDarkMode &&
    `background: ${props.theme.color('warmNeutral.300')};`}
`;

export const TreeContainer = styled.div<{ $isDarkMode?: boolean }>`
  ${props =>
    !props.$isDarkMode &&
    `
    background: linear-gradient(
      to bottom,
      ${props.theme.color('warmNeutral.200')},
      ${props.theme.color('warmNeutral.200')} 50%,
      ${props.theme.color('white')} 50%,
      ${props.theme.color('white')}
    );
    background-size: 100% ${controlDimensions.controlHeight * 2}px;
  `}
`;

export const Tree = styled.div<{
  $isEnhanced?: boolean;
  $showFirstLevelGuideline?: boolean;
  $maxWidth?: number;
  $isDarkMode?: boolean;
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
      background: ${props =>
        props.$isDarkMode
          ? props.theme.color('neutral.600')
          : props.theme.color('yellow')};
      padding: ${props => `${props.theme.spacingUnit * 2}px`};
      margin: ${props => `${props.theme.spacingUnit}px`};
      border-radius: ${props => `${props.theme.borderRadiusUnit}px`};
      max-width: 600px;
    }

    &:focus::before {
      display: block;
    }

    li {
      list-style: none;
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
