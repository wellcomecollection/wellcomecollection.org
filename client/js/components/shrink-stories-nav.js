import { featureTest } from '../util';
import throttle from 'lodash.throttle';

const shrinkStoriesNav = (el, store) => {
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
      store.dispatch({type: 'UPDATE_STICKY_NAV_HEIGHT', value: el.offsetHeight});
    } else if (!value && getIsNarrow()) {
      el.classList.remove('numbered-list--horizontal-narrow');
      store.dispatch({type: 'UPDATE_STICKY_NAV_HEIGHT', value: el.offsetHeight});
    }
  };

  window.addEventListener('scroll', throttle(() => {
    if (!document.readyState === 'complete') return;

    setIsNarrow(distanceScrolled() > elFromTop);
  }, 100));
  store.dispatch({type: 'UPDATE_STICKY_NAV_HEIGHT', value: el.offsetHeight});
};

export default shrinkStoriesNav;
