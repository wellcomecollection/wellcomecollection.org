import {nodeList, featureTest} from '../util';
import debounce from 'lodash.debounce';

const makeSticky = (els) => {
  if (featureTest('position', 'sticky')) {
    const elements = nodeList(els);
    const applyPositioning = () => {
      elements.map((e) => {
        if (e.offsetHeight > window.innerHeight) {
          e.classList.remove('sticky-applied');
        } else {
          e.classList.add('sticky-applied');
        }
      });
    };

    document.addEventListener('readystatechange', applyPositioning);
    window.addEventListener('resize', debounce(applyPositioning, 500));
  }
};

export default makeSticky;
