// TODO: work out how to reduce motion for a user who
// 'prefers-reduced-motion' - https://css-tricks.com/introduction-reduced-motion-media-query/
import anim from 'anim';
import { getDocumentHeight, getWindowHeight } from '../util';

export default (el) => {
  const elToScrollTo = document.querySelector(el.getAttribute('href'));
  const duration = 1000;
  const ease = 'inOutQuad';

  el.addEventListener('click', (event) => {
    event.preventDefault();

    const documentHeight = getDocumentHeight();
    const windowHeight = getWindowHeight();
    const elOffset = elToScrollTo.offsetTop;
    const scrollTop = Math.round(documentHeight - elOffset < windowHeight ? documentHeight - windowHeight : elOffset);

    [document.documentElement, document.body].forEach(el => {
      anim(el, 'scrollTop', scrollTop, {duration, ease}, () => {
        elToScrollTo.classList.add('no-visible-focus');
        elToScrollTo.setAttribute('tabindex', -1);
        elToScrollTo.focus();
      });
    });
  });
};
