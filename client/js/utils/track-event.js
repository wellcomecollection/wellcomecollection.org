/* global mixpanel */
function trackMixpanelEvent(e) {
  mixpanel.track(e.name, e.properties);
}

export function trackEvent(e) {
  trackMixpanelEvent(e);
}
