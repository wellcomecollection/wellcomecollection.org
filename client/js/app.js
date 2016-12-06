import {message} from './wellcome';
import {nodeList} from './util';
import palette from './components/palette';
import headerBurger from './components/header/burger';
import headerSearch from './components/header/search';
import './components/opening-hours';

message();

nodeList(document.querySelectorAll('[data-component="palette"]')).forEach((el) => palette(el));
headerBurger(document.querySelector('.js-header-burger'));
headerSearch(document.getElementById('header-search'));
