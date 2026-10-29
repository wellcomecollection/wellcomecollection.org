import {
  FunctionComponent,
  KeyboardEvent,
  PointerEvent,
  Ref,
  RefObject,
  useEffect,
  useRef,
} from 'react';

import { containerPadding, sizes } from '@weco/common/views/themes/config';

import {
  GRID_COLUMNS,
  ResizeHandle,
  SIDEBAR_COLUMNS,
} from './ImageSidebar.styles';

export const COLUMNS_PROPERTY = '--sidebar-columns';

const clampColumns = (columns: number) =>
  Math.min(SIDEBAR_COLUMNS.max, Math.max(SIDEBAR_COLUMNS.min, columns));

const toPx = (length: string) =>
  length.endsWith('rem')
    ? parseFloat(length) *
      parseFloat(getComputedStyle(document.documentElement).fontSize)
    : parseFloat(length);

/**
 * The width of a grid column in px, for the layout the sidebar is in. This
 * follows the sidebar's width in its styles, which is worked out in CSS.
 */
const getColumnPx = (layoutWidth: number) => {
  const edge =
    Math.max(0, (layoutWidth - toPx(sizes.lg)) / 2) +
    (layoutWidth * parseFloat(containerPadding)) / 100;
  return (layoutWidth - 2 * edge) / GRID_COLUMNS;
};

type Props = {
  ref?: Ref<HTMLDivElement>;
  sidebarRef: RefObject<HTMLElement | null>;
  sidebarId: string;
  columns: number;
  setColumns: (columns: number) => void;
};

/**
 * Drags the boundary between the results and the sidebar to resize them, or
 * moves it a column at a time with the arrow keys.
 *
 * While dragging, the width is set straight on the sidebar, once a frame, so
 * nothing re-renders but the results laying out again. It's kept in state
 * once the drag ends.
 */
const ImageSidebarResizeHandle: FunctionComponent<Props> = ({
  ref,
  sidebarRef,
  sidebarId,
  columns,
  setColumns,
}) => {
  const drag = useRef<{
    startX: number;
    startColumns: number;
    columnPx: number;
    columns: number;
    frame?: number;
  }>(undefined);

  useEffect(
    () => () => {
      if (drag.current?.frame) cancelAnimationFrame(drag.current.frame);
    },
    []
  );

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const layout = sidebarRef.current?.parentElement;
    if (!event.isPrimary || event.button !== 0 || !layout) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    drag.current = {
      startX: event.clientX,
      startColumns: columns,
      columnPx: getColumnPx(layout.clientWidth),
      columns,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current) return;

    current.columns = clampColumns(
      current.startColumns - (event.clientX - current.startX) / current.columnPx
    );

    if (current.frame) return;
    current.frame = requestAnimationFrame(() => {
      current.frame = undefined;
      sidebarRef.current?.style.setProperty(
        COLUMNS_PROPERTY,
        String(current.columns)
      );
    });
  };

  const endDrag = () => {
    const current = drag.current;
    if (!current) return;

    if (current.frame) cancelAnimationFrame(current.frame);
    sidebarRef.current?.style.setProperty(
      COLUMNS_PROPERTY,
      String(current.columns)
    );
    drag.current = undefined;
    // To a hundredth, so the arrow keys then move to the nearest whole column
    setColumns(Math.round(current.columns * 100) / 100);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const nextColumns = {
      ArrowLeft: Math.floor(columns) + 1,
      ArrowRight: Math.ceil(columns) - 1,
      Home: SIDEBAR_COLUMNS.min,
      End: SIDEBAR_COLUMNS.max,
    }[event.key];
    if (nextColumns === undefined) return;

    event.preventDefault();
    setColumns(clampColumns(nextColumns));
  };

  return (
    <ResizeHandle
      ref={ref}
      role="separator"
      tabIndex={0}
      aria-label="Resize image details"
      aria-orientation="vertical"
      aria-controls={sidebarId}
      aria-valuenow={Math.round(columns)}
      aria-valuemin={SIDEBAR_COLUMNS.min}
      aria-valuemax={SIDEBAR_COLUMNS.max}
      aria-valuetext={`${Math.round(columns)} of ${GRID_COLUMNS} columns`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
    />
  );
};

export default ImageSidebarResizeHandle;
