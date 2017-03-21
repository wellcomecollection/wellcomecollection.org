import {nodeList, featureTest} from '../util';
import debounce from 'lodash.debounce';
import watch from 'redux-watch';

const initialPxFromTop = 15; // TODO: remove magic
const makeSticky = (els, store) => {
  if (!featureTest('position', 'sticky')) return;

  const elements = nodeList(els);

  const applyPositioning = () => {
    if (document.readyState !== 'complete') return;

    elements.forEach((el) => {
      const isEnoughRoom = el.offsetHeight > (window.innerHeight - store.getState().stickyNav.height);

      el.classList[isEnoughRoom ? 'remove' : 'add']('sticky-applied');
    });
  };

  const updateStickyTops = () => {
    elements.forEach((el) => {
      el.style.top = `${store.getState().stickyNav.height + initialPxFromTop}px`;
    });
  };

  document.addEventListener('readystatechange', applyPositioning);
  window.addEventListener('resize', debounce(applyPositioning, 500));
  window.addEventListener('orientationchange', applyPositioning);

  const watchNavHeight = watch(store.getState, 'stickyNav.height');

  store.subscribe(watchNavHeight(() => {
    updateStickyTops();
    applyPositioning();
  }));
};

export default makeSticky;
