import { smoothScrollTo } from '../utils/smooth-scroll-to';

export default (el) => {
  const idToScrollTo = el.getAttribute('data-element');
  const elToScrollTo = document.getElementById(idToScrollTo);

  el.addEventListener('click', (event) => {
    event.preventDefault();

    smoothScrollTo(elToScrollTo, 600, 'easeInOutQuad');
  });
};
