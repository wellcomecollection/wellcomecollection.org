import showHide from './show-hide';

export default (el) => {
  const toggle = showHide({
    el,
    activeClass: 'is-drawer-open'
  });

  toggle.trigger.addEventListener('click', toggle.toggleActive);
};
