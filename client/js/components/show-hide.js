const showHide = (state) => {
  const el = state.el;
  const activeClass = state.activeClass || 'is-active';
  const trigger = el.querySelector('[data-hook="show-hide-trigger"]');
  const drawer = el.querySelector('[data-hook="show-hide-drawer"]');

  el.setAttribute('aria-haspopup', 'true');

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

  return {
    trigger,
    drawer,
    getActive,
    setActive,
    toggleActive
  };
};

export default showHide;
