import { useState, SyntheticEvent } from 'react';

export const useAVTracking = (avType: 'audio' | 'video') => {
  const [didStart, setDidStart] = useState(false);
  const cachedSteps: Set<number> = new Set();
  const progressSteps = [10, 25, 50, 75, 90];

  const currentTimeKey = `${avType}_current_time`;
  const durationKey = `${avType}_duration`;
  const percentKey = `${avType}_percent`;
  const providerKey = `${avType}_provider`;
  const titleKey = `${avType}_title`;
  const urlKey = `${avType}_url`;

  function getParams(
    event: SyntheticEvent<HTMLMediaElement, Event>,
    cachedSteps: Set<number>
  ) {
    return {
      [currentTimeKey]: event.currentTarget.currentTime,
      [durationKey]: event.currentTarget.duration,
      [percentKey]: [...cachedSteps].pop(),
      [providerKey]: 'IIIF',
      [titleKey]: 'IIIF',
      [urlKey]: event.currentTarget.currentSrc,
    };
  }

  function trackPlay(event: SyntheticEvent<HTMLMediaElement, Event>) {
    if (didStart) return;

    gtag('event', `${avType}_start`, getParams(event, cachedSteps));

    setDidStart(true);
  }

  function trackEnded(event: SyntheticEvent<HTMLMediaElement, Event>) {
    gtag('event', `${avType}_complete`, getParams(event, cachedSteps));
    setDidStart(false);
  }

  function trackProgress(event: SyntheticEvent<HTMLMediaElement, Event>) {
    const currentTime = event.currentTarget.currentTime;
    const duration = event.currentTarget.duration;
    const percentComplete = (currentTime / duration) * 100;
    const currentPercent = progressSteps
      .filter(step => percentComplete >= step)
      .at(-1);

    if (currentPercent && !cachedSteps.has(currentPercent)) {
      gtag('event', `${avType}_progress`, getParams(event, cachedSteps));
      cachedSteps.add(currentPercent);
    }
  }

  return {
    trackPlay,
    trackEnded,
    trackProgress,
  };
};
