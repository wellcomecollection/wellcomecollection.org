import showHide from './show-hide';

const drawer = (el) => {
  const toggle = showHide({el});

  toggle.trigger.addEventListener('click', toggle.toggleActive);
};

export default drawer;
