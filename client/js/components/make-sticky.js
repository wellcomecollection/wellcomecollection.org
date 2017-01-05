import {nodeList, featureTest} from '../util';
import throttle from 'lodash.throttle';

const makeSticky = (els) => {
  if (featureTest('position', 'sticky')) {
    const elements = nodeList(els);
    const applyPositioning = () => {
      elements.map((e) => {
        if (e.offsetHeight > window.innerHeight) {
          e.style.position = 'static';
        } else {
          e.style.position = 'sticky';
        }
      });
    };

    document.addEventListener('readystatechange', applyPositioning);
    window.addEventListener('resize', throttle(applyPositioning, 500));// or when resizeStopped?
  }
};

export default makeSticky;
