const showHide = (state) => {
  const el = state.el;
  const activeClass = state.activeClass || 'is-active';
  const trigger = el.querySelector('.js-show-hide-trigger');
  const drawer = el.querySelector('.js-show-hide-drawer');

  const init = () => {
    el.setAttribute('aria-haspopup', 'true');
    el.setAttribute('aria-expanded', getActive());
  };

  const setActive = (value) => {
    if (value) {
      el.classList.add(activeClass);
      el.setAttribute('aria-expanded', 'true');
    } else {
      el.classList.remove(activeClass);
      el.setAttribute('aria-expanded', 'false');
    }
  };

  const getActive = () => {
    return el.classList.contains(activeClass);
  };

  const toggleActive = () => {
    setActive(!getActive());
  };

  init();

  return {
    el,
    trigger,
    drawer,
    getActive,
    setActive,
    toggleActive
  };
};

export default showHide;
