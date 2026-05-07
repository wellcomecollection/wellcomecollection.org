import { useEffect, useId } from 'react';

import { getConsentState } from '@weco/common/services/app/civic-uk';

export type VideoProvider = 'YouTube' | 'Vimeo';

type UseVideoEmbedReturn = {
  isYouTube: boolean;
  isVimeo: boolean;
  videoSrc: string | undefined;
  videoId: string | undefined;
  uid: string;
};

const youTubeHosts = new Set([
  'www.youtube.com',
  'youtube.com',
  'youtu.be',
  'www.youtube-nocookie.com',
  'youtube-nocookie.com',
]);
const vimeoHosts = new Set(['vimeo.com', 'player.vimeo.com']);

const getHostname = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
};

const useVideoEmbed = (
  embedUrl: string,
  videoProvider?: VideoProvider
): UseVideoEmbedReturn => {
  const hasAnalyticsConsent = getConsentState('analytics');
  const hostname = getHostname(embedUrl);
  const isYouTube =
    videoProvider === 'YouTube' ||
    (!videoProvider && youTubeHosts.has(hostname));
  const isVimeo =
    videoProvider === 'Vimeo' || (!videoProvider && vimeoHosts.has(hostname));

  useEffect(() => {
    if (isYouTube && hasAnalyticsConsent) {
      const scriptId = 'youtube-iframe-api';
      if (document.getElementById(scriptId)) return;

      const s = document.createElement('script');
      s.id = scriptId;
      s.type = 'text/javascript';
      s.async = true;
      s.src = '//www.youtube.com/iframe_api';

      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode?.insertBefore(s, firstScript);
    }
  }, [isYouTube, hasAnalyticsConsent]);

  const uid = useId();
  const videoId = embedUrl.match(/embed\/(.*?)(?:\?|$)/)?.[1];

  const videoSrc = (() => {
    if (!isYouTube && !isVimeo) return undefined;
    try {
      const url = new URL(embedUrl);
      url.searchParams.set('autoplay', '1');
      if (isYouTube) {
        url.searchParams.set('enablejsapi', '1');
      } else if (!hasAnalyticsConsent) {
        url.searchParams.set('dnt', '1');
      }
      return url.toString();
    } catch {
      return undefined;
    }
  })();

  return { isYouTube, isVimeo, videoSrc, videoId, uid };
};

export default useVideoEmbed;
