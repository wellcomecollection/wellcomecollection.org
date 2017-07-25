import anim from 'anim';
import { getDocumentHeight, getWindowHeight } from '../util';
import fastdom from '../utils/fastdom-promise';

const duration = 1000;
const ease = 'inOutQuad';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion)').matches;

export default (el) => {
  const elToScrollTo = document.querySelector(el.getAttribute('href'));
  el.addEventListener('click', (event) => {
    if (prefersReducedMotion) return;

    event.preventDefault();

    const documentHeight = getDocumentHeight();
    const windowHeight = getWindowHeight();
    const elOffset = elToScrollTo.offsetTop;
    const scrollTop = Math.round(documentHeight - elOffset < windowHeight ? documentHeight - windowHeight : elOffset);

    [document.documentElement, document.body].forEach(el => {
      fastdom.mutate(() => {
        anim(el, 'scrollTop', scrollTop, {duration, ease}, () => {
          elToScrollTo.classList.add('no-visible-focus');
          elToScrollTo.setAttribute('tabindex', -1);
          elToScrollTo.focus();
        });
      });
    });
  });
};
