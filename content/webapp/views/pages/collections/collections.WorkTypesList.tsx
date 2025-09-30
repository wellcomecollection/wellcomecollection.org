import Image from 'next/image';
import NextLink from 'next/link';
import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { WorkTypeStats } from '@weco/content/services/wellcome/catalogue/workTypeAggregations';
import { toSearchImagesLink } from '@weco/content/views/components/SearchPagesLink/Images';
import { toSearchWorksLink } from '@weco/content/views/components/SearchPagesLink/Works';

const containerBreakpoint = '620px';

const StyledImage = styled(Image)<{ $tiltIndex: number }>`
  width: 80px;
  height: 80px;
  transform: rotate(
    ${props => (props.$tiltIndex % 2 === 0 ? '-2deg' : '2deg')}
  );
  transition:
    transform 0.2s ease-out,
    filter 0.2s ease-out;

  @container work-types-list (min-width: ${containerBreakpoint}) {
    width: 100%;
    height: auto;
    max-width: 120px;
  }
`;

const StyledList = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${props => props.theme.spaceAtBreakpoints.small.l}px;
  align-items: stretch;
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  container-type: inline-size;
  container-name: work-types-list;

  /* 2 items per row on small containers */
  & > li {
    flex: 0 0
      calc(50% - ${props => props.theme.spaceAtBreakpoints.small.l / 2}px);
  }

  /* Center the 5th item (last item) on small containers */
  & > li:nth-child(5) {
    margin: 0 auto;
  }

  /* Large container: single row layout */
  @container work-types-list (min-width: ${containerBreakpoint}) {
    flex-wrap: nowrap;
    justify-content: space-between;
    min-width: 0;
    gap: ${props => props.theme.spaceAtBreakpoints.large.l}px;

    & > li {
      flex: 1;
    }

    & > li:nth-child(5) {
      margin: 0;
    }
  }
`;

const StyledListItem = styled.li`
  display: flex;
  flex: 1;
  list-style: none;
