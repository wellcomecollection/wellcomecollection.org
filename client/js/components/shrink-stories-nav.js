import { featureTest } from '../util';
import { setStickyNavHeight } from '../reducers/sticky-nav-height';
import { onWindowScrollThrottle$, onWindowScrollDebounce$ } from '../utils/dom-events';
import fastdom from '../utils/fastdom-promise';

const shrinkStoriesNav = async (el, dispatch) => {
  if (!featureTest('position', 'sticky')) return;

  const getIsNarrow = () => {
    return el.classList.contains('numbered-list--horizontal-narrow');
  };
  const elFromTop = await fastdom.measure(() => {
    return el.offsetTop;
  });
  const elHeight = await fastdom.measure(() => {
    return el.offsetHeight;
  });
  const distanceScrolled = () => {
    return window.pageYOffset;
  };
  const isScrolledEnough = () => {
    return (distanceScrolled() > elFromTop + elHeight);
  };
  const setIsNarrow = (value) => {
    if (value && isScrolledEnough() && !getIsNarrow()) {
      el.classList.add('numbered-list--horizontal-narrow');

      dispatch(setStickyNavHeight(elHeight));
    } else if (!value && getIsNarrow()) {
      el.classList.remove('numbered-list--horizontal-narrow');

      dispatch(setStickyNavHeight(elHeight));
    }
  };

  onWindowScrollThrottle$.subscribe({
    next: () => setIsNarrow(distanceScrolled() > elFromTop)
  });

  onWindowScrollDebounce$.subscribe({
    next: () => setIsNarrow(distanceScrolled() > elFromTop)
  });

  dispatch(setStickyNavHeight(elHeight));
};

export default shrinkStoriesNav;
