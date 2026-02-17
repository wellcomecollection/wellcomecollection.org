import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';

export const MobileNavBackground = styled(Space).attrs({
  className: 'is-hidden-l is-hidden-xl',
  $v: { size: 'md', properties: ['height'] },
})<{ $isOnWhite: boolean }>`
  display: block;
  background-color: ${props =>
    props.theme.color(props.$isOnWhite ? 'white' : 'neutral.700')};
`;

export const FromCollectionsHeading = styled.h2.attrs({
  className: font('brand-bold', 2),
})<{ $color: PaletteColor }>`
  color: ${props => props.theme.color(props.$color)};
  margin-bottom: 0;
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
  max-width: ${props => props.theme.sizes.lg};
  display: grid;
  justify-items: start;

  div:has(form) {
    min-width: 250px;
  }

  grid-template-columns: 1fr auto;

  ${props =>
    props.theme.media('sm')(`
    div:has(form) {
      min-width: 350px;
    }
  `)}

  ${props =>
    props.theme.media('md')(`
    div:has(form) {
      min-width: 450px;
    }
  `)}
`;
