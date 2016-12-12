import tabs from './tabs';
import {nodeList} from '../util';

const openingHours = (el) => {
  const options = {
    currentClass: 'opening-hours__tabitem--is-current',
    visibleClass: 'opening-hours__table--is-visible'
  };
  nodeList(el).forEach((el) => tabs(el, options));
};

export default openingHours;
