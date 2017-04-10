// Simplified/rewritten from https://github.com/leighmcculloch/gascrolldepth.js

import { onWindowScrollThrottleDebounce$ } from '../js/utils/dom-events';

const getDocumentHeight = () => {
  return Math.max(
    document.documentElement['scrollHeight'], document.body['scrollHeight'],
    document.documentElement['offsetHeight'], document.body['offsetHeight'],
    document.documentElement['clientHeight']
  );
};

const getWindowHeight = () => {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
};

const getPageYOffset = () => {
  return window.pageYOffset;
};

const sendEvent = (action, label) => {
  window.ga('send', {
    hitType: 'event',
    eventCategory: 'Scroll Depth',
    eventAction: action,
    eventLabel: label,
    eventValue: 1,
    eventNonInteraction: true
  });
};

const calculateMarks = (docHeight) => {
  return {
    '25%': parseInt(docHeight * 0.25, 10),
    '50%': parseInt(docHeight * 0.5, 10),
    '75%': parseInt(docHeight * 0.75, 10),
    '100%': docHeight - 5
  };
};

const cache = [];
const checkMarks = (marks, scrollDistance) => {
  Object.keys(marks).forEach((mark) => {
    const val = marks[mark];

    if (cache.indexOf(mark) === -1 && scrollDistance >= val) {
      cache.push(mark);
      sendEvent('Percentage', mark);
    }
  });
};

const handler = function() {
  const docHeight = getDocumentHeight();
  const winHeight = getWindowHeight();
  const scrollDistance = getPageYOffset() + winHeight;
  const marks = calculateMarks(docHeight);

  checkMarks(marks, scrollDistance);
};

const init = () => {
  onWindowScrollThrottleDebounce$.subscribe({
    next() {
      handler();
    }
  });
};

export default { init };
