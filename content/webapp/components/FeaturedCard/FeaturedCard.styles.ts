import styled from 'styled-components';

import { font, grid } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';

export const DateWrapper = styled(Space).attrs({
  className: font('intr', 4),
  $v: { size: 's', properties: ['margin-bottom'] },
})`
  padding: 0;
`;

export const FeaturedCardWrap = styled.div`
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
  gap: 0 !important;

  &,
  &:link,
  &:visited {
    text-decoration: none;
    border: none;
  }
`;

export const FeaturedCardLeft = styled.div.attrs({
  className: grid({ s: 12, m: 12, l: 7, xl: 7 }),
})<HasIsReversed>`
  order: ${props => (props.$isReversed ? 2 : 1)};
`;

export const FeaturedCardRight = styled.div`
  display: flex;
  flex-direction: column;
  transform: translateY(-28px); /* Height of a label (font size + padding) */
  width: 100%;
  height: 100%;
  min-height: 200px;
  position: relative;

  ${props => props.theme.media('medium')`
    padding-left: 0;
    padding-right: 0;
  `}

  ${props =>
    props.theme.media('large')(`
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
`;

export const FeaturedCardShim = styled.div.attrs<{ $background: PaletteColor }>(
  {
    className: `is-hidden-s is-hidden-m`,
  }
)<{ $background: PaletteColor }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.color(props.$background)};
  height: 21px;
`;

export const FeaturedCardLabelWrapper = styled.div<HasIsReversed>`
  display: flex;
  justify-content: ${props => (props.$isReversed ? 'flex-end' : 'flex-start')};
  margin-right: ${props =>
    props.$isReversed
      ? '-16px' // themeValues.spaceAtBreakpoints.large.m
      : undefined};
`;
