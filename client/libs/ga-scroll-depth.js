// Simplified/rewritten from https://github.com/leighmcculloch/gascrolldepth.js

import { onWindowScrollDebounce$ } from '../js/utils/dom-events';
const startTime = new Date().getTime();
const mainEl = document.getElementById('main');
const getMainHeight = () => {
  return mainEl.offsetHeight + mainEl.offsetTop;
};

const getWindowHeight = () => {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
};

const getPageYOffset = () => {
  return window.pageYOffset;
};

const sendEvent = (action, label, timing) => {
  window.ga('send', {
    hitType: 'event',
    eventCategory: 'Scroll Depth',
    eventAction: action,
    eventTiming: timing,
    eventLabel: label,
    eventValue: 1,
    eventNonInteraction: true
  });
};

const calculateMarks = (mainHeight) => {
  return {
    '25%': parseInt(mainHeight * 0.25, 10),
    '50%': parseInt(mainHeight * 0.5, 10),
    '75%': parseInt(mainHeight * 0.75, 10),
    '100%': mainHeight
  };
};

const cache = [];
const checkMarks = (marks, scrollDistance, timing) => {
  Object.keys(marks).forEach((mark) => {
    const val = marks[mark];

    if (cache.indexOf(mark) === -1 && scrollDistance >= val) {
      cache.push(mark);
      console.log(mark, timing);
      // sendEvent('Percentage', mark, timing);
    }
  });
};

const handler = function() {
  const timing = Math.floor((new Date().getTime() - startTime) / 1000);
  const mainHeight = getMainHeight();
  const winHeight = getWindowHeight();
  const scrollDistance = getPageYOffset() + winHeight;
  const marks = calculateMarks(mainHeight);

  checkMarks(marks, scrollDistance, timing);
};

const init = () => {
  onWindowScrollDebounce$.subscribe({
    next() {
      if (!mainEl) return;

      handler();
    }
  });
};

export default { init };
