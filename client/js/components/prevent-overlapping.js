/* global Element */
import { nodeList, featureTest } from '../util';

const preventOverlapping = (els) => {
  if (!featureTest('position', 'sticky')) return;
  if (!Element.prototype.hasOwnProperty('before')) return;

  const stickies = nodeList(els);

  const setsOfElsToWrap = stickies.map((sticky) => {
    const initialEl = sticky;
    const nextEls = [];

    while (sticky.nextElementSibling && !sticky.nextElementSibling.matches('.js-sticky') && !sticky.nextElementSibling.matches('.js-full-width')) {
      nextEls.push(sticky = sticky.nextElementSibling);
    }

    return [ initialEl ].concat(nextEls);
  });

  setsOfElsToWrap.forEach((elsToWrap) => {
    const wrapper = document.createElement('div');

    wrapper.classList.add('sticky-wrapper');

    elsToWrap[0].before(wrapper);
    elsToWrap.forEach(x => wrapper.append(x));
  });
};

export default preventOverlapping;
