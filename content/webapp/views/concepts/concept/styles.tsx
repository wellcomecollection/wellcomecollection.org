import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { themeValues } from '@weco/common/views/themes/config';

export const HotJarPlaceholder = styled.div`
  margin: -2rem auto 2rem;
  width: 100%;
  max-width: ${themeValues.sizes.xlarge}px;

  display: grid;
  justify-items: start;
  padding: 0 ${themeValues.containerPadding.small}px;

  div:has(form) {
    min-width: 250px;
  }

  grid-template-columns: 1fr auto;

  ${themeValues.media('medium')(`
    padding: 0 ${themeValues.containerPadding.medium}px;
    div:has(form) {
      min-width: 350px;
    }
  `)}

  ${themeValues.media('large')(`
    padding: 0 ${themeValues.containerPadding.large}px;
    div:has(form) {
      min-width: 450px;
    }
  `)}
`;

export const ConceptHero = styled(Space).attrs({
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('lightYellow')};
`;

export const HeroTitle = styled.h1.attrs({ className: font('intb', 1) })`
  margin-bottom: 1rem;
`;

export const TypeLabel = styled.span.attrs({ className: font('intb', 6) })`
  background-color: ${props => props.theme.color('warmNeutral.300')};
  padding: 5px;
`;

export const ConceptImages = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('black')};

  .sectionTitle {
    color: ${props => props.theme.color('white')};
  }
`;

export const ConceptWorksHeader = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-top'] },
})<{
  $hasWorksTabs: boolean;
}>`
  background-color: ${({ $hasWorksTabs, theme }) =>
    theme.color($hasWorksTabs ? 'warmNeutral.300' : 'white')};
`;
