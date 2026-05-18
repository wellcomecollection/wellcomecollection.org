import { RefObject, useEffect } from 'react';

import { getConsentState } from '@weco/common/services/app/civic-uk';

type Options = {
  iframeRef: RefObject<HTMLIFrameElement | null>;
  activeIndex: number | null;
  title?: string;
  isVimeo: boolean;
};

export function useVimeoTracking({
  iframeRef,
  activeIndex,
  title,
  isVimeo,
}: Options): void {
  const hasAnalyticsConsent = getConsentState('analytics');

  useEffect(() => {
    if (
      !isVimeo ||
      !hasAnalyticsConsent ||
      activeIndex === null ||
      !iframeRef.current
    ) {
      return;
    }

    let isCurrent = true;
    let player: import('@vimeo/player').default | undefined;

    const trackEvent = (eventName: string) => {
      gtag('event', eventName, {
        video_title: title,
        video_provider: 'Vimeo',
      });
    };

    import('@vimeo/player').then(({ default: Player }) => {
      if (!isCurrent || !iframeRef.current) return;
      player = new Player(iframeRef.current);
      player.on('play', () => trackEvent('video_start'));
      player.on('pause', () => trackEvent('video_pause'));
      player.on('ended', () => trackEvent('video_complete'));
    });

    return () => {
      isCurrent = false;
      player?.off('play');
      player?.off('pause');
      player?.off('ended');
      player?.destroy().catch(() => undefined);
    };
  }, [isVimeo, hasAnalyticsConsent, activeIndex, title]);
}
