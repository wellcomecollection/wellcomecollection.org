import ReactGA from 'react-ga';

export function trackIfOutboundLink(url: string) {
  const isExternal = new window.URL(url).host !== window.location.host;

  if (isExternal) {
    ReactGA.event({
      category: 'outbound',
      action: 'click',
      label: url,
      transport: 'beacon'
    });
  }
}

export type GaEvent = {|
  catagory: string,
  action: string,
  label: string
|}

export function trackEvent(gaEvent: GaEvent) {
  ReactGA.event(gaEvent);
}
