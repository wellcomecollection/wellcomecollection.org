import { featureTest } from '../util';
import throttle from 'lodash.throttle';

const shrinkStoriesNav = (el) => {
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
    } else if (!value && getIsNarrow()) {
      el.classList.remove('numbered-list--horizontal-narrow');
    }
  };

  window.addEventListener('scroll', throttle(() => {
    if (!document.readyState === 'complete') return;

    setIsNarrow(distanceScrolled() > elFromTop);
  }, 100));
};

export default shrinkStoriesNav;
