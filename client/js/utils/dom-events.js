import fromEvent from 'xstream/extra/fromEvent';
import debounce from 'xstream/extra/debounce';

export const windowResize$ = fromEvent(window, 'resize').compose(debounce(500));
export const windowOrientationChange$ = fromEvent(window, 'orientationchange');
