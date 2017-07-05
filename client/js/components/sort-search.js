import showHide from './show-hide';
import { nodeList } from '../util';

const sortSearch = (el) => {
  const toggle = showHide({
    el,
    activeClass: 'is-sort-search-active'
  });

  const form = el.querySelector('.js-sort-search-form');
  const inputEls = nodeList(form.getElementsByTagName('input'));

  inputEls.forEach((el) => {
    el.addEventListener('change', () => {
      form.submit();
    });
  });

  toggle.trigger.addEventListener('click', toggle.toggleActive);
};

export default sortSearch;
