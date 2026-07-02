import styled from 'styled-components';

import Space from '@weco/common/views/components/styled/Space';

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

export const CloseButton = styled(Space).attrs<{ type?: string }>(props => ({
  as: 'button',
  type: props.type || 'button',
  $v: { size: 'sm', properties: ['top'] },
  $h: { size: 'sm', properties: ['right'] },
}))`
  position: fixed;
  width: 28px;
  height: 28px;
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

export const VideoModal = styled(BaseModalWindow)`
  padding: 0;
  background-color: ${props => props.theme.color('neutral.700')};
  color: ${props => props.theme.color('white')};

  ${CloseButton} {
    color: ${props => props.theme.color('white')};
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
