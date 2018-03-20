/* global ga */
// @flow
type GaEvent = {|
  category: string,
  action: string,
  label: string
|};

const maybeTrackEvent = (hasAnalytics) => {
  if (hasAnalytics) {
    const actuallyTrackEvent = ({ category, action, label }: GaEvent) => {
      // $FlowFixMe
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
