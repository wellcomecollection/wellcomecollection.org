import NextLink from 'next/link';
import styled, { createGlobalStyle } from 'styled-components';

import { typography } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import {
  mediaBackgroundColor,
  pageBackgroundColor,
  sizes,
} from '@weco/common/views/themes/config';

// The opposite of the `sm` media query that puts the sidebar beside the results
export const belowSidebarBreakpoint = `not all and (min-width: ${sizes.sm})`;

/**
 * Full screen over everything below the `sm` breakpoint, and a column beside
 * the results from `sm` up.
 */
export const SidebarWrapper = styled(Space).attrs({
  $h: { size: 'md', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'md', properties: ['padding-top', 'padding-bottom'] },
})`
  position: fixed;
  inset: 0;
  z-index: 1001;
  overflow-y: auto;
  overscroll-behavior: contain;
  background-color: ${props => props.theme.color(pageBackgroundColor)};
  color: ${props => props.theme.color('black')};

  ${props =>
    props.theme.media('sm')(`
      position: sticky;
      inset: auto;
      top: 0;
      z-index: auto;
      flex: 0 0 50%;
      height: 100vh;
      border-left: 1px solid ${props.theme.color('neutral.300')};
    `)}
`;

/**
 * Stops the page scrolling behind the full screen sidebar. Overflow hidden
 * keeps the scroll position, so the results are where they were on close.
 */
export const LockPageScroll = createGlobalStyle`
  @media ${belowSidebarBreakpoint} {
    html,
    body {
      overflow: hidden;
    }
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
