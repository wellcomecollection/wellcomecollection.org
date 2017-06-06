import { featureTest } from '../util';
import { setStickyNavHeight } from '../reducers/sticky-nav-height';
import { onWindowScrollThrottle$, onWindowScrollDebounce$ } from '../utils/dom-events';
import fastdom from '../utils/fastdom-promise';

const shrinkStoriesNav = (el, dispatch) => {
  if (!featureTest('position', 'sticky')) return;

  const elFromTop = fastdom.measure(() => {
    return el.offsetTop;
  });
  const elHeight = fastdom.measure(() => {
    return el.offsetHeight;
  });

  Promise.all([elFromTop, elHeight]).then(values => {
    const fromTop = values[0];
    const height = values[1];

    const getIsNarrow = () => {
      return el.classList.contains('numbered-list--horizontal-narrow');
    };
    const distanceScrolled = () => {
      return window.pageYOffset;
    };
    const isScrolledEnough = () => {
      return (distanceScrolled() > fromTop + height);
    };
    const setIsNarrow = (value) => {
      if (value && isScrolledEnough() && !getIsNarrow()) {
        el.classList.add('numbered-list--horizontal-narrow');

        dispatch(setStickyNavHeight(height));
      } else if (!value && getIsNarrow()) {
        el.classList.remove('numbered-list--horizontal-narrow');

        dispatch(setStickyNavHeight(height));
      }
    };

    onWindowScrollThrottle$.subscribe({
      next: () => setIsNarrow(distanceScrolled() > fromTop)
    });

    onWindowScrollDebounce$.subscribe({
      next: () => setIsNarrow(distanceScrolled() > fromTop)
    });

    dispatch(setStickyNavHeight(height));
  });
};

export default shrinkStoriesNav;
