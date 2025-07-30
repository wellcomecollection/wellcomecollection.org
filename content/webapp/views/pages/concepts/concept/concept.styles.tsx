import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor, themeValues } from '@weco/common/views/themes/config';

export const MobileNavBackground = styled(Space).attrs({
  className: 'is-hidden-l is-hidden-xl',
  $v: { size: 'l', properties: ['height'] },
})<{ $isOnWhite: boolean }>`
  display: block;
  background-color: ${props =>
    props.theme.color(props.$isOnWhite ? 'white' : 'neutral.700')};
`;

export const FromCollectionsHeading = styled.h2.attrs({
  className: font('wb', 2),
})<{ $color: PaletteColor }>`
  color: ${props => props.theme.color(props.$color)};
  margin-bottom: 0;
`;

export const NavGridCell = styled(GridCell)<{
  $isEnhanced: boolean;
  $isOnWhite: boolean;
}>`
  --nav-grid-cell-background-color: ${props =>
    props.theme.color(props.$isOnWhite ? 'white' : 'neutral.700')};
  position: ${props => (props.$isEnhanced ? 'sticky' : 'relative')};
  top: 0;
  transition: background-color ${props => props.theme.transitionProperties};
  background-color: var(--nav-grid-cell-background-color);
  z-index: 3;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: ${themeValues.containerPadding.small}px;
    bottom: 0;
    top: 0;
    transition: background-color ${props => props.theme.transitionProperties};
    background-color: var(--nav-grid-cell-background-color);
  }

  &::before {
    right: 100%;
  }

  &::after {
    left: 100%;
  }

  ${props =>
    props.theme.media('medium')(`
      &::before,
      &::after {
        width: ${themeValues.containerPadding.medium}px;
      }
  `)}

  ${props => props.theme.media('large')`
    position: unset;
    background-color: unset;
    transition: unset;
    mix-blend-mode: difference;

    &::before,
    &::after {
      transition: unset;
      display: none;
    }
  `}
`;

export const StretchWrapper = styled.div`
  ${props => props.theme.pageGridOffset('margin-right')};

  &::before {
    content: '';
    position: absolute;
    width: calc(100vw - 100%);
    top: 0;
    background: ${props => props.theme.color('neutral.700')};
    bottom: 0;
    right: 100%;
    z-index: 0;
  }
`;

export const HotJarPlaceholder = styled.div`
  margin: -2rem auto 2rem;
  width: 100%;
  max-width: ${themeValues.sizes.xlarge}px;
  display: grid;
  justify-items: start;

  div:has(form) {
    min-width: 250px;
  }

  grid-template-columns: 1fr auto;

  ${themeValues.media('medium')(`
    div:has(form) {
      min-width: 350px;
    }
  `)}

  ${themeValues.media('large')(`
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

  /* The class is necessary because the image modals styles get overwritten otherwise */
  .sectionTitle {
    color: ${props => props.theme.color('white')};
  }
`;

export const ConceptWorksHeader = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-top'] },
})<{ $hasWorksTabs: boolean }>`
  background-color: ${({ $hasWorksTabs, theme }) =>
    theme.color($hasWorksTabs ? 'warmNeutral.300' : 'white')};
`;
