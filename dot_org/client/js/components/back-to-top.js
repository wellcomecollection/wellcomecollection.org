import {onWindowScrollThrottle$} from '../utils/dom-events';

const toggleClass = (el, className, value) => {
  el.classList.toggle(className, value);
};

const getVisibilityZoneStart = () => window.innerHeight;

const getCurrentScrollPosition = () => window.pageYOffset;

const getVisibilityZoneEnd = function(el) {
  return Math.abs(document.body.getBoundingClientRect().top) + el.parentNode.getBoundingClientRect().bottom - getVisibilityZoneStart();
};

const determineVisibility = (visibilityZoneStart, visibilityZoneEnd, currentScrollPosition) => {
  if (visibilityZoneStart < currentScrollPosition && currentScrollPosition < visibilityZoneEnd) {
    return true;
  } else {
    return false;
  }
};

const backToTop = (el, className) => {
  onWindowScrollThrottle$.subscribe({
    next() {
      toggleClass(el, className, determineVisibility(getVisibilityZoneStart(), getVisibilityZoneEnd(el), getCurrentScrollPosition()));
    }
  });
};

export default backToTop;
