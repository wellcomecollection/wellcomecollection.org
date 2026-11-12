import { theme as designSystemTheme } from '@wellcometrust/wellcome-design-system/theme';

import { remToPx } from '@weco/common/utils/rem-to-px';
import {
  containerPadding,
  sizes,
  themeValues,
} from '@weco/common/views/themes/config';
import { Image } from '@weco/content/services/wellcome/catalogue/types';

// Until browsers support `display: grid-lanes`, the grid has short fixed rows
// and each card spans enough of them to fit
export const ROW_HEIGHT = 4;
export const GAP = remToPx(themeValues.spacingUnits['300']);
export const CARD_PADDING = themeValues.spacingUnits['150'];
export const TITLE_SPACE = 'xs';

// In rem, so column sizes scale with the user's font size like the page does
const PAGE_MAX_WIDTH_REM = parseFloat(sizes.lg);
const PAGE_PADDING = parseFloat(containerPadding) / 100;

// Each column aims to cover 3 of the page grid's columns: 4 across the 12 on
// larger screens, 2 across the 6 on small ones
const GRID_COLUMNS_SPANNED = 3;
const COLUMNS_ACROSS_PAGE =
  Number(designSystemTheme.grid.columns.sm) / GRID_COLUMNS_SPANNED;
const SMALL_SCREEN_COLUMNS =
  Number(designSystemTheme.grid.columns.default) / GRID_COLUMNS_SPANNED;
// Beyond any real screen width (a 12th column needs a window around 4,000px)
const MAX_COLUMNS = 12;

// The server can't know the real column count, so images in the first two rows
// at the default count load straight away and the rest load as they're needed
export const EAGER_IMAGE_COUNT = 2 * COLUMNS_ACROSS_PAGE;

// Very tall images are capped at 2.5 times the column width
const MIN_ASPECT_RATIO = 0.4;

export const displayAspectRatio = (image: Image): number =>
  Math.max(image.aspectRatio || 1, MIN_ASPECT_RATIO);

/** The number of rows a card of this height (in px) needs, gap included. */
export const rowSpanFor = (height: number): number =>
  Math.ceil((height + GAP) / ROW_HEIGHT);

// The server doesn't know the viewport, so it assumes the widest page grid with
// 4 columns. In the browser the real heights replace these once the page loads.
const ASSUMED_COLUMN_WIDTH =
  (remToPx(sizes.lg) * (1 - 2 * PAGE_PADDING) -
    (COLUMNS_ACROSS_PAGE - 1) * GAP) /
  COLUMNS_ACROSS_PAGE;
const TITLE_LINE_HEIGHT = 21;
const TITLE_CHARS_PER_LINE = 34;
export const TITLE_MAX_LINES = 3;

export const estimateRowSpan = (image: Image): number => {
  const titleLines = Math.min(
    TITLE_MAX_LINES,
    Math.ceil((image.source.title?.length || 1) / TITLE_CHARS_PER_LINE)
  );
  const padding = remToPx(CARD_PADDING);
  const height =
    (ASSUMED_COLUMN_WIDTH - 2 * padding) / displayAspectRatio(image) +
    remToPx(themeValues.getSpaceValue(TITLE_SPACE, 'md')) +
    titleLines * TITLE_LINE_HEIGHT +
    2 * padding;

  return rowSpanFor(height);
};

/**
 * Which column each card goes in: the shortest one so far, leftmost if tied.
 * The same as CSS grid's own placement for cards that span one column, so
 * locking these in doesn't move anything.
 */
export const shortestColumns = (spans: number[], columns: number): number[] => {
  const heights = Array(columns).fill(0);
  return spans.map(span => {
    const column = heights.indexOf(Math.min(...heights));
    heights[column] += span;
    return column;
  });
};

/**
 * Columns aim to be 3/12 of the page grid (the page less its 5% padding either
 * side) wide. Past the page's maximum width that stays the same, so wider
 * screens get more columns rather than wider ones.
 */
const targetColumnWidthFor = (viewportWidthRem: number): number =>
  (Math.min(viewportWidthRem, PAGE_MAX_WIDTH_REM) * (1 - 2 * PAGE_PADDING)) /
  COLUMNS_ACROSS_PAGE;

/**
 * As many columns of about the target width as fit, stretched to fill the space
 * the sidebar leaves. Narrow screens always have 2.
 */
export const columnCountFor = ({
  gridWidth,
  viewportWidth,
  rootFontSize,
  isSmallScreen,
}: {
  gridWidth: number;
  viewportWidth: number;
  rootFontSize: number;
  isSmallScreen: boolean;
}): number => {
  if (isSmallScreen) return SMALL_SCREEN_COLUMNS;

  const target = targetColumnWidthFor(viewportWidth / rootFontSize);
  return Math.max(1, Math.round(gridWidth / rootFontSize / target));
};

/**
 * The grid widths (in rem) at which a 5th, 6th... column fits, so CSS can match
 * `columnCountFor` before JS runs, and without it. Only grids wider than the
 * page grid get there, so the target is the one for wide screens.
 */
export const extraColumnBreakpoints = (): [number, number][] => {
  const target = targetColumnWidthFor(PAGE_MAX_WIDTH_REM);
  const breakpoints: [number, number][] = [];
  for (
    let columns = COLUMNS_ACROSS_PAGE + 1;
    columns <= MAX_COLUMNS;
    columns++
  ) {
    breakpoints.push([columns, (columns - 0.5) * target]);
  }
  return breakpoints;
};
