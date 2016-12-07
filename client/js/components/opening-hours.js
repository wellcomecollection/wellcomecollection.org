import tabs from './tabs';

const options = {
  currentClass: 'opening-hours__tabitem--is-current',
  visibleClass: 'opening-hours__table--is-visible'
};

document.querySelectorAll('.js-opening-hours').forEach((el) => tabs(el, options));
