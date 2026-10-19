import styled, { css } from 'styled-components';

import Space from '@weco/common/views/components/styled/Space';
import { designSystemColor } from '@weco/common/views/themes/config';

export const Overlay = styled.div`
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  ${props => props.theme.media('sm')`
    background: rgb(0, 0, 0, 0.7);
  `}
`;

// The brand's round control colours, but only shown on hover, like the header
// search button. On small screens it floats over the scrolling modal content,
// so it keeps its fill there, inverting on hover with a ring like the
// controls. The swap is instant, as fading inverted colours makes the icon
// flicker out midway
const brandSize = 44;
const legacySize = 28;

const brandCloseButtonStyles = (isOnDark: boolean) => {
  const fill = designSystemColor(isOnDark ? 'neutral.10' : 'neutral.70');
  const ink = designSystemColor(isOnDark ? 'neutral.70' : 'neutral.10');

  return css`
    width: ${brandSize}px;
    height: ${brandSize}px;
    background: ${fill};
    color: ${ink};
    border: 1px solid transparent;
    transition: none;

    &:hover {
      background: ${ink};
      color: ${fill};
      border-color: ${fill};
    }

    .icon {
      transform: translateX(-50%) translateY(-50%);
    }

    .icon__shape {
      transition: none;
    }

    ${props =>
      props.theme.media('sm')(`
      background: none;
      color: ${fill};
      border: 0;

      /* Bigger than the legacy button, so keep its centre in the same place */
      margin: ${(legacySize - brandSize) / 2}px ${(legacySize - brandSize) / 2}px 0 0;

      &:hover {
        background: ${fill};
        color: ${ink};
      }
    `)}
  `;
};

export const CloseButton = styled(Space).attrs<{ type?: string }>(props => ({
  as: 'button',
  type: props.type || 'button',
  $v: { size: 'sm', properties: ['top'] },
  $h: { size: 'sm', properties: ['right'] },
}))`
  position: fixed;
  width: ${legacySize}px;
  height: ${legacySize}px;
  border-radius: 50%;
  appearance: none;
  background: rgb(0, 0, 0, 0.7);
  color: ${props => props.theme.color('white')};
  z-index: 1;

  .icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%) scale(1.5);
  }

  ${props =>
    props.theme.media('sm')(`
    background: none;
    color: ${props.theme.color('neutral.600')};
    position: absolute;
  `)}

  ${props => props.theme.brandUpdate && brandCloseButtonStyles(false)}
`;

// Modal positioning is applied in three places, each building on the last:
//
// 1. BaseModalWindow (below): default styles — full-screen on mobile, centred
//    at 50%/50% with translateX/Y(-50%) on sm+ screens.
//
// 2. Variant styled components in this file (FiltersModal, InactivityModal,
//    etc.): override colours, padding, or specific layout concerns for each
//    modal type.
//
// 3. The VisualViewport useEffect in index.tsx: for the 'inactivity' modal
//    only, dynamically calculates inline styles to re-centre the modal inside
//    the *visual* viewport when the user is zoomed in. The browser's layout
//    viewport (used by position:fixed) does not account for pinch-zoom, so
//    without this the modal can appear off-screen. The inline style overrides
//    the top/left/maxWidth/maxHeight values set here.
export const BaseModalWindow = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'xl', properties: ['padding-left', 'padding-right'] },
})<{
  $width?: string | null;
  $maxWidth?: string;
}>`
  z-index: 10001;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  overflow: auto;
  transition:
    opacity 350ms ease,
    transform 350ms ease;
  background-color: ${props => props.theme.color('white')};
  box-shadow: ${props => props.theme.basicBoxShadow};

  &,
  &.fade-exit-done {
    z-index: -1;
    pointer-events: none;
  }

  &.fade-enter,
  &.fade-exit,
  &.fade-enter-done {
    z-index: 1001;
    pointer-events: all;
  }

  &,
  &.fade-enter,
  &.fade-exit-active,
  &.fade-exit-done {
    opacity: 0;
    transform: scale(0.9);
  }

  &.fade-enter-active,
  &.fade-enter-done {
    opacity: 1;
    transform: scale(1);
  }

  ${props =>
    props.theme.media('sm')(`
    top: 50%;
    left: 50%;
    right: auto;
    bottom: auto;
    height: auto;
    max-height: 90vh;
    max-width: ${props.$maxWidth || props.$width || props.theme.sizes.md};
    width: ${(props.$maxWidth && '80%') || props.$width || 'auto'};
    border-radius: ${props.theme.borderRadiusUnit}px;

    &,
    &.fade-enter,
    &.fade-exit-active,
    &.fade-exit-done {
      transform: scale(0.9) translateX(-50%) translateY(-50%);
    }
    &.fade-enter-active,
    &.fade-enter-done {
      opacity: 1;
      transform: scale(1) translateX(-50%) translateY(-50%);
    }
  `)}
  @media screen and (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const FiltersModal = styled(BaseModalWindow).attrs({
  $v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
})`
  overflow: hidden;
  padding-left: 0;
  padding-right: 0;
  box-shadow: ${props => props.theme.basicBoxShadow};
`;

// The mobile filters modal's header scrolls with its content rather than
// sitting over the top padding, and its footer is fixed, so it needs no
// vertical padding
export const MobileFiltersModal = styled(FiltersModal)`
  padding-top: 0;
  padding-bottom: 0;

  /* Centre it on the "Filters" heading, and keep it clear of a browser
  scrollbar on the scrolling filters */
  ${CloseButton} {
    ${props =>
      props.theme.brandUpdate &&
      props.theme.mediaBetween(
        'zero',
        'sm'
      )(`
        top: 6px;
        right: 24px;
      `)}
  }
`;

export const VideoModal = styled(BaseModalWindow)`
  padding: 0;
  background-color: ${props => props.theme.color('neutral.700')};
  color: ${props => props.theme.color('white')};

  ${CloseButton} {
    color: ${props => props.theme.color('white')};

    ${props => props.theme.brandUpdate && brandCloseButtonStyles(true)}

    /* Centre it on the BSL video's title bar, which is taller on small
    screens in the brand */
    ${props =>
      props.theme.brandUpdate &&
      props.theme.mediaBetween('zero', 'sm')('top: 13px;')}
  }
`;

export const CalendarModal = styled(BaseModalWindow)`
  padding: 0;
  right: 0;
  ${props => props.theme.media('sm')`
    width: 300px;
  `}
  ${props => props.theme.media('md')`
    left: auto;
  `}
`;

export const InactivityModal = styled(BaseModalWindow)`
  background-color: ${props => props.theme.color('warmNeutral.300')};
  border-radius: 8px;
`;
