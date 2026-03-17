import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';

export const PageGrid = styled(Grid)`
  background: ${props => props.theme.color('white')};
  row-gap: 0;
`;

export const Title = styled(Space).attrs({
  className: font('sans-bold', 2),
  as: 'h2',
  $v: { size: 'md', properties: ['margin-bottom'] },
})<{
  $hasDarkBackground?: boolean;
}>`
  color: ${props =>
    props.$hasDarkBackground ? props.theme.color('white') : 'inherit'};
`;

export const DarkSectionWrapper = styled(Space).attrs({
  $v: { size: 'lg', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('neutral.700')};
`;

export const StretchWrapper = styled.section<{ $hasDarkBackground?: boolean }>`
  ${props => props.theme.pageGridOffset('margin-right')};

  ${props =>
    props.$hasDarkBackground &&
    `
    &::before {
      content: '';
      position: absolute;
      width: calc(100vw - 100%);
      top: 0;
      background: ${props.theme.color('neutral.700')};
      bottom: 0;
      right: 100%;
      z-index: 0;
    }
  `}
`;

export const ThemeCardsListSection = styled(StretchWrapper)`
  /* Enough space to clear the sticky header 
  This is usually applied to h2 (in typography.ts
  But we don't have one here. */

  scroll-margin-top: 3rem;

  @media (min-width: ${props => props.theme.sizes.md}) {
    /* Align the top of the heading with the top of the side navigation */
    scroll-margin-top: ${props => props.theme.getSpaceValue('md', 'md')};
  }

  ${Container} {
    padding-left: 0;
  }
`;
