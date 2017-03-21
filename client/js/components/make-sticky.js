import {nodeList, featureTest} from '../util';
import debounce from 'lodash.debounce';
import { toObservable } from '../redux/store';

const initialPxFromTop = 15; // TODO: remove magic
const makeSticky = (els, store) => {
  if (!featureTest('position', 'sticky')) return;

  els = nodeList(els);

  const applyPositioning = () => {
    if (document.readyState !== 'complete') return;

    els.forEach((el) => {
      const isEnoughRoom = el.offsetHeight > (window.innerHeight - store.getState().stickyNav.height);

      el.classList[isEnoughRoom ? 'remove' : 'add']('sticky-applied');
    });
  };

  const updateStickyTops = () => {
    els.forEach((el) => {
      el.style.top = `${store.getState().stickyNav.height + initialPxFromTop}px`;
    });
  };

  document.addEventListener('readystatechange', applyPositioning);
  window.addEventListener('resize', debounce(applyPositioning, 500));
  window.addEventListener('orientationchange', applyPositioning);

  toObservable(store).subscribe({
    onNext: () => {
      updateStickyTops();
      applyPositioning();
    }
  });
};

export default makeSticky;
