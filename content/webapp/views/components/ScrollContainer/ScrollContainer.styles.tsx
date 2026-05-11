import styled from 'styled-components';

import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';

export const ScrollButtonsContainer = styled(Space)<{
  $hasContent?: boolean;
  $scrollButtonsAfter?: boolean;
}>`
  gap: ${props => props.theme.spacingUnits['100']};
  display: flex;
  justify-content: ${props =>
    props.$hasContent ? 'space-between' : 'flex-end'};
  align-items: flex-end;
  ${props =>
    props.$scrollButtonsAfter
      ? 'margin-top: ' + props.theme.spacingUnits['150'] + ';'
      : ''}
`;

export const ContentContainer = styled(PlainList)`
  display: flex;
  overflow: hidden;
  position: relative;
  padding: 3px 0;

  li:first-child {
    padding-left: 0;
  }

  &:has(.scroll-shim) {
    li:nth-child(2) {
      padding-left: 0;
    }
  }
`;

export const ListItem = styled.li<{
  $usesShim?: boolean;
  $cols?: 3 | 4;
}>`
  --gutter-size: ${props => props.theme.gutter.small};
  flex: 0 0 auto;
  width: 400px;
  max-width: 90vw;
  padding-left: var(--gutter-size);

  ${props =>
    props.$usesShim
      ? `
      &:nth-child(2) {
        width: calc(400px - var(--gutter-size));
        max-width: calc(90vw - var(--gutter-size));
      }
      `
      : `
      &:first-child {
        width: calc(400px - var(--gutter-size));
        max-width: calc(90vw - var(--gutter-size));
      }
      `}

  &:last-child {
    width: calc(400px + var(--gutter-size));
    max-width: calc(90vw + var(--gutter-size));
    padding-right: var(--gutter-size);
  }

  ${props => {
    const smGutter = props.theme.gutter.medium;
    const paddingCalc = `${props.theme.containerPaddingVw} * 2`;

    return props.theme.media('sm')(`
      --gutter-size: ${smGutter};
      /* 6 columns of 12 at sm breakpoint */
      /* Formula: ((100vw - padding) - (11 × gutter)) / 12 × 6 + (6 × gutter) */
      /* Simplified: calc((100vw - (${paddingCalc}) - (${smGutter} * 11)) / 2 + (${smGutter} * 6)) */
      width: calc((100vw - (${paddingCalc}) - (${smGutter} * 11)) / 2 + (${smGutter} * 6));

      padding: 0 0 0 var(--gutter-size);

      ${
        props.$usesShim
          ? `
          &:nth-child(2) {
            width: calc((100vw - (${paddingCalc}) - (${smGutter} * 11)) / 2 + (${smGutter} * 5));
          }`
          : `
          &:first-child {
            padding-left: 0;
            width: calc((100vw - (${paddingCalc}) - (${smGutter} * 11)) / 2 + (${smGutter} * 5));
          } `
      }
      &:last-child {
        padding-right: var(--gutter-size);
        width: calc((100vw - (${paddingCalc}) - (${smGutter} * 11)) / 2 + (${smGutter} * 7));
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
    const divisor = is3col ? '4' : '3';
    const cols = is3col ? '3' : '4';

    return props.theme.media('md')(`
      --gutter-size: ${mdGutter};
      /* ${cols} columns of 12 at md breakpoint */
      width: calc((100vw - (${paddingCalc}) - (${mdGutter} * 11)) / ${divisor} + (${mdGutter} * ${cols}));
      max-width: calc(((${lg} - (${paddingCalc})) - (${mdGutter} * 11)) / 12 * ${cols} + (${mdGutter} * ${cols}));

      ${
        props.$usesShim
          ? `
          &:nth-child(2) {
            width: calc((100vw - (${paddingCalc}) - (${mdGutter} * 11)) / ${divisor} + (${mdGutter} * ${is3col ? '2' : '3'}));
            max-width: calc(((${lg} - (${paddingCalc})) - (${mdGutter} * 11)) / 12 * ${cols} + (${mdGutter} * ${is3col ? '2' : '3'}));
          }`
          : `
          &:first-child {
            width: calc((100vw - (${paddingCalc}) - (${mdGutter} * 11)) / ${divisor} + (${mdGutter} * ${is3col ? '2' : '3'}));
            max-width: calc(((${lg} - (${paddingCalc})) - (${mdGutter} * 11)) / 12 * ${cols} + (${mdGutter} * ${is3col ? '2' : '3'}));
          }`
      }

      &:last-child {
        padding-right: var(--gutter-size);
        width: calc((100vw - (${paddingCalc}) - (${mdGutter} * 11)) / ${divisor} + (${mdGutter} * ${is3col ? '4' : '5'}));
        max-width: calc(((${lg} - (${paddingCalc})) - (${mdGutter} * 11)) / 12 * ${cols} + (${mdGutter} * ${is3col ? '4' : '5'}));
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
