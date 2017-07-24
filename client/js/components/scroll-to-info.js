import anim from '../../libs/anim';
import { getDocumentHeight, getWindowHeight } from '../util';

export default (el) => {
  const idToScrollTo = el.getAttribute('data-element');
  const elToScrollTo = document.getElementById(idToScrollTo);
  const speed = el.getAttribute('data-speed') || 0.6;
  const easing = el.getAttribute('data-easing') || 'ease';

  el.addEventListener('click', (event) => {
    event.preventDefault();

    const documentHeight = getDocumentHeight();
    const windowHeight = getWindowHeight();
    const elOffset = elToScrollTo.offsetTop;
    const scrollTop = Math.round(documentHeight - elOffset < windowHeight ? documentHeight - windowHeight : elOffset);

    anim(document.documentElement, {scrollTop}, speed, easing)
      .anim(() => {
        elToScrollTo.classList.add('no-visible-focus');
        elToScrollTo.setAttribute('tabindex', -1);
        elToScrollTo.focus();
      });
  });
};
