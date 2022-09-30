import ReactGA, { EventArgs as GaEvent } from 'react-ga';

// TODO this wrapper function is redundant but pervasive; consider getting rid of it
export function trackEvent(gaEvent: GaEvent): void {
  ReactGA.event(gaEvent);
}

export type { GaEvent };
