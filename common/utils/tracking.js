/* global ga */

const maybeTrackEvent = (hasAnalytics) => {
  if (hasAnalytics) {
    const actuallyTrackEvent = ({category, action, label}) => {
      ga('send', {
        hitType: 'event',
        eventCategory: category,
        eventAction: action,
        eventLabel: label
      });
    };
    return actuallyTrackEvent;
  } else {
    const noop = () => {};
    return noop;
  }
};

export const trackGaEvent = maybeTrackEvent(typeof window !== 'undefined' && window && window.ga);
