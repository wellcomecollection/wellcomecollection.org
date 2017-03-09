import { nodeList, featureTest } from '../util';

const preventOverlapping = (els) => {
  if (!featureTest('position', 'sticky')) return;

  const elsToStick = nodeList(els);
  const topOffset = 15;
  const stuckEls = () => {
    return elsToStick.map((el) => {
      if (el.getBoundingClientRect().top <= topOffset) {
        return el;
      }
    }).filter((el) => el !== undefined);
  };
  const nextElIndex = () => {
    return stuckEls().length;
  };
  const nextEl = () => {
    return elsToStick[nextElIndex()];
  };
  const nextElFromTop = () => {
    return nextEl().getBoundingClientRect().top;
  };
  const currentEl = () => {
    return stuckEls()[stuckEls().length - 1];
  };
  const previousEl = () => {
    return stuckEls()[stuckEls().length - 2];
  };
  const currentElHeight = () => {
    return currentEl().offsetHeight;
  };
  const fixPreviousTop = () => {
    if (!previousEl()) return;
    if (previousEl().classList.contains('js-full-width')) return;
    if (previousEl().style.top === '-100%') return;

    previousEl().style.top = '-100%';
  };
  const fixCurrentTop = () => {
    if (currentEl().style.top === `${topOffset}px`) return;
    if (currentEl().classList.contains('js-full-width')) return;

    currentEl().style.top = `${topOffset}px`;
  };
  const updateCurrentTop = () => {
    if (!currentEl()) return;

    fixCurrentTop();
    fixPreviousTop();

    if (currentEl().classList.contains('js-full-width')) return;
    if (!nextEl()) return;
    if (nextElFromTop() > currentElHeight() + topOffset) return;

    window.requestAnimationFrame(() => {
      currentEl().style.top = `${nextElFromTop() - currentElHeight()}px`;
    });
  };

  window.addEventListener('scroll', updateCurrentTop);
  window.addEventListener('resize', updateCurrentTop);
  updateCurrentTop();
};

export default preventOverlapping;
