import Link from 'next/link';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { useKiosksContent } from '@weco/common/contexts/KioskContext';
import { KioskContent } from '@weco/common/contexts/KioskContext/kiosk';
import { useModes } from '@weco/common/server-data/Context';
import Space from '@weco/common/views/components/styled/Space';

const KioskNavigationWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${props => props.theme.color('neutral.600')};
  color: ${props => props.theme.color('white')};
  z-index: 1000;
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

  return (
    <KioskNavigationWrapper data-component="kiosk-navigation">
      <Space $v={{ size: 'md', properties: ['margin-top'] }}>
        Back to: Home
        {navigation && (
          <>
            {label}
            <div>
              <div style={{ textAlign: 'center' }}>
                <span>
                  {navigation.currentIndex + 1} of {navigation.totalCount}
                </span>
              </div>
              <div style={{ textAlign: 'left' }}>
                {navigation.prevPageId ? (
                  <Link href={`/${urlPath}/${navigation.prevPageId}`}>
                    Prev
                  </Link>
                ) : (
                  'Prev'
                )}
              </div>

              <div style={{ textAlign: 'right' }}>
                {navigation.nextPageId ? (
                  <Link href={`/${urlPath}/${navigation.nextPageId}`}>
                    Next
                  </Link>
                ) : (
                  'Next'
                )}
              </div>
            </div>
          </>
        )}
      </Space>
    </KioskNavigationWrapper>
  );
};

export default KioskNavigation;
