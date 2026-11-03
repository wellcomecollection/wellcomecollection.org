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

// How far the pointer can move and still be a click, not a drag
const CLICK_TOLERANCE_PX = 3;

// How long the layout's width has to stay the same before it's measured again
const MEASURE_DEBOUNCE_MS = 100;

const roundColumns = (columns: number) => Math.round(columns * 100) / 100;

// To one decimal place, for what's announced, so a change of half a column is
// still heard
const announcedColumns = (columns: number) => Math.round(columns * 10) / 10;

/**
 * Asks the browser how wide the sidebar is at 3, 4 and 12 columns, rather
 * than repeating the sums in its styles. 3 to 4 gives a column's width in px.
 * 12 columns never fits, so the sidebar stops at its max-width, which leaves
 * the results their minimum. Counting how many columns that width is gives
 * the most the sidebar can have. Puts the width back after.
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

type Measured = ReturnType<typeof measureColumns>;

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

  const drag = useRef<
    Measured & {
      // The pointer that started it, as another finger on the handle shouldn't
      // move or end it
      pointerId: number;
      startX: number;
      startColumns: number;
      // What's in state, to go back to if the drag is cancelled
      savedColumns: number;
      hasMoved: boolean;
      columns: number;
      frame?: number;
      listening: AbortController;
    }
  >(undefined);

  const setSidebarColumns = (n: number) =>
    sidebarRef.current?.style.setProperty(COLUMNS_PROPERTY, String(n));

  const measure = () => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const next = measureColumns(sidebar);
    setMeasured(next);

    return next;
  };

  const stopDragging = () => {
    const current = drag.current;
    if (!current) return;

    if (current.frame) cancelAnimationFrame(current.frame);
    current.listening.abort();
    drag.current = undefined;
    return current;
  };

  // Stops dragging and puts the width back to what's in state
  const cancelDrag = () => {
    const cancelled = stopDragging();
    if (cancelled) setSidebarColumns(cancelled.savedColumns);
  };

  // Measures again once the layout has stopped changing width, which a window
  // resize or the page's scrollbar coming and going can do
  useEffect(() => {
    measure();

    const layout = sidebarRef.current?.parentElement;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let lastWidth = layout?.clientWidth;
    const observer =
      layout && typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(([entry]) => {
            if (entry.contentRect.width === lastWidth) return;

            lastWidth = entry.contentRect.width;
            clearTimeout(timeout);
            timeout = setTimeout(measure, MEASURE_DEBOUNCE_MS);
          })
        : undefined;
    if (layout) observer?.observe(layout);

    return () => {
      observer?.disconnect();
      clearTimeout(timeout);
      // If the handle goes mid-drag (e.g. the sidebar going full screen), the
      // width goes back to what's in state
      cancelDrag();
    };
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    // One drag at a time, even with a mouse and a touch screen
    if (drag.current || !event.isPrimary || event.button !== 0) return;

    const next = measure();
    if (!next || next.columnPx <= 0) return;

    event.preventDefault();
    const handle = event.currentTarget;
    const { pointerId } = event;
    handle.setPointerCapture(pointerId);

    const listening = new AbortController();

    // Escape puts the width back rather than closing the sidebar, which the
    // results listen for, so it's caught first and marked as handled
    document.addEventListener(
      'keydown',
      keyEvent => {
        if (keyEvent.key !== 'Escape') return;

        keyEvent.preventDefault();
        keyEvent.stopPropagation();
        cancelDrag();
        if (handle.hasPointerCapture(pointerId)) {
          handle.releasePointerCapture(pointerId);
        }
      },
      { capture: true, signal: listening.signal }
    );

    // From what's shown, so a width that doesn't fit doesn't leave a stretch
    // of dragging where nothing moves
    const startColumns = clampColumns(columns, next.maxColumns);
    drag.current = {
      ...next,
      pointerId,
      startX: event.clientX,
      hasMoved: false,
      startColumns,
      savedColumns: columns,
      columns: startColumns,
      listening,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (current?.pointerId !== event.pointerId) return;

    current.hasMoved ||=
      Math.abs(event.clientX - current.startX) >= CLICK_TOLERANCE_PX;
    if (!current.hasMoved) return;

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

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointerId !== event.pointerId) return;

    const current = stopDragging();
    if (!current) return;
    if (!current.hasMoved) return;

    // To a hundredth, so the arrow keys then move to the nearest whole column
    const rounded = roundColumns(current.columns);
    setSidebarColumns(rounded);
    setColumns(rounded);
  };

  // Uses the stored maximum rather than measuring, since measuring lays the
  // page out three times and a held-down key repeats many times a second. The
  // stored one is kept current as the window resizes.
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
