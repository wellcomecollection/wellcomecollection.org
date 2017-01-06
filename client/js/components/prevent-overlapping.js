import {nodeList, featureTest} from '../util';
import throttle from 'lodash.throttle';

const preventOverlapping = (els) => {
  if (featureTest('position', 'sticky')) {
    const elements = nodeList(els).reverse();
    const hideOverlapping = () => {
      elements.forEach((element, index, array) => {
        let elementMeta = {
          currentEl: element,
          nextDomEl: array[index - 1],
          currentElPosition: window.getComputedStyle(element, null).getPropertyValue('position'),
          currentElHeight: element.offsetHeight,
          currentElCssTop: parseInt(window.getComputedStyle(element, null).getPropertyValue('top'), 10),
          currentElActualTop: element.getBoundingClientRect().top,
          nextDomElActualTop: array[index - 1] ? array[index - 1].getBoundingClientRect().top : null,
          prevDomEls: elements.slice(index + 1)
        };
        if (elementMeta.currentElPosition.indexOf('sticky') > 0 && elementMeta.currentElActualTop <= elementMeta.currentElCssTop && elementMeta.nextDomEl !== undefined) {
          if (elementMeta.nextDomElActualTop <= elementMeta.currentElHeight + elementMeta.currentElCssTop) {
            elementMeta.currentEl.style.opacity = 0;
          } else {
            elementMeta.currentEl.style.opacity = 1;
          }
        } else {
          elementMeta.currentEl.style.opacity = 1;
        }
      });
    };
    hideOverlapping();
    window.addEventListener('scroll', throttle(hideOverlapping, 250));
  }
};

export default preventOverlapping;
