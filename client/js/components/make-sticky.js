import {nodeList, featureTest} from '../util';
import dropRepeats from 'xstream/extra/dropRepeats';
import {windowOrientationChange$, windowResize$, documentReadyState$} from '../utils/dom-events';
import sampleCombine from 'xstream/extra/sampleCombine';

const initialPxFromTop = 15; // TODO: remove magic

const makeSticky = (els, store$) => {
  if (!featureTest('position', 'sticky')) return;

  const elements = nodeList(els);

  const applyPositioning = (stickyNavHeight) => {
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

  const applyPositioningListener = {
    next: ([_, stickyNavHeight]) => applyPositioning(stickyNavHeight)
  };

  stickyNavHeight$.subscribe({ next: applyPositioning });
  windowResize$.compose(sampleCombine(stickyNavHeight$)).subscribe(applyPositioningListener);
  windowOrientationChange$.compose(sampleCombine(stickyNavHeight$)).subscribe(applyPositioningListener);
  documentReadyState$.compose(sampleCombine(stickyNavHeight$)).filter(state => state === 'complete').subscribe(applyPositioningListener);
};

export default makeSticky;
