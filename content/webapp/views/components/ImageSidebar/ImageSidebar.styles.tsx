import NextLink from 'next/link';
import styled from 'styled-components';

import { typography } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import {
  containerEdge,
  containerPadding,
  mediaBackgroundColor,
  pageBackgroundColor,
} from '@weco/common/views/themes/config';

export const TRANSITION_MS = 300;
export const GRID_COLUMNS = 12;
export const SIDEBAR_COLUMNS = { default: 6, min: 3, max: 9 };

// The narrowest the results grid gets, inside its padding, so on narrower
// screens the sidebar can't reach 9 columns
export const MIN_GRID_WIDTH = 200;

/**
 * Full screen over everything below the `sm` breakpoint, sliding up from the
 * bottom, and a column beside the results from `sm` up, sliding in from the
 * right over space the results have already given up. From `sm` up it covers
 * `--sidebar-columns` of the grid, plus the space to the right of the grid.
 */
export const SidebarWrapper = styled.section<{
  $isOpen: boolean;
  $isInstant: boolean;
}>`
  position: fixed;
  inset: 0;
  z-index: 1001;
  background-color: ${props => props.theme.color(pageBackgroundColor)};
  color: ${props => props.theme.color('black')};
  transform: ${props => (props.$isOpen ? 'none' : 'translateY(100%)')};
  transition: ${props =>
    props.$isInstant ? 'none' : `transform ${TRANSITION_MS}ms ease-in-out`};

  ${props => {
    const gap = props.theme.spacingUnits['100'];
    const edge = containerEdge(props.theme.sizes.lg);
    const columns = 'var(--sidebar-columns)';

    return props.theme.media('sm')(`
      position: sticky;
      inset: auto;
      top: 0;
      z-index: auto;
      transform: ${props.$isOpen ? 'none' : 'translateX(100%)'};
      flex: 0 0 calc(${edge} + ${columns} * (100% - 2 * ${edge}) / ${GRID_COLUMNS} + ${gap});
      /* Otherwise a long title or wide image could stop it getting narrower */
      min-width: 0;
      max-width: calc(100% - ${edge} - ${containerPadding} - ${MIN_GRID_WIDTH}px);
      height: 100vh;
      border-left: ${gap} solid ${props.theme.color({
        brand: 'neutral.10',
        legacy: 'warmNeutral.300',
      })};
      box-shadow: inset 1px 0 0 ${props.theme.color('neutral.300')};
    `);
  }}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// Inside the wrapper, so the resize handle can sit over the wrapper's border
// without scrolling with the content or being clipped by it
export const SidebarScroller = styled(Space).attrs({
  $h: { size: 'md', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'md', properties: ['padding-top', 'padding-bottom'] },
})`
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;

  ${props =>
    props.theme.media('sm')(`
      overscroll-behavior: auto;
    `)}
`;

/**
 * Over the gap to the left of the sidebar, and a little either side of it, so
 * it's at least 24px wide to grab, and wider for touch.
 */
export const ResizeHandle = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(-${props => props.theme.spacingUnits['100']} - 8px);
  z-index: 1;
  width: 24px;
  cursor: col-resize;
  touch-action: none;

  @media (pointer: coarse) {
    left: calc(-${props => props.theme.spacingUnits['100']} - 18px);
    width: 44px;
  }
`;

export const CloseButton = styled(Space).attrs<{ type?: string }>(props => ({
  as: 'button',
  type: props.type || 'button',
  $v: { size: 'md', properties: ['margin-bottom'] },
}))`
  appearance: none;
  display: block;
  margin-left: auto;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
`;

export const LoadingWrapper = styled.div`
  height: 350px;
`;

export const ThumbnailPanel = styled(Space).attrs({
  $v: { size: 'md', properties: ['margin-bottom'] },
})`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 350px;
  background-color: ${props => props.theme.color(mediaBackgroundColor)};
`;

export const ThumbnailLink = styled(NextLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 10px;

  img {
    width: auto;
    max-width: calc(100% - 20px);
    max-height: 100%;

    /* Safari doesn't respond to max-height/width like the other browsers, we need this to ensure it's not warped. */
    object-fit: contain;
  }
`;

export const Title = styled.h2.attrs({
  className: typography('body', 'xl', 'strong'),
})`
  margin-bottom: 0;
`;

export const MetadataWrapper = styled(Space).attrs({
  className: typography('body', 'md', 'regular'),
  $v: { size: 'xs', properties: ['margin-top', 'margin-bottom'] },
})`
  color: ${props => props.theme.color('neutral.600')};
`;
