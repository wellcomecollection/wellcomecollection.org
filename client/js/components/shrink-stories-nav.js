import { featureTest } from '../util';
import throttle from 'lodash.throttle';

const shrinkStoriesNav = (el) => {
  if (featureTest('position', 'sticky')) {
    const hitTop = () => {
      if (document.readyState === 'complete') {
        const top = el.getBoundingClientRect().top;
        if (top === 0) {
          const scrollPosition = window.pageYOffset;
          el.classList.add('numbered-list--horizontal-narrow');
          document.body.scrollTop = scrollPosition;
        } else {
          const scrollPosition = window.pageYOffset;
          el.classList.remove('numbered-list--horizontal-narrow');
          document.body.scrollTop = scrollPosition;
        }
      }
    };

    window.addEventListener('scroll', throttle(hitTop, 100));
  }
};

export default shrinkStoriesNav;
