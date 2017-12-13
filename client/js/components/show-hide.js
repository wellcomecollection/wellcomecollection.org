const showHide = (state) => {
  const el = state.el;
  const defaults = {
    activeClass: 'is-active',
    trigger: el.querySelector('.js-show-hide-trigger'),
    drawer: el.querySelector('.js-show-hide-drawer')
  };

  const lockScroll = el.getAttribute('data-lock-scroll') === 'true';
  const options = Object.assign(defaults, state, {lockScroll});

  const init = () => {
    el.setAttribute('aria-haspopup', 'true');
    options.trigger.setAttribute('aria-expanded', getActive());
  };

  const setActive = (value) => {
    if (value) {
      el.classList.add(options.activeClass);
      options.trigger.setAttribute('aria-expanded', 'true');

      if (options.lockScroll) {
        document.body.classList.add('is-scroll-locked');
      }
    } else {
      el.classList.remove(options.activeClass);
      options.trigger.setAttribute('aria-expanded', 'false');

      if (options.lockScroll) {
        document.body.classList.remove('is-scroll-locked');
      }
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
