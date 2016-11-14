import {message} from './wellcome';
import {nodeList} from './util';
import palette from './components/palette';
import icons from './components/icons';
import headerSearch from './components/header/search';
import headerDropdowns from './components/header/dropdowns';

message();

nodeList(document.querySelectorAll('[data-component="palette"]')).forEach((el) => palette(el));
nodeList(document.querySelectorAll('[data-component="icons"]')).forEach((el) => icons(el));
const header = document.querySelector('.js-header');
headerSearch(header);
headerDropdowns(header);
