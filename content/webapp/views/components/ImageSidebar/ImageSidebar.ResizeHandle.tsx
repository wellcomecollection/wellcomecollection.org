import {
  Dispatch,
  FunctionComponent,
  KeyboardEvent,
  PointerEvent,
  Ref,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  GRID_COLUMNS,
  ResizeHandle,
  SIDEBAR_COLUMNS,
} from './ImageSidebar.styles';

export const COLUMNS_PROPERTY = '--sidebar-columns';

const roundColumns = (columns: number) => Math.round(columns * 100) / 100;

// To one decimal place, for what's announced, so a change of half a column is
// still heard
const announcedColumns = (columns: number) => Math.round(columns * 10) / 10;

/**
 * Measures the sidebar at a few widths, rather than repeating the sums in its
 * styles: its two narrowest give the width of a column, and its widest, which
 * its max-width stops short of the results' minimum, gives the most columns
 * it can cover. Puts its width back as it was afterwards.
 */
const measureColumns = (sidebar: HTMLElement) => {
  const current = sidebar.style.getPropertyValue(COLUMNS_PROPERTY);
  const widthAt = (n: number) => {
    sidebar.style.setProperty(COLUMNS_PROPERTY, String(n));
    return sidebar.getBoundingClientRect().width;
  };
  const minWidth = widthAt(SIDEBAR_COLUMNS.min);
  const columnPx = widthAt(SIDEBAR_COLUMNS.min + 1) - minWidth;
  const widestWidth = widthAt(GRID_COLUMNS);
  sidebar.style.setProperty(COLUMNS_PROPERTY, current);

  // Not laid out, so there's nothing to go on
  if (columnPx <= 0) return { columnPx, maxColumns: SIDEBAR_COLUMNS.max };

  const maxColumns = Math.min(
    SIDEBAR_COLUMNS.max,
    Math.max(
      SIDEBAR_COLUMNS.min,
      SIDEBAR_COLUMNS.min + (widestWidth - minWidth) / columnPx
    )
  );

  return { columnPx, maxColumns };
};

const clampColumns = (columns: number, maxColumns: number) =>
  Math.min(maxColumns, Math.max(SIDEBAR_COLUMNS.min, columns));

type Props = {
  ref?: Ref<HTMLDivElement>;
  sidebarRef: RefObject<HTMLElement | null>;
  sidebarId: string;
  columns: number;
  setColumns: Dispatch<SetStateAction<number>>;
};

/**
 * Drags the boundary between the results and the sidebar to resize them, or
 * moves it a column at a time with the arrow keys.
 *
 * While dragging, the width is set straight on the sidebar, once a frame, so
 * nothing re-renders but the results laying out again. It's kept in state
 * once the drag ends.
 *
 * The width chosen is kept even when the window is too narrow for it, so it
 * comes back when the window is wider again. What's shown and announced is
 * what fits.
 */
const ImageSidebarResizeHandle: FunctionComponent<Props> = ({
  ref,
  sidebarRef,
  sidebarId,
  columns,
  setColumns,
}) => {
  const [measured, setMeasured] = useState({
    columnPx: 0,
    maxColumns: SIDEBAR_COLUMNS.max,
  });
  const shownColumns = clampColumns(columns, measured.maxColumns);
  const drag = useRef<{
    startX: number;
    startColumns: number;
    columnPx: number;
    maxColumns: number;
    columns: number;
    frame?: number;
  }>(undefined);

  const measure = () => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const next = measureColumns(sidebar);
    setMeasured(next);
    return next;
  };

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);

    return () => {
      window.removeEventListener('resize', measure);
      if (drag.current?.frame) cancelAnimationFrame(drag.current.frame);
    };
  }, []);

  const setSidebarColumns = (n: number) =>
    sidebarRef.current?.style.setProperty(COLUMNS_PROPERTY, String(n));

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;

    const next = measure();
    if (!next || next.columnPx <= 0) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    // From what's shown, so a width that doesn't fit doesn't leave a stretch
    // of dragging where nothing moves
    const startColumns = clampColumns(columns, next.maxColumns);
    drag.current = {
      startX: event.clientX,
      startColumns,
      columns: startColumns,
      ...next,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current) return;

    // Dragging left makes the sidebar wider
    current.columns = clampColumns(
      current.startColumns -
        (event.clientX - current.startX) / current.columnPx,
      current.maxColumns
    );

    if (current.frame) return;
    current.frame = requestAnimationFrame(() => {
      current.frame = undefined;
      setSidebarColumns(current.columns);
    });
  };

  // Also called when the handle loses the pointer without hearing it let go
  // (e.g. switching window mid-drag), so the drag doesn't carry on
  const endDrag = () => {
    const current = drag.current;
    if (!current) return;

    if (current.frame) cancelAnimationFrame(current.frame);
    drag.current = undefined;

    // To a hundredth, so the arrow keys then move to the nearest whole column
    const rounded = roundColumns(current.columns);
    setSidebarColumns(rounded);
    setColumns(rounded);
  };

  // Uses the measurement from when the handle was focused, which the window
  // resizing also updates, so holding a key down doesn't lay the page out
  // again for each repeat
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const { maxColumns } = measured;
    const nextColumns: Record<string, number> = {
      ArrowLeft: Math.floor(shownColumns) + 1,
      ArrowRight: Math.ceil(shownColumns) - 1,
      Home: SIDEBAR_COLUMNS.min,
      End: maxColumns,
    };
    if (!(event.key in nextColumns)) return;

    event.preventDefault();
    setColumns(roundColumns(clampColumns(nextColumns[event.key], maxColumns)));
  };

  const announced = announcedColumns(shownColumns);

  return (
    <ResizeHandle
      ref={ref}
      role="separator"
      tabIndex={0}
      aria-label="Resize image details"
      aria-orientation="vertical"
      aria-controls={sidebarId}
      aria-valuenow={announced}
      aria-valuemin={SIDEBAR_COLUMNS.min}
      aria-valuemax={announcedColumns(measured.maxColumns)}
      aria-valuetext={`${announced} of ${GRID_COLUMNS} columns`}
      onFocus={measure}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
      onKeyDown={onKeyDown}
    />
  );
};

export default ImageSidebarResizeHandle;
