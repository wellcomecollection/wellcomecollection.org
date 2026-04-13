import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';

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
    !props.$usesShim
      ? `
      &:first-child {
        padding-left: 0;
        width: calc(400px - var(--gutter-size));
        max-width: calc(90vw - var(--gutter-size));
      }
      `
      : ''}

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
            padding-left: 0;
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

export const Title = styled.h2.attrs<{
  $headingLevel: 2 | 3;
  $fontFamily: 'brand-bold' | 'sans-bold';
}>(props => ({
  className: font(props.$fontFamily, props.$headingLevel === 2 ? 2 : 1),
  as: props.$headingLevel === 2 ? 'h2' : 'h3',
}))<{ $hasDescriptionSibling: boolean }>`
  ${props =>
    props.$hasDescriptionSibling
      ? props.theme.makeSpacePropertyValues('xs', ['margin-bottom'])
      : 'margin-bottom: 0'};
`;

export const Description = styled.p`
  color: ${props => props.theme.color('black')};
  margin-bottom: 0;
`;
