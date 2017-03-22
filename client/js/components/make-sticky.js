import {nodeList, featureTest} from '../util';
import dropRepeats from 'xstream/extra/dropRepeats';
import {windowOrientationChange$, windowResize$} from '../utils/dom-events';
import sampleCombine from 'xstream/extra/sampleCombine';

const initialPxFromTop = 15; // TODO: remove magic

const makeSticky = (els, store$) => {
  if (!featureTest('position', 'sticky')) return;

  const elements = nodeList(els);

  const applyPositioning = (stickyNavHeight) => {
    if (document.readyState !== 'complete') return;

    elements.forEach((el) => {
      const isEnoughRoom = el.offsetHeight > (window.innerHeight - stickyNavHeight);
      el.classList[isEnoughRoom ? 'remove' : 'add']('sticky-applied');
    });
  };

  const updateStickyTops = (stickyNavHeight) => {
    elements.forEach((el) => {
      el.style.top = `${stickyNavHeight + initialPxFromTop}px`;
    });
  };

  const stickyNavHeight$ = store$.map(state => state.stickyNavHeight).compose(dropRepeats());
  stickyNavHeight$.subscribe({
    next: (stickyNavHeight) => {
      updateStickyTops(stickyNavHeight);
      applyPositioning(stickyNavHeight);
    }
  });

  windowResize$.compose(sampleCombine(stickyNavHeight$)).subscribe({
    next: ([_, stickyNavHeight]) => applyPositioning(stickyNavHeight)
  });

  windowOrientationChange$.compose(sampleCombine(stickyNavHeight$)).subscribe({
    next: ([_, stickyNavHeight]) => applyPositioning(stickyNavHeight)
  });
};

export default makeSticky;
