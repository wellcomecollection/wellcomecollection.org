import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';

export const DateWrapper = styled(Space).attrs({
  className: font('intr', 4),
  $v: { size: 's', properties: ['margin-bottom'] },
})`
  padding: 0;
`;

const shimHeight = '21px';

export const FeaturedCardWrap = styled.div`
  margin-left: -${props => props.theme.gutter.small}px;
  margin-right: -${props => props.theme.gutter.small}px;
  max-height: 400px;
  overflow: hidden;

  ${props => props.theme.media('medium')`
    margin-left: 0;
    margin-right: 0;
  `}

  ${props =>
    props.theme.media('large')(`
    padding-bottom: ${shimHeight};
  `)}
`;

type HasIsReversed = { $isReversed: boolean };
export const FeaturedCardLink = styled(Grid).attrs({
  $noGap: true,
  as: 'a',
  'data-gtm-trigger': 'featured_card_link',
})<HasIsReversed>`
  &,
  &:link,
  &:visited {
    text-decoration: none;
    border: none;
  }
`;

export const FeaturedCardLeft = styled(GridCell)<HasIsReversed>`
  ${props =>
    props.theme.media('large')(`
    order: ${props.$isReversed ? 2 : 1};
  `)}
`;

export const FeaturedCardRight = styled.div<HasIsReversed>`
  display: flex;
  flex-direction: column;
  transform: translateY(-28px); /* Height of a label (font size + padding) */
  width: 100%;
  height: 100%;
  min-height: 200px;
  position: relative;

  padding-left: ${props =>
    props.$isReversed ? 0 : props.theme.gutter.small}px;
  padding-right: ${props =>
    props.$isReversed ? props.theme.gutter.small : 0}px;

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
  height: ${shimHeight};
`;

export const FeaturedCardLabelWrap = styled.div<HasIsReversed>`
  display: flex;

  ${props =>
    props.theme.media('large')(`
      justify-content: ${props.$isReversed ? 'flex-end' : 'flex-start'};
      margin-right: ${props.$isReversed ? '-16px' : undefined};
  `)}
`;

export const FeaturedCardRightWrap = styled(GridCell)<HasIsReversed>`
  ${props =>
    props.theme.media('large')(`
    order: ${props.$isReversed ? 1 : 2};
  `)}
`;
