import { useState, SyntheticEvent } from 'react';

export const useAVTracking = (avType: 'audio' | 'video') => {
  const [didStart, setDidStart] = useState(false);
  const [cachedSteps, setCachedSteps] = useState<Set<number>>(new Set());
  const progressSteps = [10, 25, 50, 75, 90];

  const currentTimeKey = `${avType}_current_time`;
  const durationKey = `${avType}_duration`;
  const percentKey = `${avType}_percent`;
  const providerKey = `${avType}_provider`;
  const titleKey = `${avType}_title`;
  const urlKey = `${avType}_url`;

  function getParams(event: SyntheticEvent<HTMLMediaElement, Event>) {
    const src = event.currentTarget.currentSrc;
    const host = new URL(src).host;

    return {
      [currentTimeKey]: event.currentTarget.currentTime,
      [durationKey]: event.currentTarget.duration,
      [percentKey]: [...cachedSteps].at(-1),
      [providerKey]: host,
      [titleKey]: host,
      [urlKey]: src,
    };
  }

  function trackPlay(event: SyntheticEvent<HTMLMediaElement, Event>) {
    if (didStart) return;

    gtag('event', `${avType}_start`, getParams(event));

    setDidStart(true);
  }

  function trackEnded(event: SyntheticEvent<HTMLMediaElement, Event>) {
    gtag('event', `${avType}_complete`, getParams(event));
    setDidStart(false);
    setCachedSteps(new Set());
  }

  function trackTimeUpdate(event: SyntheticEvent<HTMLMediaElement, Event>) {
    const currentTime = event.currentTarget.currentTime;
    const duration = event.currentTarget.duration;
    const percentComplete = (currentTime / duration) * 100;
    const currentPercent =
      progressSteps.filter(step => percentComplete >= step).at(-1) || 0;

    if (!cachedSteps.has(currentPercent)) {
      cachedSteps.add(currentPercent);
      setCachedSteps(cachedSteps);
      gtag('event', `${avType}_progress`, getParams(event));
    }
  }

  return {
    trackPlay,
    trackEnded,
    trackTimeUpdate,
  };
};
