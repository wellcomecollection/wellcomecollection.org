import fromEvent from 'xstream/extra/fromEvent';
import debounce from 'xstream/extra/debounce';
import throttle from 'xstream/extra/throttle';
import xs from 'xstream';

export const onWindowResizeDebounce$ = fromEvent(window, 'resize').compose(debounce(500));
export const onWindowScrollThrottle$ = fromEvent(window, 'scroll').compose(throttle(100));
export const onWindowScrollDebounce$ = fromEvent(window, 'scroll').compose(debounce(500));
export const onWindowScrollThrottleDebounce$ = xs.merge(onWindowScrollThrottle$, onWindowScrollDebounce$);
export const onWindowOrientationChange$ = fromEvent(window, 'orientationchange');
export const documentReadyState$ =
  fromEvent(document, 'readystatechange')
    .map(() => document.readyState)
    .startWith(document.readyState)
    .remember();
