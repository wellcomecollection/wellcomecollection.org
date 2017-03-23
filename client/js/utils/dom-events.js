import fromEvent from 'xstream/extra/fromEvent';
import debounce from 'xstream/extra/debounce';
import throttle from 'xstream/extra/throttle';

export const windowResize$ = fromEvent(window, 'resize').compose(debounce(500));
export const windowScroll$ = fromEvent(window, 'scroll').compose(throttle(100));
export const windowOrientationChange$ = fromEvent(window, 'orientationchange');
