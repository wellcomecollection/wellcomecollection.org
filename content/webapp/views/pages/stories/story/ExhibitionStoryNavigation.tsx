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
  prevStoryId?: string;
  nextStoryId?: string;
};

function findExhibitionContext(
  storyId: string,
  exhibitionExtras: Record<string, GalleryExhibitionData>
): ExhibitionContext | null {
  for (const [exhibitionId, exhibition] of Object.entries(exhibitionExtras)) {
    const currentIndex = exhibition.stories.indexOf(storyId);
    if (currentIndex !== -1) {
      const prevStoryId =
        currentIndex > 0 ? exhibition.stories[currentIndex - 1] : undefined;
      const nextStoryId =
        currentIndex < exhibition.stories.length - 1
          ? exhibition.stories[currentIndex + 1]
          : undefined;

      return {
        exhibition,
        exhibitionId,
        currentIndex,
        prevStoryId,
        nextStoryId,
      };
    }
  }
  return null;
}

type Props = {
  storyId: string;
};

export const ExhibitionStoryNavigation: FunctionComponent<Props> = ({
  storyId,
}) => {
  const { inGallery = false } = useToggles();
  const serverData = useContext(ServerDataContext);
  const { exhibitionExtras } = serverData;

  if (!inGallery) {
    return null;
  }

  const context = findExhibitionContext(storyId, exhibitionExtras);

  if (!context) {
    return null;
  }

  const { exhibition, exhibitionId, currentIndex, prevStoryId, nextStoryId } =
    context;
  const firstWork = exhibition.works[0];
  const firstCluster = exhibition.collectionClusters[0];

  return (
    <ExhibitionNavWrapper data-component="ExhibitionStoryNavigation">
      <Container>
        <Space
          $v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
        >
          <ExhibitionTitle>
            Related to {exhibition.title || exhibitionId}
          </ExhibitionTitle>
          <DescriptionText>
            The exhibition curators for {exhibition.title || exhibitionId} have
            identified this, and several other stories, as exploring the themes
            of the exhibition.
          </DescriptionText>

          <Space $v={{ size: 'md', properties: ['margin-top'] }}>
            <NavGrid>
              <div style={{ textAlign: 'left' }}>
                {prevStoryId ? (
                  <Link
                    href={`/stories/${prevStoryId}`}
                    passHref
                    legacyBehavior
                  >
                    <NavButton>← Previous story</NavButton>
                  </Link>
                ) : (
                  <NavButton $disabled>← Previous story</NavButton>
                )}
              </div>

              <div style={{ textAlign: 'center' }}>
                <span>
                  {currentIndex + 1} of {exhibition.stories.length}
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                {nextStoryId ? (
                  <Link
                    href={`/stories/${nextStoryId}`}
                    passHref
                    legacyBehavior
                  >
                    <NavButton>Next story →</NavButton>
                  </Link>
                ) : (
                  <NavButton $disabled>Next story →</NavButton>
                )}
              </div>
            </NavGrid>
          </Space>

          {(firstWork || firstCluster) && (
            <RelatedLinks>
              <RelatedTitle>You may be interested in</RelatedTitle>
              <RelatedLinksList>
                {firstWork && (
                  <Link href={`/works/${firstWork}`} passHref legacyBehavior>
                    <RelatedLink>Related works</RelatedLink>
                  </Link>
                )}
                {firstCluster && (
                  <Link href={firstCluster.url} passHref legacyBehavior>
                    <RelatedLink>More works like this</RelatedLink>
                  </Link>
                )}
              </RelatedLinksList>
            </RelatedLinks>
          )}
        </Space>
      </Container>
    </ExhibitionNavWrapper>
  );
};

export default ExhibitionStoryNavigation;
