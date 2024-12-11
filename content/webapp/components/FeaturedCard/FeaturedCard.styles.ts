import styled from 'styled-components';

import { font, grid } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';

export const DateWrapper = styled(Space).attrs({
  className: font('intr', 4),
  $v: { size: 'm', properties: ['margin-bottom'] },
})`
  margin: 0;
  padding: 0;
`;

export const FeaturedCardWrap = styled.div`
  margin-left: -${props => props.theme.gutter.small}px;
  margin-right: -${props => props.theme.gutter.small}px;

  ${props => props.theme.media('medium')`
    margin-left: 0;
    margin-right: 0;
  `}
`;

type HasIsReversed = { $isReversed: boolean };
export const FeaturedCardLink = styled.a.attrs({
  className: 'grid',
  'data-gtm-trigger': 'featured_card_link',
})<HasIsReversed>`
  justify-content: flex-end;
  flex-direction: ${props => (props.$isReversed ? 'row-reverse' : 'row')};

  &,
  &:link,
  &:visited {
    text-decoration: none;
    border: none;
  }
`;

export const FeaturedCardLeft = styled.div.attrs({
  className: grid({ s: 12, m: 12, l: 7, xl: 7 }),
})``;

export const FeaturedCardRight = styled.div<HasIsReversed>`
  display: flex;
  flex-direction: column;
  padding-left: ${props =>
    props.$isReversed ? 0 : props.theme.gutter.small}px;
  padding-right: ${props =>
    props.$isReversed ? props.theme.gutter.small : 0}px;
  transform: translateY(-28px); /* Height of a label (font size + padding) */
  width: 100%;
  height: 100%;
  min-height: 200px;

  ${props => props.theme.media('medium')`
    padding-left: 0;
    padding-right: 0;
  `}

  ${props =>
    props.theme.media('large')(`
      margin-left: ${props.$isReversed ? 0 : -props.theme.gutter.large + 'px'};
      transform: translateY(0);
    `)}
`;

export const FeaturedCardCopy = styled(Space).attrs({
  $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})<{ $textColor: PaletteColor; $background: PaletteColor }>`
  flex: 1;
  color: ${props => props.theme.color(props.$textColor)};
  background-color: ${props => props.theme.color(props.$background)};

  ${props =>
    props.theme.media('large')(`
      margin-right: -${props.theme.gutter.large}px;
    `)}
`;

export const FeaturedCardShim = styled.div.attrs<{ $background: PaletteColor }>(
  {
    className: `is-hidden-s is-hidden-m ${grid({ s: 12, m: 11, l: 5, xl: 5 })}`,
  }
)<HasIsReversed & { $background: PaletteColor }>`
  position: relative;
  background-color: ${props => props.theme.color(props.$background)};
  height: 21px;

  /* Prevent a white line appearing above the shim because of browser rounding errors */
  top: -1px;
  margin-left: ${props =>
    props.$isReversed ? props.theme.gutter.large + 'px' : null};
`;
