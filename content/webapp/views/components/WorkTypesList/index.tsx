import Image from 'next/image';
import NextLink from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { WorkTypeStats } from '@weco/content/services/wellcome/catalogue/workTypeAggregations';
import { toSearchImagesLink } from '@weco/content/views/components/SearchPagesLink/Images';
import { toSearchWorksLink } from '@weco/content/views/components/SearchPagesLink/Works';

const StyledImage = styled(Image)`
  width: 80px;
  height: 80px;

  ${props =>
    props.theme.media('medium')(`
    width: 100%;
    height: auto;
    max-width: 120px;
  `)}
`;

const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacingUnit * 3}px;
  align-items: stretch;
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;

  ${props =>
    props.theme.media('medium')(`
    flex-direction: row;
    justify-content: space-between;
    gap: ${props.theme.spacingUnit * 2}px;
    min-width: 0;
  `)}
`;

const StyledListItem = styled.li`
  display: flex;
  flex: 1;
  list-style: none;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  max-width: 80px;
  margin-bottom: 0;
  flex-shrink: 0;

  ${props =>
    props.theme.media('medium')(`
    min-height: 120px;
    max-width: 100%;
    margin-bottom: ${props.theme.spacingUnit}px;
    flex-shrink: 1;
  `)}
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-grow: 1;

  ${props =>
    props.theme.media('medium')(`
    align-items: center;
  `)}
`;

const CountDisplay = styled.strong`
  font-variant-numeric: tabular-nums;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  min-width: 90px; /* Fixed width to accommodate longest numbers */

  ${props =>
    props.theme.media('medium')(`
    justify-content: center;
    min-width: 100px;
  `)}
`;

const StyledLink = styled(NextLink)`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  gap: ${props => props.theme.spacingUnit * 2}px;
  flex: 1;
  text-decoration: none;
  color: inherit;

  &:hover {
    text-decoration: none;
  }

  ${props =>
    props.theme.media('medium')(`
    flex-direction: column;
    text-align: center;
    gap: 0;
    min-width: 0;
    flex: 1 1 0;
  `)}
