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
    const firedMilestones = new Set<number>();
    const progressMilestones = [10, 25, 50, 75, 90];

    const trackEvent = (
      eventName: string,
      extraParams?: Record<string, unknown>
    ) => {
      gtag('event', eventName, {
        video_title: title,
        video_provider: 'Vimeo',
        ...extraParams,
      });
    };

    import('@vimeo/player').then(({ default: Player }) => {
      if (!isCurrent || !iframeRef.current) return;
      player = new Player(iframeRef.current);
      player.on('play', () => trackEvent('video_start'));
      player.on('pause', () => trackEvent('video_pause'));
      player.on('ended', () => trackEvent('video_complete'));
      player.on('timeupdate', ({ percent }) => {
        const percentComplete = percent * 100;
        for (const milestone of progressMilestones) {
          if (percentComplete >= milestone && !firedMilestones.has(milestone)) {
            firedMilestones.add(milestone);
            trackEvent('video_progress', { video_percent: milestone });
          }
        }
      });
    });

    return () => {
      isCurrent = false;
      player?.off('play');
      player?.off('pause');
      player?.off('ended');
      player?.off('timeupdate');
      player?.destroy().catch(() => undefined);
    };
  }, [isVimeo, hasAnalyticsConsent, activeIndex, title]);
}
