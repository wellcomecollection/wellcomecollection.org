import Link from 'next/link';
import { FunctionComponent, useContext } from 'react';
import styled from 'styled-components';

import { ServerDataContext } from '@weco/common/server-data/Context';
import { GalleryExhibitionData } from '@weco/common/server-data/types';
import { font } from '@weco/common/utils/classnames';

const ExhibitionNavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 ${props => props.theme.spacingUnit * 2}px;
`;

const NavButton = styled.a<{ $disabled?: boolean }>`
  display: inline-block;
  padding: ${props => props.theme.spacingUnit}px
    ${props => props.theme.spacingUnit * 2}px;
  background-color: ${props => props.theme.color('black')};
  color: ${props => props.theme.color('white')};
  text-decoration: none;
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  font-size: 14px;

  ${props =>
    props.$disabled &&
    `
    background-color: ${props.theme.color('neutral.500')};
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.5;
  `}

  &:hover:not([disabled]) {
    background-color: ${props => props.theme.color('neutral.700')};
  }
`;

const ExhibitionInfo = styled.div`
  text-align: center;
  flex: 1;
  margin: 0 ${props => props.theme.spacingUnit * 2}px;
`;

const ExhibitionTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: ${props => props.theme.spacingUnit / 2}px;
`;

const Counter = styled.div`
  font-size: 12px;
  color: ${props => props.theme.color('neutral.600')};
`;

const CrossLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacingUnit}px;
  justify-content: center;
  margin-top: ${props => props.theme.spacingUnit}px;
`;

const CrossLink = styled.a`
  font-size: 12px;
  color: ${props => props.theme.color('neutral.700')};
  text-decoration: underline;

  &:hover {
    color: ${props => props.theme.color('black')};
  }
