import { smoothScrollTo } from '../utils/smooth-scroll-to';

export default (el) => {
  const idToScrollTo = el.getAttribute('data-element');
  const speed = el.getAttribute('data-speed') || 600;
  const easing = el.getAttribute('data-easing') || 'linear';
  const elToScrollTo = document.getElementById(idToScrollTo);

  el.addEventListener('click', (event) => {
    event.preventDefault();

    smoothScrollTo(elToScrollTo, speed, easing);
  });
};
