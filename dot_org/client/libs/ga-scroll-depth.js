// Simplified/rewritten from https://github.com/leighmcculloch/gascrolldepth.js
import { getWindowHeight } from '../js/util';
import { onWindowScrollDebounce$ } from '../js/utils/dom-events';

const startTime = new Date().getTime();
const getElHeight = el => el.offsetHeight + el.offsetTop;

const maybeSendEvent = (hasAnalytics) => {
  if (hasAnalytics) {
    const actuallySendEvent = (distance, timing) => {
      window.ga('send', {
        hitType: 'event',
        eventCategory: 'Scroll Depth',
        eventAction: 'Percentage',
        eventLabel: distance,
        eventValue: 1,
        eventNonInteraction: true
      });

      window.ga('send', {
        hitType: 'timing',
        timingCategory: 'Scroll Timing',
        timingVar: `Scrolled ${distance}`,
        timingValue: timing
      });
    };
    return actuallySendEvent;
  } else {
    const noop = () => {};
    return noop;
  }
};

const sendEvent = maybeSendEvent(window.ga);

const calculateMarks = (elHeight) => {
  return {
    '25%': parseInt(elHeight * 0.25, 10),
    '50%': parseInt(elHeight * 0.5, 10),
    '75%': parseInt(elHeight * 0.75, 10),
    '100%': elHeight
  };
};

const cache = [];
const checkMarks = (marks, scrollDistance, timing) => {
  Object.keys(marks).forEach((mark) => {
    const val = marks[mark];

    if (cache.indexOf(mark) === -1 && scrollDistance >= val) {
      cache.push(mark);
      sendEvent(mark, timing);
    }
  });
};

const handler = function(el) {
  const timing = new Date().getTime() - startTime;
  const elHeight = getElHeight(el);
  const winHeight = getWindowHeight();
  const scrollDistance = window.pageYOffset + winHeight;
  const marks = calculateMarks(elHeight);

  checkMarks(marks, scrollDistance, timing);
};

export default (el) => {
  onWindowScrollDebounce$.subscribe({
    next() {
      handler(el);
    }
  });
};
