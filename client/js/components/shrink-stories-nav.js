import { featureTest } from '../util';
import { setStickyNavHeight } from '../reducers/sticky-nav-height';
import { onWindowScrollThrottle$, onWindowScrollDebounce$ } from '../utils/dom-events';

const shrinkStoriesNav = (el, dispatch) => {
  if (!featureTest('position', 'sticky')) return;

  const getIsNarrow = () => {
    return el.classList.contains('numbered-list--horizontal-narrow');
  };
  const elFromTop = el.offsetTop;
  const elHeight = el.offsetHeight;
  const distanceScrolled = () => {
    return window.pageYOffset;
  };
  const isScrolledEnough = () => {
    return (distanceScrolled() > elFromTop + elHeight);
  };
  const setIsNarrow = (value) => {
    if (value && isScrolledEnough() && !getIsNarrow()) {
      el.classList.add('numbered-list--horizontal-narrow');

      dispatch(setStickyNavHeight(el.offsetHeight));
    } else if (!value && getIsNarrow()) {
      el.classList.remove('numbered-list--horizontal-narrow');

      dispatch(setStickyNavHeight(el.offsetHeight));
    }
  };

  onWindowScrollThrottle$.subscribe({
    next: () => setIsNarrow(distanceScrolled() > elFromTop)
  });

  onWindowScrollDebounce$.subscribe({
    next: () => setIsNarrow(distanceScrolled() > elFromTop)
  });

  dispatch(setStickyNavHeight(el.offsetHeight));
};

export default shrinkStoriesNav;
