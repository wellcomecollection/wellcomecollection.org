import styled from 'styled-components';

import { camelToKebab } from '@weco/common/utils/grammar';

const SpacingComponent = styled.div.attrs<{ $sliceType?: string }>(props => ({
  'data-slice-type': props.$sliceType,
  className: props.$sliceType
    ? `slice-type-${camelToKebab(props.$sliceType)}`
    : undefined,
}))`
  & + &,
  &:empty {
    margin-top: ${props => props.theme.getSpaceValue('md', 'zero')};

    ${props =>
      props.theme.media('sm')(`
        margin-top: ${props.theme.getSpaceValue('md', 'sm')};
      `)}

    ${props =>
      props.theme.media('md')(`
        margin-top: ${props.theme.getSpaceValue('md', 'md')};
      `)}
  }

  &.slice-type-text + &.slice-type-text {
    /* The SpacingComponent spaces adjacent components vertically by an amount
    of pixels. Elements within a single block of .spaced-text are spaced
    vertically by an amount of ems. In Prismic, it is possible to create a new
    component for each paragraph of text (instead of keeping it all in the same
    block). This means that text elements could have slightly different amounts
    of vertical spacing depending on how the content has been added. To account
    for this, we check if the two adjacent SpacingComponents contain
    .spaced-text, and if so, override the SpacingComponent spacing in favour of
    the .spaced-text spacing.
    */
    margin-top: 0;

    .spaced-text > *:first-child {
      margin-top: ${props => props.theme.spacedTextTopMargin};
    }
  }

  & + &.slice-type-text {
    /* If there's a SpacingComponent (of any type) followed by a specific .slice-type-text
    SpacingComponent, and the latter has an h2 as its first child, we clear the space (which
    would otherwise grow too large added to the margin on the top of the h2)  */
    &:has(h2:first-child) {
      margin-top: 0;
    }
  }

  &.slice-type-text-and-image + &.slice-type-text-and-image,
  &.slice-type-text-and-icons + &.slice-type-text-and-icons,
  &.slice-type-text-and-image + &.slice-type-text-and-icons,
  &.slice-type-text-and-icons + &.slice-type-text-and-image {
    margin-top: 0;
  }
`;

export default SpacingComponent;
