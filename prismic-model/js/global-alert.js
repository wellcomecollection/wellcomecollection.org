// @flow
import structuredText from './parts/structured-text';
import select from './parts/select';
import text from './parts/text';

const GlobalAlert = {
  "Global alert": {
    text: structuredText('text', 'multi', ['heading2'], 'text'),
    isShown: select('Display', [
      'hide',
      'show',
    ], 'hide', 'Show or hide'),
    routeRegex: text('Write a pipe-separated (|) list of page paths here if you only want the alert to display on certain pages. Leave empty if you want the alert to appear on all pages.', 'path(s) to match'),
  },
};

export default GlobalAlert;