`;
const getSearchLinkForCategory = (categoryId: string) => {
  switch (categoryId) {
    case 'books-journals':
      return toSearchWorksLink({ workType: ['a', 'd'] });
    case 'images':
      return toSearchImagesLink({});
    case 'archives-manuscripts':
      return toSearchWorksLink({ workType: ['h', 'b', 'hdig'] });
    case 'audio-video':
      return toSearchWorksLink({ workType: ['g', 'i', 'n', 'c'] });
    case 'ephemera':
      return toSearchWorksLink({ workType: ['l'] });
    default:
      return toSearchWorksLink({});
  }
};

type WorkTypeItemProps = {
  icon: React.ReactElement;
  stats: WorkTypeStats;
  animationIndex: number;
};

const WorkTypeItem: React.FC<WorkTypeItemProps> = ({
  icon,
  stats,
  animationIndex,
}) => {
  const [displayCount, setDisplayCount] = useState<number>(stats.fallbackCount);
  const [showPlus, setShowPlus] = useState<boolean>(true);
  const [isInView, setIsInView] = useState<boolean>(false);
  const itemRef = useRef<HTMLLIElement>(null);

  // Intersection Observer to detect when component is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the component is visible
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before fully in view
      }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, []);

  // Animation effect - only triggers when in view
  useEffect(() => {
    if (!isInView) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // If we have a real count, animate from fallback to real count
    if (stats.count !== null && stats.count !== stats.fallbackCount) {
      const startCount = stats.fallbackCount;
      const endCount = stats.count;
      const duration = 2000; // 2 seconds
      const staggerDelay = animationIndex * 750; // 750ms delay between each item

      if (prefersReducedMotion) {
        // Skip animation - immediately show final state
        setDisplayCount(endCount);
        setShowPlus(false);
      } else {
        const startAnimation = () => {
          // Hide the plus when animation starts
          setShowPlus(false);
          const startTime = Date.now();

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Custom easing function that slows down dramatically at the end
            const easeOutCustom = 1 - Math.pow(1 - progress, 6);

            const currentCount = Math.round(
              startCount + (endCount - startCount) * easeOutCustom
            );

            setDisplayCount(currentCount);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              // Animation complete
              setDisplayCount(endCount);
            }
          };

          requestAnimationFrame(animate);
        };

        // Start animation after staggered delay
        setTimeout(startAnimation, staggerDelay);
      }
    } else if (stats.count !== null) {
      // If count equals fallback, just remove the plus
      if (prefersReducedMotion) {
        // Skip delay - immediately show final state
        setDisplayCount(stats.count);
        setShowPlus(false);
      } else {
        setTimeout(() => {
          setDisplayCount(stats.count!);
          setShowPlus(false);
        }, animationIndex * 750);
      }
    }
  }, [isInView, stats.count, stats.fallbackCount, animationIndex]);

  const formatDisplayCount = (): React.ReactNode => {
    const numberPart = displayCount.toLocaleString();
    const shouldShowPlus = stats.count === null || showPlus;

    return (
      <span style={{ position: 'relative' }}>
        {numberPart}
        <span
          style={{
            visibility: shouldShowPlus ? 'visible' : 'hidden',
            position: 'absolute',
            right: '-0.8em',
          }}
        >
          +
        </span>
      </span>
    );
  };

  const searchLink = getSearchLinkForCategory(stats.id);

  return (
    <StyledListItem ref={itemRef} data-component="work-type-item">
      <StyledLink {...searchLink}>
        <IconContainer>{icon}</IconContainer>
        <TextContainer>
          <div>
            <CountDisplay>{formatDisplayCount()}</CountDisplay>
          </div>
          <div>{stats.label}</div>
        </TextContainer>
      </StyledLink>
    </StyledListItem>
  );
};

// SVG Icon Components
const BookIcon = () => (
  <StyledImage
    src="/icons/book.svg"
    alt="Books and Journals"
    width={120}
    height={120}
  />
);

const ImageIcon = () => (
  <StyledImage src="/icons/image.svg" alt="Images" width={120} height={120} />
);

const ArchivesIcon = () => (
  <StyledImage
    src="/icons/archives.svg"
    alt="Archives and Manuscripts"
    width={120}
    height={120}
  />
);

const VideoAudioIcon = () => (
  <StyledImage
    src="/icons/video-audio.svg"
    alt="Audio and Video"
    width={120}
    height={120}
  />
);

const EphemeraIcon = () => (
  <StyledImage
    src="/icons/ephemera.svg"
    alt="Ephemera"
    width={120}
    height={120}
  />
);

type WorkTypesListProps = {
  collectionStats: {
    booksAndJournals: WorkTypeStats;
    images: WorkTypeStats;
    archivesAndManuscripts: WorkTypeStats;
    audioAndVideo: WorkTypeStats;
    ephemera: WorkTypeStats;
  };
};

const WorkTypesList: React.FC<WorkTypesListProps> = ({ collectionStats }) => (
  <div data-component="work-types-list">
    <StyledList>
      <WorkTypeItem
        icon={<BookIcon />}
        stats={collectionStats.booksAndJournals}
        animationIndex={0}
      />
      <WorkTypeItem
        icon={<ImageIcon />}
        stats={collectionStats.images}
        animationIndex={1}
      />
      <WorkTypeItem
        icon={<ArchivesIcon />}
        stats={collectionStats.archivesAndManuscripts}
        animationIndex={2}
      />
      <WorkTypeItem
        icon={<VideoAudioIcon />}
        stats={collectionStats.audioAndVideo}
        animationIndex={3}
      />
      <WorkTypeItem
        icon={<EphemeraIcon />}
        stats={collectionStats.ephemera}
        animationIndex={4}
      />
    </StyledList>
  </div>
);

export default WorkTypesList;
