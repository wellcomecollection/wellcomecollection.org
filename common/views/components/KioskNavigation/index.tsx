import Link from 'next/link';
import { FunctionComponent, memo, useMemo } from 'react';
import styled from 'styled-components';

import {
  getKioskContentKey,
  useKiosk,
  useKiosksContent,
} from '@weco/common/contexts/KioskContext';
import { KiosksContentType } from '@weco/common/contexts/KioskContext/kiosks-content';
import { useNavigationHistory } from '@weco/common/hooks/useNavigationHistory';
import { arrowSmall, chevron, home } from '@weco/common/icons';
import { useModes } from '@weco/common/server-data/Context';
import { typography } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';

const KioskNavigationWrapper = styled(Space).attrs({
  $v: { size: 'sm', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'md', properties: ['padding-left', 'padding-right'] },
  className: typography('body', 'md', 'regular'),
  as: 'nav',
})`
  height: ${props => props.theme.kioskNavigationHeight}px;
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

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HistoryNavigation = styled.div`
  display: flex;
`;

const HistoryButton = styled.button`
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:hover:not(:disabled) {
    opacity: 0.8;
  }
`;

const HomeLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 16px;
  min-height: 44px;
  color: inherit;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const DisabledHomeLink = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 16px;
  min-height: 44px;
  color: inherit;
  cursor: not-allowed;
  opacity: 0.5;
`;

const RightSection = styled.nav`
  display: flex;
  align-items: center;
  ${props => `gap: ${props.theme.gutter.medium};`}
`;

const navLinkStyles = `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 44px;
  min-height: 44px;
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
  listName?: string;
  label?: string;
};

function findNavigationContent({
  pageId,
  kioskMode,
  kiosksContent,
}: {
  pageId: string;
  kioskMode: string | null;
  kiosksContent: Record<string, KiosksContentType>;
}): NavigationContent | null {
  const contentKey = getKioskContentKey(kioskMode, kiosksContent);

  if (!contentKey) {
    return null;
  }

  const content = kiosksContent[contentKey];

  // Search all arrays in the content object to find which one contains the pageId
  let items: string[] | undefined;
  let currentIndex = -1;
  let listName: string | undefined;

  for (const [key, value] of Object.entries(content)) {
    if (
      Array.isArray(value) &&
      (value.length === 0 || typeof value[0] === 'string')
    ) {
      const stringArray = value as string[];
      currentIndex = stringArray.indexOf(pageId);
      if (currentIndex !== -1) {
        items = stringArray;
        listName = key;
        break;
      }
    }
  }

  let label: string | undefined;

  if (!items || currentIndex === -1) {
    for (const group of content.workGroups ?? []) {
      currentIndex = group.ids.indexOf(pageId);
      if (currentIndex !== -1) {
        items = group.ids;
        label = group.heading;
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
    listName,
    label,
  };
}

type Props = {
  pageId?: string;
  pageType?: PageType;
  currentPathname?: string;
};

export const KioskNavigation: FunctionComponent<Props> = memo(
  ({ pageId, pageType, currentPathname }) => {
    const { kioskMode } = useModes();
    const { isReadingRoomKiosk, kioskHomepageUrl } = useKiosk();
    const kiosksContent = useKiosksContent();

    const isOnHomePage =
      currentPathname === '/' || currentPathname === kioskHomepageUrl;

    const { back, forward, canGoBack, canGoForward } = useNavigationHistory();

    const navigation = useMemo(
      () =>
        pageId
          ? findNavigationContent({
              pageId,
              kioskMode,
              kiosksContent,
            })
          : null,
      [pageId, kioskMode, kiosksContent]
    );

    // Determine URL path and label based on page type and list name
    const urlPath = pageType === 'work' ? 'works' : 'stories';

    let label: string;
    if (navigation?.label) {
      label = navigation.label;
    } else if (pageType === 'story') {
      label = 'Related stories';
    } else if (navigation?.listName === 'includedWorks') {
      label = 'Included works';
    } else {
      label = 'Related works';
    }

    return (
      <KioskNavigationWrapper
        data-component="kiosk-navigation"
        aria-label="Kiosk navigation"
      >
        <LeftSection>
          <HistoryNavigation aria-label="Browser navigation">
            <HistoryButton
              type="button"
              onClick={back}
              disabled={!canGoBack}
              aria-label="Go back to previous page"
            >
              <Icon icon={chevron} rotate={90} aria-hidden="true" />
            </HistoryButton>
            <HistoryButton
              type="button"
              onClick={forward}
              disabled={!canGoForward}
              aria-label="Go forward to next page"
            >
              <Icon icon={chevron} rotate={270} aria-hidden="true" />
            </HistoryButton>
          </HistoryNavigation>
          {isOnHomePage ? (
            <DisabledHomeLink aria-disabled="true" aria-current="page">
              <Icon icon={home} aria-hidden="true" />
              <span>Back to: Home</span>
            </DisabledHomeLink>
          ) : (
            <HomeLink
              href={kioskHomepageUrl || '/'}
              aria-label="Return to kiosk home page"
            >
              <Icon icon={home} aria-hidden="true" />
              <span>Back to: Home</span>
            </HomeLink>
          )}
        </LeftSection>
        <RightSection aria-label="Content navigation">
          {navigation && !isReadingRoomKiosk && (
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
        </RightSection>
      </KioskNavigationWrapper>
    );
  }
);

KioskNavigation.displayName = 'KioskNavigation';

export default KioskNavigation;
