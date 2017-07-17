import showHide from './show-hide';

export default (el) => {
  const toggle = showHide({el});

  toggle.trigger.addEventListener('click', toggle.toggleActive);
};
