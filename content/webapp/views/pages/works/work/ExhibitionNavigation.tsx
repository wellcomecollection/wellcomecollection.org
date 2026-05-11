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
  prevWorkId?: string;
  nextWorkId?: string;
};

function findExhibitionContext(
  workId: string,
  exhibitionExtras: Record<string, GalleryExhibitionData>
): ExhibitionContext | null {
  for (const [exhibitionId, exhibition] of Object.entries(exhibitionExtras)) {
    const currentIndex = exhibition.works.indexOf(workId);
    if (currentIndex !== -1) {
      const prevWorkId =
        currentIndex > 0 ? exhibition.works[currentIndex - 1] : undefined;
      const nextWorkId =
        currentIndex < exhibition.works.length - 1
          ? exhibition.works[currentIndex + 1]
          : undefined;

      return {
        exhibition,
        exhibitionId,
        currentIndex,
        prevWorkId,
        nextWorkId,
      };
    }
  }
  return null;
}

type Props = {
  workId: string;
};

export const ExhibitionNavigation: FunctionComponent<Props> = ({ workId }) => {
  const { inGallery = false } = useToggles();
  const serverData = useContext(ServerDataContext);
  const { exhibitionExtras } = serverData;

  if (!inGallery) {
    return null;
  }

  const context = findExhibitionContext(workId, exhibitionExtras);

  if (!context) {
    return null;
  }

  const { exhibition, exhibitionId, currentIndex, prevWorkId, nextWorkId } =
    context;
  const firstStory = exhibition.stories[0];
  const firstCluster = exhibition.collectionClusters[0];

  return (
    <ExhibitionNavWrapper data-component="ExhibitionNavigation">
      <Container>
        <Space
          $v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
        >
          <ExhibitionTitle>
            Featured in {exhibition.title || exhibitionId}
          </ExhibitionTitle>
          <DescriptionText>
            This work is part of the {exhibition.title || exhibitionId}{' '}
            exhibition.
          </DescriptionText>

          <Space $v={{ size: 'md', properties: ['margin-top'] }}>
            <NavGrid>
              <div style={{ textAlign: 'left' }}>
                {prevWorkId ? (
                  <Link href={`/works/${prevWorkId}`} passHref legacyBehavior>
                    <NavButton>← Previous work</NavButton>
                  </Link>
                ) : (
                  <NavButton $disabled>← Previous work</NavButton>
                )}
              </div>

              <div style={{ textAlign: 'center' }}>
                <span>
                  {currentIndex + 1} of {exhibition.works.length}
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                {nextWorkId ? (
                  <Link href={`/works/${nextWorkId}`} passHref legacyBehavior>
                    <NavButton>Next work →</NavButton>
                  </Link>
                ) : (
                  <NavButton $disabled>Next work →</NavButton>
                )}
              </div>
            </NavGrid>
          </Space>

          {(firstStory || firstCluster) && (
            <RelatedLinks>
              <RelatedTitle>You may be interested in</RelatedTitle>
              <RelatedLinksList>
                {firstStory && (
                  <Link href={`/stories/${firstStory}`} passHref legacyBehavior>
                    <RelatedLink>Related stories</RelatedLink>
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

export default ExhibitionNavigation;
