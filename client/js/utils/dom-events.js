import fromEvent from 'xstream/extra/fromEvent';
import debounce from 'xstream/extra/debounce';
import throttle from 'xstream/extra/throttle';

export const onWindowResize$ = fromEvent(window, 'resize').compose(debounce(500));
export const onWindowScroll$ = fromEvent(window, 'scroll').compose(throttle(100));
export const onWindowOrientationChange$ = fromEvent(window, 'orientationchange');
export const documentReadyState$ =
  fromEvent(document, 'readystatechange')
    .map(() => document.readyState)
    .startWith(document.readyState)
    .remember();
