class Drawer {
  constructor(el) {
    this.el = el;
    this.trigger = el.getElementsByClassName('js-trigger')[0];
    this.trigger.addEventListener('click', this.toggleActive.bind(this));
  }

  getActive() {
    return this.el.classList.contains('is-active');
  }

  setActive(value) {
    if (value) {
      this.el.classList.add('is-active');
    } else {
      this.el.classList.remove('is-active');
    }
  }

  toggleActive() {
    this.setActive(!this.getActive());
  }
}

export default Drawer;
