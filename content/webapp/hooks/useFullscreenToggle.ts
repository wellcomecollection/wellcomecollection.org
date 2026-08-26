import { RefObject } from 'react';

type UseFullscreenToggleParams = {
  viewerRef: RefObject<HTMLDivElement | null> | undefined;
  setIsFullscreen: (isFullscreen: boolean) => void;
};

/**
 * Shared by ViewerTopBar and ViewerBottomBar, which both used to reimplement
 * this same request/exit fullscreen logic independently, and neither ever
 * wrote to the isFullscreen context value that already existed for it.
 *
 * Takes viewerRef/setIsFullscreen as params rather than reading
 * ItemViewerContext itself, so it isn't coupled to a particular context
 * module and stays easy to unit-test in isolation.
 *
 * Still checks document.fullscreenElement directly to decide whether to
 * request or exit, rather than trusting the stored isFullscreen value - so
 * this doesn't yet handle fullscreen being exited some other way (Escape key,
 * browser chrome), which would leave isFullscreen stale until next toggled
 * here. That's a known, deliberately deferred gap, not an oversight - closing
 * it will mean subscribing to the native fullscreenchange event with a
 * useEffect, which is the reason this is a hook (called at each component's
 * top level, like useIsFullscreenEnabled next to it) rather than a plain
 * helper function, even though it doesn't call any React hooks internally
 * yet.
 * @param viewerRef - The element to request/exit fullscreen on.
 * @param setIsFullscreen - Context setter to keep in sync with the toggle.
 */
export default function useFullscreenToggle({
  viewerRef,
  setIsFullscreen,
}: UseFullscreenToggleParams): () => void {
  function toggleFullscreen() {
    if (!viewerRef?.current) return;

    const isCurrentlyFullscreen = Boolean(
      document.fullscreenElement || document['webkitFullscreenElement']
    );

    if (!isCurrentlyFullscreen) {
      if (viewerRef.current.requestFullscreen) {
        viewerRef.current.requestFullscreen();
      } else if (viewerRef.current['webkitRequestFullscreen']) {
        viewerRef.current['webkitRequestFullscreen']();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document['webkitExitFullscreen']) {
        document['webkitExitFullscreen']();
      }
      setIsFullscreen(false);
    }
  }

  return toggleFullscreen;
}
