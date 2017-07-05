import showHide from './show-hide';

const sortSearch = (el) => {
  const toggle = showHide({
    el,
    activeClass: 'is-sort-search-active'
  });

  toggle.trigger.addEventListener('click', toggle.toggleActive);
};

export default sortSearch;
