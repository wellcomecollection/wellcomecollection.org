// @flow
import ReactGA from 'react-ga';

export type GaEvent = {|
  category: string,
  action: string,
  label?: string,
  value?: number,
  nonInteraction?: boolean,
  transport?: 'beacon',
|};

export function trackEvent(gaEvent: GaEvent) {
  ReactGA.event(gaEvent);
}
