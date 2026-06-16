import Link from 'next/link';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { useKiosksContent } from '@weco/common/contexts/KioskContext';
import { KioskContent } from '@weco/common/contexts/KioskContext/kiosk';
import { arrowSmall, home } from '@weco/common/icons';
import { useModes } from '@weco/common/server-data/Context';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';

const KioskNavigationWrapper = styled(Space).attrs({
  $v: { size: 'sm', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'md', properties: ['padding-left', 'padding-right'] },
  className: font('sans', -1),
})`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${props => props.theme.color('neutral.700')};
  color: ${props => props.theme.color('white')};
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HomeLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 16px;
  color: inherit;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const NavigationLinks = styled.nav`
  display: flex;
  align-items: center;
  ${props => `gap: ${props.theme.gutter.medium};`}
`;

const navLinkStyles = `
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const NavLink = styled(Link)`
  ${navLinkStyles}
  color: inherit;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const DisabledNavLink = styled.div`
  ${navLinkStyles}
  color: inherit;
  cursor: not-allowed;
  opacity: 0.5;
`;

type PageType = 'work' | 'story';

type NavigationContent = {
  currentIndex: number;
  totalCount: number;
  prevPageId?: string;
  nextPageId?: string;
};

function findNavigationContent({
  pageId,
  kioskMode,
  kiosksContent,
}: {
  pageId: string;
  kioskMode: string | null;
  kiosksContent: Record<string, KioskContent>;
}): NavigationContent | null {
  // Find the content that matches the kioskMode prefix (e.g., "TR" from "TR-iPad1")
  const kioskModePrefix = Object.keys(kiosksContent).find(prefix =>
    kioskMode?.startsWith(prefix)
  );

  if (!kioskModePrefix) {
    return null;
  }

  const content = kiosksContent[kioskModePrefix];

  // Search all arrays in the content object to find which one contains the pageId
  let items: string[] | undefined;
  let currentIndex = -1;

  for (const value of Object.values(content)) {
    if (Array.isArray(value)) {
      currentIndex = value.indexOf(pageId);
      if (currentIndex !== -1) {
        items = value;
        break;
      }
    }
  }

  if (!items || currentIndex === -1) {
    return null;
  }

  const prevPageId = currentIndex > 0 ? items[currentIndex - 1] : undefined;
  const nextPageId =
    currentIndex < items.length - 1 ? items[currentIndex + 1] : undefined;

  return {
    currentIndex,
    totalCount: items.length,
    prevPageId,
    nextPageId,
  };
}

type Props = {
  pageId: string;
  pageType: PageType;
};

export const KioskNavigation: FunctionComponent<Props> = ({
  pageId,
  pageType,
}) => {
  const { kioskMode } = useModes();
  const kiosksContent = useKiosksContent();
  const navigation = findNavigationContent({
    pageId,
    kioskMode,
    kiosksContent,
  });

  // Determine URL path and label based on page type
  const urlPath = pageType === 'work' ? 'works' : 'stories';
  const label = pageType === 'work' ? 'Related works' : 'Related stories';
  const homeUrl = '/stories/kiosk';

  return (
    <KioskNavigationWrapper
      data-component="kiosk-navigation"
      aria-label="Kiosk navigation"
    >
      <HomeLink href={homeUrl} aria-label="Return to kiosk home page">
        <Icon icon={home} aria-hidden="true" />
        <span>Back to: Home</span>
      </HomeLink>
      <NavigationLinks aria-label="Content navigation">
        {navigation && (
          <>
            <span aria-label={`Viewing ${label.toLowerCase()}`}>{label}</span>
            <span
              aria-label={`Page ${navigation.currentIndex + 1} of ${navigation.totalCount}`}
            >
              {navigation.currentIndex + 1} / {navigation.totalCount}
            </span>
            {navigation.prevPageId ? (
              <NavLink
                href={`/${urlPath}/${navigation.prevPageId}`}
                aria-label="Go to previous page"
              >
                <Icon icon={arrowSmall} rotate={180} aria-hidden="true" />
                <span>Prev</span>
              </NavLink>
            ) : (
              <DisabledNavLink
                aria-disabled="true"
                aria-label="Previous page unavailable"
              >
                <Icon icon={arrowSmall} rotate={180} aria-hidden="true" />
                <span>Prev</span>
              </DisabledNavLink>
            )}
            {navigation.nextPageId ? (
              <NavLink
                href={`/${urlPath}/${navigation.nextPageId}`}
                aria-label="Go to next page"
              >
                <Icon icon={arrowSmall} aria-hidden="true" />
                <span>Next</span>
              </NavLink>
            ) : (
              <DisabledNavLink
                aria-disabled="true"
                aria-label="Next page unavailable"
              >
                <Icon icon={arrowSmall} aria-hidden="true" />
                <span>Next</span>
              </DisabledNavLink>
            )}
          </>
        )}
      </NavigationLinks>
    </KioskNavigationWrapper>
  );
};

export default KioskNavigation;
