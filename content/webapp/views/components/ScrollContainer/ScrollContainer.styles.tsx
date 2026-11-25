import styled, { css } from 'styled-components';

import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';

export const ScrollButtonsContainer = styled(Space)<{
  $hasContent?: boolean;
  $scrollButtonsAfter?: boolean;
}>`
  gap: ${props => props.theme.spacingUnits['300']};
  display: flex;
  justify-content: ${props =>
    props.$hasContent ? 'space-between' : 'flex-end'};
  align-items: flex-end;
  ${props =>
    props.$scrollButtonsAfter &&
    css`
      margin-top: ${props.theme.spacingUnits['150']};
    `}
`;

export const ContentContainer = styled(PlainList)<{
  $hasWorkCards?: boolean;
}>`
  align-items: ${props => (props.$hasWorkCards ? 'baseline' : 'normal')};
  display: flex;
  overflow: hidden;
  position: relative;
  padding: ${props => (props.$hasWorkCards ? '25px 0 3px' : '3px 0')};

  li:first-child {
    padding-left: 0;
  }

  &:has(.scroll-shim) {
    li:nth-child(2) {
      padding-left: 0;
    }
  }
`;

/** The item that gets the reduced "leading" width: the second one when a scroll shim takes the first slot. */
const leadingItem = (usesShim?: boolean) =>
  usesShim ? '&:nth-child(2)' : '&:first-child';

type ItemSizeBase = { gutter: string; paddingCalc: string };

/**
 * `width` for an item taking `1 / divisor` of the space left once the page padding and the
 * 11 gaps between 12 columns are taken out, plus the `gutters` gutters it spans.
 */
const itemWidth = ({
  gutter,
  paddingCalc,
  divisor,
  gutters,
}: ItemSizeBase & { divisor: number; gutters: number }) =>
  `calc((100vw - (${paddingCalc}) - (${gutter} * 11)) / ${divisor} + (${gutter} * ${gutters}))`;

/** `max-width` for an item spanning `cols` of 12 columns plus `gutters` gutters, capped at the `lg` container. */
const itemMaxWidth = ({
  gutter,
  paddingCalc,
  lg,
  cols,
  gutters,
}: ItemSizeBase & { lg: string; cols: number; gutters: number }) =>
  `calc((${lg} - (${paddingCalc}) - (${gutter} * 11)) / 12 * ${cols} + (${gutter} * ${gutters}))`;

export const ListItem = styled.li<{
  $usesShim?: boolean;
  $cols?: 3 | 4;
}>`
  --gutter-size: ${props => props.theme.gutter.small};
  flex: 0 0 auto;
  width: 400px;
  max-width: 90vw;
  padding-left: var(--gutter-size);

  ${props => leadingItem(props.$usesShim)} {
    width: calc(400px - var(--gutter-size));
    max-width: calc(90vw - var(--gutter-size));
  }

  &:last-child {
    width: calc(400px + var(--gutter-size));
    max-width: calc(90vw + var(--gutter-size));
    padding-right: var(--gutter-size);
  }

  ${props => {
    const smGutter = props.theme.gutter.medium;
    const paddingCalc = `${props.theme.containerPaddingVw} * 2`;
    const base = { gutter: smGutter, paddingCalc };

    return props.theme.media('sm')(`
      --gutter-size: ${smGutter};
      /* 6 columns of 12 at sm breakpoint */
      /* Formula: ((100vw - padding) - (11 × gutter)) / 12 × 6 + (6 × gutter) */
      /* Simplified: calc((100vw - (${paddingCalc}) - (${smGutter} * 11)) / 2 + (${smGutter} * 6)) */
      width: ${itemWidth({ ...base, divisor: 2, gutters: 6 })};

      padding: 0 0 0 var(--gutter-size);

      ${leadingItem(props.$usesShim)} {
        ${props.$usesShim ? '' : 'padding-left: 0;'}
        width: ${itemWidth({ ...base, divisor: 2, gutters: 5 })};
      }
      &:last-child {
        padding-right: var(--gutter-size);
        width: ${itemWidth({ ...base, divisor: 2, gutters: 7 })};
      }
    `);
  }}

  ${props => {
    const mdGutter = props.theme.gutter.large;
    const lg = props.theme.sizes.lg;
    const paddingCalc = `${props.theme.containerPaddingVw} * 2`;
    const is3col = props.$cols === 3;

    // 4col: (totalWidth - 11 × gutter) / 3 + N × gutter
    // 3col: (totalWidth - 11 × gutter) / 4 + N × gutter
    const divisor = is3col ? 4 : 3;
    const cols = is3col ? 3 : 4;
    const leadingGutters = is3col ? 2 : 3;
    const lastGutters = is3col ? 4 : 5;
    const base = { gutter: mdGutter, paddingCalc };
    const sizes = (gutters: number) => `
      width: ${itemWidth({ ...base, divisor, gutters })};
      max-width: ${itemMaxWidth({ ...base, lg, cols, gutters })};
    `;

    return props.theme.media('md')(`
      --gutter-size: ${mdGutter};
      /* ${cols} columns of 12 at md breakpoint */
      ${sizes(cols)}

      ${leadingItem(props.$usesShim)} {
        ${sizes(leadingGutters)}
      }

      &:last-child {
        padding-right: var(--gutter-size);
        ${sizes(lastGutters)}
      }
    `);
  }}
`;

export const ScrollShim = styled.li.attrs({
  className: 'scroll-shim',
})<{ $gridValues: number[] }>`
  --container-padding: ${props => props.theme.containerPadding};
  --number-of-columns: ${props => (12 - props.$gridValues[0]) / 2};
  --gap-value: ${props => props.theme.gutter.small};
  --container-width: calc(100% - (var(--container-padding) * 2));
  --container-width-without-gaps: calc(
    (var(--container-width) - (var(--gap-value) * 11))
  );
  min-width: calc(
    var(--container-padding) +
      (
        var(--number-of-columns) *
          ((var(--container-width-without-gaps) / 12) + var(--gap-value))
      )
  );

  ${props =>
    props.theme.media('sm')(`
      --number-of-columns: ${(12 - props.$gridValues[1]) / 2};
      --gap-value: ${props.theme.gutter.medium};
  `)}

  ${props =>
    props.theme.media('md')(`
      --number-of-columns: ${(12 - props.$gridValues[2]) / 2};
      --gap-value: ${props.theme.gutter.large};
  `)}

  ${props =>
    props.theme.media('lg')(`
      --container-width: calc(${props.theme.sizes.lg} - (var(--container-padding) * 2));
      --left-margin-width: calc((100% - ${props.theme.sizes.lg}) / 2);
      --number-of-columns: ${(12 - props.$gridValues[3]) / 2};
      --gap-value: ${props.theme.gutter.xlarge};

      min-width: calc(
        var(--left-margin-width) + var(--container-padding) +
          (
            var(--number-of-columns) *
              ((var(--container-width-without-gaps) / 12) + var(--gap-value))
          )
      );
  `)}
`;

export const CopyContainer = styled.div`
  :last-child {
    margin-bottom: 0;
  }
`;
