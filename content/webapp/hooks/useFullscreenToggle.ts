import { RefObject, useEffect } from 'react';

type UseFullscreenToggleParams = {
  viewerRef: RefObject<HTMLDivElement | null> | undefined;
  setIsFullscreen: (isFullscreen: boolean) => void;
};

/**
 * Toggles fullscreen on viewerRef and keeps setIsFullscreen in sync - both
 * for our own toggle clicks and for fullscreen ending some other way
 * (Escape, F11, browser UI), via the native fullscreenchange event.
 * @param viewerRef - The element to request/exit fullscreen on.
 * @param setIsFullscreen - Context setter to keep in sync with the toggle.
 */
export default function useFullscreenToggle({
  viewerRef,
  setIsFullscreen,
}: UseFullscreenToggleParams): () => void {
  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(
        Boolean(
          document.fullscreenElement || document['webkitFullscreenElement']
        )
      );
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      );
    };
  }, [setIsFullscreen]);

  function toggleFullscreen() {
    if (!viewerRef?.current) return;

    const isCurrentlyFullscreen = Boolean(
      document.fullscreenElement || document['webkitFullscreenElement']
    );

    // Don't set isFullscreen here - requestFullscreen()/exitFullscreen() are
    // async and can be denied, in which case no fullscreenchange event
    // follows. handleFullscreenChange above is the sole source of truth.
    if (!isCurrentlyFullscreen) {
      if (viewerRef.current.requestFullscreen) {
        viewerRef.current.requestFullscreen().catch(() => undefined);
      } else if (viewerRef.current['webkitRequestFullscreen']) {
        viewerRef.current['webkitRequestFullscreen']();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => undefined);
      } else if (document['webkitExitFullscreen']) {
        document['webkitExitFullscreen']();
      }
    }
  }

  return toggleFullscreen;
}
