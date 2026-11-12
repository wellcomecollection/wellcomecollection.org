import { theme as designSystemTheme } from '@wellcometrust/wellcome-design-system/theme';
import NextLink from 'next/link';
import {
  CSSProperties,
  FunctionComponent,
  RefObject,
  useEffect,
  useRef,
} from 'react';
import styled, { css } from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { typography } from '@weco/common/utils/classnames';
import { convertIiifImageUri } from '@weco/common/utils/convert-image-uri';
import { dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import { jsEnabledClass } from '@weco/common/utils/js-enabled';
import PlainList from '@weco/common/views/components/styled/PlainList';
import { pageBackgroundColor, sizes } from '@weco/common/views/themes/config';
import { Image } from '@weco/content/services/wellcome/catalogue/types';
import { hexToRgb } from '@weco/content/utils/convert-colors';
import { toWorksImagesLink } from '@weco/content/views/components/ImageLink';
import WorkTitle from '@weco/content/views/components/WorkTitle';

import {
  CARD_PADDING,
  columnCountFor,
  displayAspectRatio,
  EAGER_IMAGE_COUNT,
  estimateRowSpan,
  extraColumnBreakpoints,
  GAP,
  ROW_HEIGHT,
  rowSpanFor,
  shortestColumns,
  TITLE_MAX_LINES,
  TITLE_SPACE,
} from './masonry-layout';

// Wide grids get more columns, matching what JS works out. Container queries,
// so they measure the grid the same way JS does (without the scrollbar).
const extraColumnContainerQueries = extraColumnBreakpoints()
  .map(
    ([columns, minWidth]) => `
      @container (min-width: ${minWidth}px) {
        grid-template-columns: repeat(var(--columns, ${columns}), minmax(0, 1fr));
      }
    `
  )
  .join('');

const MasonryContainer = styled.div`
  container-type: inline-size;
`;

/*
 * Masonry natively with `display: grid-lanes` where the browser has it.
 * Elsewhere, with JS, short rows that each card spans enough of; without JS, a
 * plain grid. To move to grid-lanes everywhere, delete the `@supports not`
 * block and the row span code.
 */
const MasonryList = styled(PlainList)`
  display: grid;
  grid-template-columns: repeat(var(--columns, 2), minmax(0, 1fr));
  gap: ${GAP}px;

  ${props =>
    props.theme.media('sm')(`
      grid-template-columns: repeat(var(--columns, 4), minmax(0, 1fr));
    `)}

  ${extraColumnContainerQueries}

  @supports (display: grid-lanes) {
    display: grid-lanes;
  }

  @supports not (display: grid-lanes) {
    .${jsEnabledClass} & {
      grid-auto-rows: ${ROW_HEIGHT}px;
      row-gap: 0;
    }

    /* A span that's briefly too short cuts the card off rather than covering
    the one below. The margin leaves room for the focus ring. */
    .${jsEnabledClass} & > li {
      grid-row: span var(--row-span);
      overflow: clip;
      overflow-clip-margin: 6px;
    }
  }
`;

// Behind the card's own padding, so nothing moves when it's selected
const SelectedPanel = css`
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border: 2px solid ${props => props.theme.color(pageBackgroundColor)};
    border-radius: ${designSystemTheme['border-radius'].md};
    background-color: ${props =>
      props.theme.color({ brand: 'neutral.60', legacy: 'neutral.600' })};
  }
`;

const CardLink = styled(NextLink)<{ $isSelected: boolean }>`
  position: relative;
  display: block;
  padding: ${CARD_PADDING};
  color: inherit;
  text-decoration: none;

  ${props => props.$isSelected && SelectedPanel}

  &:hover h2,
  &:focus-visible h2 {
    text-decoration: underline;
  }
`;

const Thumbnail = styled.span<{ $background?: string }>`
  display: block;
  background-color: ${props => props.$background || 'transparent'};

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const Title = styled.h2.attrs({
  className: typography('heading', 'sm', 'strong'),
})`
  margin: 0;
  ${props => props.theme.makeSpacePropertyValues(TITLE_SPACE, ['margin-top'])}
  ${props => props.theme.clampLines(TITLE_MAX_LINES)}
`;

/**
 * Sets each card's row span from its real height, and the column count from
 * the grid's width. Each card keeps its column until the column count changes,
 * so cards don't switch columns while the sidebar is dragged.
 */
const useMasonryLayout = (
  listRef: RefObject<HTMLUListElement | null>,
  images: Image[]
) => {
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const usesGridLanes = CSS.supports('display', 'grid-lanes');
    const largerScreen = window.matchMedia(`(min-width: ${sizes.sm})`);
    const cardHeights = new Map<HTMLElement, number>();
    let frame: number | undefined;
    let columnCount: number | undefined;
    let lockedColumns: number[] | undefined;

    const update = () => {
      frame = undefined;
      const columns = columnCountFor({
        gridWidth: list.clientWidth,
        // Without the scrollbar, like the percentages the page's padding uses
        viewportWidth: document.documentElement.clientWidth,
        isSmallScreen: !largerScreen.matches,
      });
      list.style.setProperty('--columns', `${columns}`);

      if (usesGridLanes) return;
      const items = [...list.children] as HTMLElement[];
      const spans = items.map(item => {
        const height = cardHeights.get(item);
        return height === undefined
          ? Number(item.style.getPropertyValue('--row-span'))
          : rowSpanFor(height);
      });
      items.forEach((item, i) => {
        item.style.setProperty('--row-span', `${spans[i]}`);
      });

      // On a new column count the cards haven't resized yet, so leave them to
      // CSS for a frame, then choose columns from their new heights
      if (columns !== columnCount) {
        columnCount = columns;
        lockedColumns = undefined;
        items.forEach(item => {
          item.style.removeProperty('grid-column');
          item.style.removeProperty('grid-row');
        });
        frame = requestAnimationFrame(update);
        return;
      }

      const locked = (lockedColumns ??= shortestColumns(spans, columns));

      const columnHeights = Array(columns).fill(0);
      items.forEach((item, i) => {
        const column = locked[i];
        // All of grid-row, as the stylesheet's `span` sits on the row start
        item.style.setProperty('grid-column', `${column + 1}`);
        item.style.setProperty(
          'grid-row',
          `${columnHeights[column] + 1} / span ${spans[i]}`
        );
        columnHeights[column] += spans[i];
      });
    };

    const observer = new ResizeObserver(entries => {
      entries.forEach(entry => {
        if (entry.target === list) return;
        const item = entry.target.closest('li');
        const height =
          entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
        if (item) cardHeights.set(item, height);
      });
      if (frame === undefined) frame = requestAnimationFrame(update);
    });

    observer.observe(list);
    if (!usesGridLanes) {
      list.querySelectorAll('li > a').forEach(card => observer.observe(card));
    }

    return () => {
      observer.disconnect();
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, [images]);
};

export type Props = {
  images: Image[];
  onImageSelect: (image: Image) => void;
  /** The image open in the sidebar, which is marked in the grid. */
  selectedImageId?: string;
};

const CatalogueImageGalleryMasonry: FunctionComponent<Props> = ({
  images,
  onImageSelect,
  selectedImageId,
}) => {
  const { isEnhanced } = useAppContext();
  const listRef = useRef<HTMLUListElement>(null);
  useMasonryLayout(listRef, images);

  return (
    <MasonryContainer>
      <MasonryList ref={listRef} data-testid="image-search-results-container">
        {images.map((image, index) => {
          const isSelected = image.id === selectedImageId;
          const aspectRatio = displayAspectRatio(image);
          const rgb = image.averageColor && hexToRgb(image.averageColor);
          const iiifUrl = image.locations[0].url;
          // Choosing the image that's open in the sidebar closes it
          const tooltip = isSelected
            ? 'Close image details'
            : 'Open image details';

          return (
            <li
              key={image.id}
              style={{ '--row-span': estimateRowSpan(image) } as CSSProperties}
            >
              <CardLink
                {...toWorksImagesLink({
                  id: image.id,
                  workId: image.source.id,
                })}
                id={image.id}
                $isSelected={isSelected}
                aria-current={isSelected ? 'true' : undefined}
                title={isEnhanced ? tooltip : undefined}
                onClick={event => {
                  event.preventDefault();
                  onImageSelect(image);
                }}
                {...dataGtmPropsToAttributes({
                  trigger: 'open_image_modal',
                  'position-in-list': `${index + 1}`,
                })}
              >
                <Thumbnail
                  style={{ aspectRatio }}
                  $background={rgb && `rgb(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`}
                >
                  <img
                    src={convertIiifImageUri(iiifUrl, 400)}
                    srcSet={`${convertIiifImageUri(iiifUrl, 400)} 400w, ${convertIiifImageUri(iiifUrl, 800)} 800w`}
                    // Fixed, as columns stay about this wide, so the image only
                    // depends on pixel density and never changes on resize
                    sizes="400px"
                    width={400}
                    height={Math.round(400 / aspectRatio)}
                    alt=""
                    loading={index < EAGER_IMAGE_COUNT ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </Thumbnail>
                <Title>
                  <WorkTitle title={image.source.title} />
                </Title>
              </CardLink>
            </li>
          );
        })}
      </MasonryList>
    </MasonryContainer>
  );
};

export default CatalogueImageGalleryMasonry;
