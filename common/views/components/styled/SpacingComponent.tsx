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

  /* stylelint-disable no-descending-specificity */
  & + &.slice-type-text {
    &:has(h2:first-child) {
      margin-top: 0;
    }

    h2 {
      /* ≈ space.xl */
      margin-top: 2.43em;

      &:not(:last-child) {
        /*  ≈ space.md */
        margin-bottom: 1.22em;
      }
    }

    /* Visual stories have their own h2 styling that involves a border above */
    .content-type-visual-story & {
      &:has(h2:first-child) {
        margin-top: 1.5em;
        border-top: 1px solid ${props => props.theme.color('black')};
      }
    }
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

    .spaced-text > *:first-child:not(h2) {
      margin-top: ${props => props.theme.spacedTextTopMargin};
    }
  }

  &.slice-type-text-and-image + &.slice-type-text-and-image,
  &.slice-type-text-and-icons + &.slice-type-text-and-icons,
  &.slice-type-text-and-image + &.slice-type-text-and-icons,
  &.slice-type-text-and-icons + &.slice-type-text-and-image {
    margin-top: 0;
  }
  /* stylelint-enable no-descending-specificity */
`;

export default SpacingComponent;
