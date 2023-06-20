import styled from 'styled-components';
import { camelToKebab } from '@weco/common/utils/grammar';

const SpacingComponent = styled.div.attrs<{ sliceType?: string }>(props => ({
  className: props.sliceType
    ? `slice-type-${camelToKebab(props.sliceType)}`
    : undefined,
}))<{ sliceType?: string }>`
  & + &,
  &:empty {
    margin-top: ${props => props.theme.spaceAtBreakpoints.small.l}px;

    ${props =>
      props.theme.media('medium')(`
        margin-top: ${props.theme.spaceAtBreakpoints.medium.l}px;
      `)}

    ${props =>
      props.theme.media('large')(`
        margin-top: ${props.theme.spaceAtBreakpoints.large.l}px;
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

  &.slice-type-image-or-icons-and-text + &.slice-type-image-or-icons-and-text {
    margin-top: 0;
  }
`;

export default SpacingComponent;
