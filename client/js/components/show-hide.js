const showHide = (state) => {
  const el = state.el;
  const activeClass = state.activeClass || 'is-active';
  const trigger = el.querySelector('.js-show-hide-trigger');
  const drawer = el.querySelector('.js-show-hide-drawer');

  const init = () => {
    el.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', getActive());
  };

  const setActive = (value) => {
    if (value) {
      el.classList.add(activeClass);
      trigger.setAttribute('aria-expanded', 'true');
    } else {
      el.classList.remove(activeClass);
      trigger.setAttribute('aria-expanded', 'false');
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
