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
const MEASURE_DELAY_MS = 100;

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

  // What's in state, to go back to if a drag is cancelled
  const savedColumns = useRef(columns);
  savedColumns.current = columns;

  const drag = useRef<
    Measured & {
      startX: number;
      startColumns: number;
      lastX: number;
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
    setMeasured(previous =>
      previous.columnPx === next.columnPx &&
      previous.maxColumns === next.maxColumns
        ? previous
        : next
    );

    // Carries on from where the pointer is, with the new measurements, unless
    // there's nothing to go on
    const current = drag.current;
    if (current && next.columnPx > 0) {
      Object.assign(current, next, {
        startX: current.lastX,
        startColumns: clampColumns(current.columns, next.maxColumns),
      });
    }

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

  // Measures again once the layout has stopped changing width, which a window
  // resize or the page's scrollbar coming and going can do. If the handle goes
  // mid-drag (e.g. the sidebar going full screen), the width goes back to what
  // was kept.
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
            timeout = setTimeout(measure, MEASURE_DELAY_MS);
          })
        : undefined;
    if (layout) observer?.observe(layout);

    return () => {
      observer?.disconnect();
      clearTimeout(timeout);
      if (stopDragging()) setSidebarColumns(savedColumns.current);
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
        if (stopDragging()) setSidebarColumns(savedColumns.current);
        if (handle.hasPointerCapture(pointerId)) {
          handle.releasePointerCapture(pointerId);
        }
      },
      { capture: true, signal: listening.signal }
    );

    // So text isn't selected as the pointer passes over it, with Safari's
    // prefixed property too
    const bodyStyle = document.body.style;
    const userSelect = ['user-select', '-webkit-user-select'].map(property => {
      const value = bodyStyle.getPropertyValue(property);
      bodyStyle.setProperty(property, 'none');
      return { property, value };
    });
    listening.signal.addEventListener('abort', () =>
      userSelect.forEach(({ property, value }) =>
        bodyStyle.setProperty(property, value)
      )
    );

    // From what's shown, so a width that doesn't fit doesn't leave a stretch
    // of dragging where nothing moves
    const startColumns = clampColumns(columns, next.maxColumns);
    drag.current = {
      ...next,
      startX: event.clientX,
      lastX: event.clientX,
      hasMoved: false,
      startColumns,
      columns: startColumns,
      listening,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current) return;

    // A wobble while clicking isn't a drag
    current.hasMoved ||=
      Math.abs(event.clientX - current.startX) >= CLICK_TOLERANCE_PX;
    current.lastX = event.clientX;
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

  // Also called when the handle loses the pointer without hearing it let go
  // (e.g. switching window mid-drag), so the drag doesn't carry on
  const endDrag = () => {
    const current = stopDragging();
    if (!current) return;

    // A click without moving keeps the width chosen, even if it doesn't fit
    if (!current.hasMoved) {
      setSidebarColumns(savedColumns.current);
      return;
    }

    // To a hundredth, so the arrow keys then move to the nearest whole column
    const rounded = roundColumns(current.columns);
    setSidebarColumns(rounded);
    setColumns(rounded);
  };

  // Uses the last measurement, kept up to date as the layout changes width, so
  // holding a key down doesn't lay the page out again for each repeat
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
