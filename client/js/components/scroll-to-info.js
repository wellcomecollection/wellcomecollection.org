import anim from 'anim';
import { getDocumentHeight, getWindowHeight } from '../util';

export default (el) => {
  const idToScrollTo = el.getAttribute('data-element');
  const elToScrollTo = document.getElementById(idToScrollTo);
  const speed = el.getAttribute('data-speed') || 1000;
  const easing = el.getAttribute('data-easing') || 'linear';

  el.addEventListener('click', (event) => {
    event.preventDefault();

    const documentHeight = getDocumentHeight();
    const windowHeight = getWindowHeight();
    const elOffset = elToScrollTo.offsetTop;
    const scrollTop = Math.round(documentHeight - elOffset < windowHeight ? documentHeight - windowHeight : elOffset);

    anim(document.documentElement, 'scrollTop', scrollTop, {
      duration: speed,
      ease: easing
    }, () => {
      elToScrollTo.classList.add('no-visible-focus');
      elToScrollTo.setAttribute('tabindex', -1);
      elToScrollTo.focus();
    });
  });
};
