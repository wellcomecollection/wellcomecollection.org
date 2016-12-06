import tabs from './tabs';

const options = {
  currentClass: 'opening-hours__tabitem--is-current',
  hiddenClass: 'opening-hours__table--is-hidden'
};

document.querySelectorAll('.js-opening-hours').forEach((el) => tabs(el, options));
