import { FunctionComponent } from 'react';

import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext/refactored';

// The current canvas's position within the manifest - "3/48" - is shown in the
// top bar's page indicator, the bottom bar's canvas navigation, and as the
// fallback caption for an audio item with no label of its own. This module owns
// both where the two values come from and the format they're rendered in.

/**
 * The label in two pieces, split where the top bar needs an element boundary
 * so it can put a test id on the position alone. Callers either concatenate
 * them (useCanvasPositionLabel) or render them either side of that boundary
 * (CanvasPositionIndicator) - so this is the only place the format lives, and
 * changing it can't leave one of them behind.
 */
function useCanvasPositionParts(): { position: string; suffix: string } {
  const { query, totalCanvases } = useItemViewerContext();

  return { position: `${query.canvas}`, suffix: `/${totalCanvases}` };
}

/**
 * The current canvas's position as a plain string, e.g. "3/48", for the places
 * that need a value rather than markup - the audio player takes its fallback
 * title as a string prop.
 */
export function useCanvasPositionLabel(): string {
  const { position, suffix } = useCanvasPositionParts();

  return `${position}${suffix}`;
}

type Props = {
  /**
   * Applied to a span wrapping the position on its own, without the suffix.
   * Playwright asserts this element's exact text, so the two halves can't be
   * collapsed into a single node. Optional because only one indicator can
   * carry a given id - the top bar and bottom bar both render one, and a
   * shared id would match twice.
   */
  positionTestId?: string;
};

/**
 * The current canvas's position, for display. Reads the values off
 * ItemViewerContext rather than taking them as props, so callers can't
 * substitute a different source.
 */
const CanvasPositionIndicator: FunctionComponent<Props> = ({
  positionTestId,
}) => {
  const { position, suffix } = useCanvasPositionParts();

  return (
    <>
      <span data-testid={positionTestId}>{position}</span>
      {suffix}
    </>
  );
};

export default CanvasPositionIndicator;
