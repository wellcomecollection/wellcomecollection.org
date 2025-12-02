import Image from 'next/image';
import NextLink from 'next/link';
import {
  FunctionComponent,
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

const StyledImage = styled(Image)<{ $tiltIndex: number }>`
  width: 80px;
  height: 80px;
  transform: rotate(
    ${props => (props.$tiltIndex % 2 === 0 ? '-2deg' : '2deg')}
  );
  transition:
    transform 0.2s ease-out,
    filter 0.2s ease-out;

  @container work-types-list (min-width: ${props =>
    props.theme.sizes.medium}px) {
    width: 100%;
    height: auto;
    max-width: 100px;
  }

  @container work-types-list (min-width: ${props =>
    props.theme.sizes.large}px) {
    width: 100%;
    height: auto;
    max-width: 120px;
  }
`;

const StyledList = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${props => props.theme.getSpaceValue('l', 'small')};
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
      calc(50% - ${props => props.theme.getSpaceValue('l', 'small')} / 2);
  }

  /* Center the 5th item (last item) on small containers */
  & > li:nth-child(5) {
    margin: 0 auto;
  }

  /* Large container: single row layout */
  @container work-types-list (min-width: ${props =>
    props.theme.sizes.medium}px) {
    flex-wrap: nowrap;
    justify-content: space-between;
    min-width: 0;
    gap: ${props => props.theme.getSpaceValue('l', 'large')};

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

  @container work-types-list (min-width: ${props =>
    props.theme.sizes.medium}px) {
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

  @container work-types-list (min-width: ${props =>
    props.theme.sizes.medium}px) {
    align-items: center;
  }
`;
const CountDisplayContainer = styled.div`
  font-variant-numeric: tabular-nums;
  display: flex;
  justify-content: center;
  align-items: center;

  @container work-types-list (min-width: ${props =>
    props.theme.sizes.medium}px) {
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

  @container work-types-list (min-width: ${props =>
    props.theme.sizes.medium}px) {
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
  startAnimations?: boolean;
  description?: string;
  registerNumberRef?: (el: HTMLElement | null) => void;
};

const WorkTypeItem: FunctionComponent<WorkTypeItemProps> = ({
  icon,
  stats,
  animationIndex,
  startAnimations,
  description,
  registerNumberRef,
}) => {
  const initialCount =
    stats.count !== null ? Math.max(0, stats.count - 10) : stats.fallbackCount;
  const [displayCount, setDisplayCount] = useState<number>(initialCount);
  const [showPlus, setShowPlus] = useState<boolean>(true);
  const countContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (startAnimations) return;

    const newInitial =
      stats.count !== null
        ? Math.max(0, stats.count - 50)
        : stats.fallbackCount;

    if (displayCount !== newInitial) {
      setDisplayCount(newInitial);
      // Show the plus if we don't have a real count yet
      setShowPlus(stats.count === null);
    }
  }, [stats.count, stats.fallbackCount, startAnimations]);

  useEffect(() => {
    if (!startAnimations) return;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const endCount = stats.count ?? stats.fallbackCount;

    if (prefersReducedMotion) {
      setDisplayCount(endCount);
      setShowPlus(false);
      return;
    }

    // Duration and easing exponent chosen to slow near the end.
    const startCount = initialCount;
    const duration = 5000;

    let rafId: number | null = null;
    let startTime: number | null = null;

    setShowPlus(false);

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = Math.min(timestamp - startTime, duration);
      const rawProgress = Math.max(0, Math.min(1, elapsed / duration));

      // easeOutExpo: fast at start, slows sharply near the end
      const eased = rawProgress === 1 ? 1 : 1 - Math.pow(2, -10 * rawProgress);
      const current = Math.round(startCount + (endCount - startCount) * eased);
      setDisplayCount(current);

      if (rawProgress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setDisplayCount(endCount);
      }
    };

    rafId = requestAnimationFrame(step);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [startAnimations, stats.count, stats.fallbackCount]);

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
    <StyledListItem data-component="work-type-item">
      <StyledLink {...searchLink} $tiltIndex={animationIndex}>
        <IconContainer>{icon}</IconContainer>
        <TextContainer>
          <div>
            <CountDisplayContainer
              aria-hidden="true"
              className={font('wb', 1)}
              ref={el => {
                countContainerRef.current = el as HTMLDivElement | null;
                if (registerNumberRef)
                  registerNumberRef(el as HTMLElement | null);
              }}
            >
              {formatDisplayCount()}
            </CountDisplayContainer>
            {/* Screen reader only text with stable count */}
            <span className="visually-hidden">{accessibleCountText}</span>
          </div>
          <div className={font('intr', 1)}>{stats.label}</div>
          {description && (
            <DescriptionText className={font('intr', 0)}>
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
}) => {
  const [startAnimations, setStartAnimations] = useState(false);
  const numberEls = useRef<Set<Element>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (startAnimations) return;

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setStartAnimations(true);
          observerRef.current?.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    numberEls.current.forEach(el => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [startAnimations]);

  const registerNumberRef = (el: HTMLElement | null) => {
    if (!el) return;
    if (!numberEls.current.has(el)) {
      numberEls.current.add(el);
      if (observerRef.current) observerRef.current.observe(el);
    }
  };

  return (
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
          startAnimations={startAnimations}
          registerNumberRef={registerNumberRef}
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
          startAnimations={startAnimations}
          registerNumberRef={registerNumberRef}
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
          startAnimations={startAnimations}
          registerNumberRef={registerNumberRef}
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
          startAnimations={startAnimations}
          registerNumberRef={registerNumberRef}
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
          startAnimations={startAnimations}
          description="For example leaflets, labels and stamps"
          registerNumberRef={registerNumberRef}
        />
      </StyledList>
    </div>
  );
};

export default WorkTypesList;
