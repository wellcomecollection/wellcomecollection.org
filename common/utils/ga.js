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

export type GaEventV2 = {|
  eventCategory: string,
  eventAction: string,
  eventLabel: string,
|};

export function trackEvent(gaEvent: GaEvent) {
  ReactGA.event(gaEvent);
}

export function trackComponentAction(
  name: string,
  action: string,
  labels: { [key: string]: string }
) {
  trackEvent({
    category: 'component',
    action: `${name}:${action}`,
    label: Object.keys(labels)
      .map(key => {
        const val = labels[key];
        return `${key}:${val}`;
      })
      .join(', '),
  });
}
