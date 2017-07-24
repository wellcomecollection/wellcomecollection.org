import anim from 'anim';
import { getDocumentHeight, getWindowHeight } from '../util';

export default (el) => {
  const elToScrollTo = document.querySelector(el.getAttribute('href'));
  const speed = 1000;
  const easing = 'inOutQuad';

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
