import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';

export const MobileNavBackground = styled(Space).attrs({
  className: 'is-hidden-l is-hidden-xl',
  $v: { size: 'l', properties: ['height'] },
})<{ $isOnWhite: boolean }>`
  display: block;
  background-color: ${props =>
    props.theme.color(props.$isOnWhite ? 'white' : 'neutral.700')};
`;

export const FromCollectionsHeading = styled.h2.attrs({
  className: font('brand', 2),
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
    width: ${props =>
      props.theme.formatContainerPaddingVw(props.theme.containerPadding.small)};
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
        width: ${props.theme.formatContainerPaddingVw(props.theme.containerPadding.medium)};
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
  max-width: ${props => props.theme.sizes.xlarge}px;
  display: grid;
  justify-items: start;

  div:has(form) {
    min-width: 250px;
  }

  grid-template-columns: 1fr auto;

  ${props =>
    props.theme.media('medium')(`
    div:has(form) {
      min-width: 350px;
    }
  `)}

  ${props =>
    props.theme.media('large')(`
    div:has(form) {
      min-width: 450px;
    }
  `)}
`;