`;

type ExhibitionContext = {
  exhibition: GalleryExhibitionData;
  exhibitionId: string;
  currentIndex: number;
  prevUrl?: string;
  nextUrl?: string;
  prevTitle?: string;
  nextTitle?: string;
  itemType: 'story' | 'work' | 'collection';
  totalItems: number;
};

function findExhibitionContext(
  currentUrl: string,
  exhibitionExtras: Record<string, GalleryExhibitionData>
): ExhibitionContext | null {
  const normalizeUrl = (url: string) => {
    try {
      // Decode URL and replace + with space for consistent comparison
      const decoded = decodeURIComponent(url.replace(/\+/g, ' '));
      return decoded.replace(/\/$/, '').toLowerCase();
    } catch {
      return url.replace(/\+/g, ' ').replace(/\/$/, '').toLowerCase();
    }
  };

  const normalizedCurrentUrl = normalizeUrl(currentUrl);

  for (const [exhibitionId, exhibition] of Object.entries(exhibitionExtras)) {
    // Check stories
    const storyIndex = exhibition.stories.findIndex(
      storyId =>
        normalizeUrl(`/stories/${storyId}`) === normalizedCurrentUrl ||
        normalizedCurrentUrl.includes(storyId)
    );
    if (storyIndex !== -1) {
      const prevStoryId =
        storyIndex > 0 ? exhibition.stories[storyIndex - 1] : undefined;
      const nextStoryId =
        storyIndex < exhibition.stories.length - 1
          ? exhibition.stories[storyIndex + 1]
          : undefined;

      return {
        exhibition,
        exhibitionId,
        currentIndex: storyIndex,
        prevUrl: prevStoryId ? `/stories/${prevStoryId}` : undefined,
        nextUrl: nextStoryId ? `/stories/${nextStoryId}` : undefined,
        itemType: 'story',
        totalItems: exhibition.stories.length,
      };
    }

    // Check works
    const workIndex = exhibition.works.findIndex(
      workId =>
        normalizeUrl(`/works/${workId}`) === normalizedCurrentUrl ||
        normalizedCurrentUrl.includes(workId)
    );
    if (workIndex !== -1) {
      const prevWorkId =
        workIndex > 0 ? exhibition.works[workIndex - 1] : undefined;
      const nextWorkId =
        workIndex < exhibition.works.length - 1
          ? exhibition.works[workIndex + 1]
          : undefined;

      return {
        exhibition,
        exhibitionId,
        currentIndex: workIndex,
        prevUrl: prevWorkId ? `/works/${prevWorkId}` : undefined,
        nextUrl: nextWorkId ? `/works/${nextWorkId}` : undefined,
        itemType: 'work',
        totalItems: exhibition.works.length,
      };
    }

    // Check collection clusters (concepts and searches)
    const clusterIndex = exhibition.collectionClusters.findIndex(cluster => {
      const normalizedClusterUrl = normalizeUrl(cluster.url);
      return (
        normalizedClusterUrl === normalizedCurrentUrl ||
        normalizedClusterUrl.includes(normalizedCurrentUrl) ||
        normalizedCurrentUrl.includes(normalizedClusterUrl)
      );
    });
    if (clusterIndex !== -1) {
      const prevCluster =
        clusterIndex > 0
          ? exhibition.collectionClusters[clusterIndex - 1]
          : undefined;
      const nextCluster =
        clusterIndex < exhibition.collectionClusters.length - 1
          ? exhibition.collectionClusters[clusterIndex + 1]
          : undefined;

      return {
        exhibition,
        exhibitionId,
        currentIndex: clusterIndex,
        prevUrl: prevCluster?.url,
        nextUrl: nextCluster?.url,
        prevTitle: prevCluster?.title,
        nextTitle: nextCluster?.title,
        itemType: 'collection',
        totalItems: exhibition.collectionClusters.length,
      };
    }
  }
  return null;
}

type Props = {
  currentUrl: string;
};

export const HeaderExhibitionNav: FunctionComponent<Props> = ({
  currentUrl,
}) => {
  const serverData = useContext(ServerDataContext);
  const { exhibitionExtras } = serverData;

  // Return early if exhibitionExtras is not available
  if (!exhibitionExtras) {
    return null;
  }

  const context = findExhibitionContext(currentUrl, exhibitionExtras);

  if (!context) {
    return null;
  }

  const { exhibition, currentIndex, prevUrl, nextUrl, totalItems, itemType } =
    context;

  const itemLabel =
    itemType === 'story'
      ? 'story'
      : itemType === 'work'
        ? 'work'
        : 'collection item';

  // Get cross-links to other types
  const firstWork =
    itemType !== 'work' && exhibition.works[0]
      ? `/works/${exhibition.works[0]}`
      : undefined;
  const firstStory =
    itemType !== 'story' && exhibition.stories[0]
      ? `/stories/${exhibition.stories[0]}`
      : undefined;
  const firstCluster =
    itemType !== 'collection' && exhibition.collectionClusters[0]
      ? exhibition.collectionClusters[0].url
      : undefined;

  const showCrossLinks = firstWork || firstStory || firstCluster;

  return (
    <ExhibitionNavContainer data-component="HeaderExhibitionNav">
      <div>
        {prevUrl ? (
          <Link href={prevUrl} passHref legacyBehavior>
            <NavButton>← Prev</NavButton>
          </Link>
        ) : (
          <NavButton $disabled>← Prev</NavButton>
        )}
      </div>

      <ExhibitionInfo>
        <ExhibitionTitle className={font('brand-bold', -1)}>
          {exhibition.title}
        </ExhibitionTitle>
        <Counter>
          {itemLabel} {currentIndex + 1} of {totalItems}
        </Counter>
        {showCrossLinks && (
          <CrossLinks>
            {firstWork && (
              <Link href={firstWork} passHref legacyBehavior>
                <CrossLink>View works</CrossLink>
              </Link>
            )}
            {firstStory && (
              <Link href={firstStory} passHref legacyBehavior>
                <CrossLink>View stories</CrossLink>
              </Link>
            )}
            {firstCluster && (
              <Link href={firstCluster} passHref legacyBehavior>
                <CrossLink>View collection</CrossLink>
              </Link>
            )}
          </CrossLinks>
        )}
      </ExhibitionInfo>

      <div>
        {nextUrl ? (
          <Link href={nextUrl} passHref legacyBehavior>
            <NavButton>Next →</NavButton>
          </Link>
        ) : (
          <NavButton $disabled>Next →</NavButton>
        )}
      </div>
    </ExhibitionNavContainer>
  );
};

export default HeaderExhibitionNav;