`;

const IconContainer = styled(Space).attrs({
  $v: { size: 's', properties: ['margin-bottom'] },
})`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  max-width: 80px;
  flex-shrink: 0;

  @container work-types-list (min-width: ${containerBreakpoint}) {
    min-height: 120px;
    max-width: 100%;
    flex-shrink: 1;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;

  @container work-types-list (min-width: ${containerBreakpoint}) {
    align-items: center;
  }
`;

const CountDisplayContainer = styled.div`
  font-variant-numeric: tabular-nums;
  display: flex;
  justify-content: center;
  align-items: center;

  @container work-types-list (min-width: ${containerBreakpoint}) {
    justify-content: center;
    min-width: 100px;
  }
`;

const DescriptionText = styled.div`
  color: ${props => props.theme.color('neutral.600')};
`;

const StyledLink = styled(NextLink)<{ $tiltIndex?: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${props => props.theme.spacingUnit}px;
  flex: 1;
  text-decoration: none;
  color: inherit;

  &:hover {
    text-decoration: none;
  }

  &:hover img,
  &:focus img {
    transform: rotate(
        ${props =>
          typeof props.$tiltIndex === 'number' && props.$tiltIndex % 2 === 0
            ? '2deg'
            : '-2deg'}
      )
      scale(1.1);
    filter: drop-shadow(4px 4px 2px #00000040);
  }

  @container work-types-list (min-width: ${containerBreakpoint}) {
    flex-direction: column;
    text-align: center;
    gap: 0;
    min-width: 0;
    flex: 1 1 0;
  }
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
  icon: ReactElement;
  stats: WorkTypeStats;
  animationIndex: number;
  description?: string;
};

const WorkTypeItem: React.FC<WorkTypeItemProps> = ({
  icon,
  stats,
  animationIndex,
  description,
}) => {
  const [displayCount, setDisplayCount] = useState<number>(stats.fallbackCount);
  const [showPlus, setShowPlus] = useState<boolean>(true);
  const [isInView, setIsInView] = useState<boolean>(false);
  const itemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
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

  useEffect(() => {
    if (!isInView) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (stats.count !== null && stats.count !== stats.fallbackCount) {
      const startCount = stats.fallbackCount;
      const endCount = stats.count;
      const duration = 2000;
      const staggerDelay = animationIndex * 750;

      if (prefersReducedMotion) {
        setDisplayCount(endCount);
        setShowPlus(false);
      } else {
        const startAnimation = () => {
          setShowPlus(false);
          const startTime = Date.now();

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutCustom = 1 - Math.pow(1 - progress, 6);
            const currentCount = Math.round(
              startCount + (endCount - startCount) * easeOutCustom
            );

            setDisplayCount(currentCount);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplayCount(endCount);
            }
          };

          requestAnimationFrame(animate);
        };

        setTimeout(startAnimation, staggerDelay);
      }
    } else if (stats.count !== null) {
      if (prefersReducedMotion) {
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

  const formatDisplayCount = (): ReactNode => {
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

  const accessibleCount =
    stats.count !== null ? stats.count : stats.fallbackCount;
  const accessibleCountText =
    stats.count !== null
      ? `${accessibleCount.toLocaleString()}`
      : `approximately ${accessibleCount.toLocaleString()}`;

  return (
    <StyledListItem ref={itemRef} data-component="work-type-item">
      <StyledLink {...searchLink} $tiltIndex={animationIndex}>
        <IconContainer>{icon}</IconContainer>
        <TextContainer>
          <div>
            <CountDisplayContainer aria-hidden="true" className={font('wb', 3)}>
              {formatDisplayCount()}
            </CountDisplayContainer>
            {/* Screen reader only text with stable count */}
            <span className="visually-hidden">{accessibleCountText}</span>
          </div>
          <div className={font('intr', 3)}>{stats.label}</div>
          {description && (
            <DescriptionText className={font('intr', 4)}>
              {description}
            </DescriptionText>
          )}
        </TextContainer>
      </StyledLink>
    </StyledListItem>
  );
};

type WorkTypesListProps = {
  collectionStats: {
    booksAndJournals: WorkTypeStats;
    images: WorkTypeStats;
    archivesAndManuscripts: WorkTypeStats;
    audioAndVideo: WorkTypeStats;
    ephemera: WorkTypeStats;
  };
  icons?: {
    book: string;
    image: string;
    archives: string;
    videoAudio: string;
    ephemera: string;
  };
};

const WorkTypesList: React.FC<WorkTypesListProps> = ({
  collectionStats,
  icons = {
    book: '/icons/book.svg',
    image: '/icons/image.svg',
    archives: '/icons/archives.svg',
    videoAudio: '/icons/video-audio.svg',
    ephemera: '/icons/ephemera.svg',
  },
}) => (
  <div data-component="work-types-list">
    <StyledList>
      <WorkTypeItem
        icon={
          <StyledImage
            src={icons.book}
            alt=""
            width={120}
            height={120}
            $tiltIndex={0}
          />
        }
        stats={collectionStats.booksAndJournals}
        animationIndex={0}
      />
      <WorkTypeItem
        icon={
          <StyledImage
            src={icons.image}
            alt=""
            width={120}
            height={120}
            $tiltIndex={1}
          />
        }
        stats={collectionStats.images}
        animationIndex={1}
      />
      <WorkTypeItem
        icon={
          <StyledImage
            src={icons.archives}
            alt=""
            width={120}
            height={120}
            $tiltIndex={2}
          />
        }
        stats={collectionStats.archivesAndManuscripts}
        animationIndex={2}
      />
      <WorkTypeItem
        icon={
          <StyledImage
            src={icons.videoAudio}
            alt=""
            width={120}
            height={120}
            $tiltIndex={3}
          />
        }
        stats={collectionStats.audioAndVideo}
        animationIndex={3}
      />
      <WorkTypeItem
        icon={
          <StyledImage
            src={icons.ephemera}
            alt=""
            width={120}
            height={120}
            $tiltIndex={4}
          />
        }
        stats={collectionStats.ephemera}
        animationIndex={4}
        description="For example leaflets, labels and stamps"
      />
    </StyledList>
  </div>
);

export default WorkTypesList;
