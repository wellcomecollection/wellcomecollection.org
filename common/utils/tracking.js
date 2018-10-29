/* global ga */
// @flow
type GaEvent = {|
  category: string,
  action: string,
  label: string
|};

export const trackGaEvent = ({ category, action, label }: GaEvent) => {
  if (typeof window !== 'undefined' && window && window.ga) {
    // $FlowFixMe
    ga('send', {
      hitType: 'event',
      eventCategory: category,
      eventAction: action,
      eventLabel: label
    });
  }
};
