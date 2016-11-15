const showHide = (state) => {
  const el = state.el;
  const defaults = {
    activeClass: 'is-active',
    trigger: el.querySelector('.js-show-hide-trigger'),
    drawer: el.querySelector('.js-show-hide-drawer')
  };

  const options = Object.assign(defaults, state);

  const init = () => {
    el.setAttribute('aria-haspopup', 'true');
    options.trigger.setAttribute('aria-expanded', getActive());
  };

  const setActive = (value) => {
    if (value) {
      el.classList.add(options.activeClass);
      options.trigger.setAttribute('aria-expanded', 'true');
    } else {
      el.classList.remove(options.activeClass);
      options.trigger.setAttribute('aria-expanded', 'false');
    }
  };

  const getActive = () => {
    return el.classList.contains(options.activeClass);
  };

  const toggleActive = () => {
    setActive(!getActive());
  };

  init();

  return {
    el,
    trigger: options.trigger,
    drawer: options.drawer,
    getActive,
    setActive,
    toggleActive
  };
};

export default showHide;
