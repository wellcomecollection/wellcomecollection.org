import { RefObject, useEffect, useRef } from 'react';

import { ACTIVE_COOKIE_BANNER_ID } from '@weco/common/services/app/civic-uk';

// How long after an image is chosen the browser may still focus its thumbnail
const THUMBNAIL_FOCUS_WINDOW_MS = 500;

/**
 * Moves focus to the close button each time an image is chosen, as choosing an
 * image is asking for its details. Stepping to the previous or next image
 * leaves focus where it was (e.g. on the button that was used), so it can be
 * pressed again. If that was nowhere in particular, or it's gone (e.g. a
 * thumbnail from the last page of results), it goes to the step button for
 * that direction instead. The browser's Back and Forward are treated the same,
 * falling back to the close button.
 *
 * Returns a function to call once the person starts moving focus themselves,
 * so it's left alone from then on, and one to call when stepping.
 */
const useFocusCloseButtonOnSelect = (
  imageId: string | undefined,
  isFromUrlChange: boolean,
  closeButtonRef: RefObject<HTMLElement | null>
) => {
  const hasTakenOver = useRef(false);
  const steppedFrom = useRef<{
    focused: HTMLElement;
    stepButton: HTMLElement | null;
  } | null>(null);

  useEffect(() => {
    // A step that was cancelled (e.g. by closing straight away) never used it
    if (!imageId) {
      steppedFrom.current = null;
      return;
    }

    hasTakenOver.current = false;
    const active = document.activeElement;
    const step =
      steppedFrom.current ??
      (isFromUrlChange && active instanceof HTMLElement
        ? { focused: active, stepButton: closeButtonRef.current }
        : null);
    steppedFrom.current = null;

    // Worked out when it's needed, as the step may remove what had focus
    const target = () => {
      if (!step) return closeButtonRef.current;

      const { focused, stepButton } = step;
      return focused.isConnected && focused !== document.body
        ? focused
        : stepButton;
    };

    const focusTarget = () => {
      // Leave focus alone if the cookie banner is showing, as the modal does
      if (document.getElementById(ACTIVE_COOKIE_BANNER_ID)) return;

      // Without scrolling, as it may still be off screen, sliding in
      target()?.focus({ preventScroll: true });
    };

    // A step to another page of results waits on a fetch, so by the time it
    // lands focus may have been moved (e.g. into the search box). Only take it
    // back if it's still where the step left it, or has been lost.
    const focusTargetIfUnmoved = () => {
      const active = document.activeElement;
      const isUnmoved =
        !step || !active || active === document.body || active === step.focused;
      if (isUnmoved) focusTarget();
    };

    // Setting the image id as the URL hash can make the browser focus the
    // thumbnail with that id a moment later, after the timeout below has moved
    // focus. So if the thumbnail is focused shortly after, move focus back into
    // the sidebar. It's watched for on the document, as the grid laying out
    // again can remount the thumbnail.
    const onFocusIn = (event: FocusEvent) => {
      if (hasTakenOver.current) return;

      if ((event.target as HTMLElement).id === imageId) focusTarget();
    };
    const stopWatching = () =>
      document.removeEventListener('focusin', onFocusIn);

    document.addEventListener('focusin', onFocusIn);

    const timeouts = [
      setTimeout(focusTargetIfUnmoved),
      setTimeout(stopWatching, THUMBNAIL_FOCUS_WINDOW_MS),
    ];

    return () => {
      timeouts.forEach(clearTimeout);
      stopWatching();
    };
  }, [imageId]);

  return {
    stopRefocusing: () => {
      hasTakenOver.current = true;
    },
    setSteppedFrom: (focused: HTMLElement, stepButton: HTMLElement | null) => {
      steppedFrom.current = { focused, stepButton };
    },
  };
};

export default useFocusCloseButtonOnSelect;
