import Link from 'next/link';
import { FunctionComponent, useContext } from 'react';
import styled from 'styled-components';

import {
  ServerDataContext,
  useToggles,
} from '@weco/common/server-data/Context';
import { GalleryExhibitionData } from '@weco/common/server-data/types';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';

const ExhibitionNavWrapper = styled.div`
  background-color: ${props => props.theme.color('warmNeutral.300')};
  padding: ${props => props.theme.spacingUnit * 3}px 0;
`;

const NavGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: ${props => props.theme.spacingUnit * 2}px;
  align-items: center;
`;

const NavButton = styled.a<{ $disabled?: boolean }>`
  display: inline-block;
  padding: ${props => props.theme.spacingUnit * 2}px
    ${props => props.theme.spacingUnit * 3}px;
  background-color: ${props => props.theme.color('black')};
  color: ${props => props.theme.color('white')};
  text-decoration: none;
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  font-weight: bold;
  text-align: center;

  ${props =>
    props.$disabled &&
    `
    background-color: ${props.theme.color('neutral.500')};
    cursor: not-allowed;
    pointer-events: none;
  `}

  &:hover:not([disabled]) {
    background-color: ${props => props.theme.color('neutral.700')};
  }
`;

const ExhibitionTitle = styled.h2`
  font-size: 1.2rem;
  margin: 0;
  text-align: center;
  font-weight: bold;
`;

const DescriptionText = styled.p`
  margin: ${props => props.theme.spacingUnit * 2}px 0 0 0;
  text-align: center;
  font-size: 1rem;
  line-height: 1.5;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const RelatedLinks = styled.div`
  margin-top: ${props => props.theme.spacingUnit * 3}px;
  padding-top: ${props => props.theme.spacingUnit * 3}px;
  border-top: 1px solid ${props => props.theme.color('neutral.400')};
`;

const RelatedTitle = styled.h3`
  font-size: 1rem;
  margin: 0 0 ${props => props.theme.spacingUnit * 2}px 0;
  font-weight: bold;
`;

const RelatedLinksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacingUnit}px;

  ${props => props.theme.media('sm')`
    flex-direction: row;
    gap: 1rem;
  `}
`;

const RelatedLink = styled.a`
  display: inline-block;
  padding: ${props => props.theme.spacingUnit}px
    ${props => props.theme.spacingUnit * 2}px;
  background-color: ${props => props.theme.color('white')};
  color: ${props => props.theme.color('black')};
  text-decoration: none;
  border: 2px solid ${props => props.theme.color('black')};
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  text-align: center;

  &:hover {
    background-color: ${props => props.theme.color('neutral.200')};
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
};

function findExhibitionContext(
  currentUrl: string,
  exhibitionExtras: Record<string, GalleryExhibitionData>
): ExhibitionContext | null {
  // Normalize URLs for comparison by decoding and removing trailing slashes
  const normalizeUrl = (url: string) => {
    try {
      const decoded = decodeURIComponent(url);
      return decoded.replace(/\/$/, '').toLowerCase();
    } catch {
      return url.replace(/\/$/, '').toLowerCase();
    }
  };

  const normalizedCurrentUrl = normalizeUrl(currentUrl);

  for (const [exhibitionId, exhibition] of Object.entries(exhibitionExtras)) {
    const currentIndex = exhibition.collectionClusters.findIndex(cluster => {
      const normalizedClusterUrl = normalizeUrl(cluster.url);
      // Check if the URLs match (for exact concept IDs or search queries)
      return (
        normalizedClusterUrl === normalizedCurrentUrl ||
        normalizedClusterUrl.includes(normalizedCurrentUrl) ||
        normalizedCurrentUrl.includes(normalizedClusterUrl)
      );
    });
    if (currentIndex !== -1) {
      const prevCluster =
        currentIndex > 0
          ? exhibition.collectionClusters[currentIndex - 1]
          : undefined;
      const nextCluster =
        currentIndex < exhibition.collectionClusters.length - 1
          ? exhibition.collectionClusters[currentIndex + 1]
          : undefined;

      return {
        exhibition,
        exhibitionId,
        currentIndex,
        prevUrl: prevCluster?.url,
        nextUrl: nextCluster?.url,
        prevTitle: prevCluster?.title,
        nextTitle: nextCluster?.title,
      };
    }
  }
  return null;
}

type Props = {
  currentUrl: string;
};

export const ExhibitionCollectionNavigation: FunctionComponent<Props> = ({
  currentUrl,
}) => {
  const { inGallery = false } = useToggles();
  const serverData = useContext(ServerDataContext);
  const { exhibitionExtras } = serverData;

  if (!inGallery) {
    return null;
  }

  const context = findExhibitionContext(currentUrl, exhibitionExtras);

  if (!context) {
    return null;
  }

  const {
    exhibition,
    exhibitionId,
    currentIndex,
    prevUrl,
    nextUrl,
    prevTitle,
    nextTitle,
  } = context;
  const firstStory = exhibition.stories[0];

  return (
    <ExhibitionNavWrapper data-component="ExhibitionCollectionNavigation">
      <Container>
        <Space
          $v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
        >
          <ExhibitionTitle>
            Related to {exhibition.title || exhibitionId}
          </ExhibitionTitle>
          <DescriptionText>
            The exhibition curators for {exhibition.title || exhibitionId} have
            identified this, and several other topics, as exploring the themes
            of the exhibition.
          </DescriptionText>

          <Space $v={{ size: 'md', properties: ['margin-top'] }}>
            <NavGrid>
              <div style={{ textAlign: 'left' }}>
                {prevUrl ? (
                  <Link href={prevUrl} passHref legacyBehavior>
                    <NavButton title={prevTitle}>← Previous</NavButton>
                  </Link>
                ) : (
                  <NavButton $disabled>← Previous</NavButton>
                )}
              </div>

              <div style={{ textAlign: 'center' }}>
                <span>
                  {currentIndex + 1} of {exhibition.collectionClusters.length}
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                {nextUrl ? (
                  <Link href={nextUrl} passHref legacyBehavior>
                    <NavButton title={nextTitle}>Next →</NavButton>
                  </Link>
                ) : (
                  <NavButton $disabled>Next →</NavButton>
                )}
              </div>
            </NavGrid>
          </Space>

          {firstStory && (
            <RelatedLinks>
              <RelatedTitle>You may be interested in</RelatedTitle>
              <RelatedLinksList>
                <Link href={`/stories/${firstStory}`} passHref legacyBehavior>
                  <RelatedLink>Related stories</RelatedLink>
                </Link>
              </RelatedLinksList>
            </RelatedLinks>
          )}
        </Space>
      </Container>
    </ExhibitionNavWrapper>
  );
};

export default ExhibitionCollectionNavigation;
