import {message} from './wellcome';
import {nodeList} from './util';
import palette from './components/palette';
import headerBurger from './components/header/burger';
import headerSearch from './components/header/search';
import './components/opening-hours';

message();

nodeList(document.querySelectorAll('[data-component="palette"]')).forEach((el) => palette(el));

const burgerEl = document.querySelector('.js-header-burger');
const headerSearchEl = document.getElementById('header-search');

if (burgerEl) {
  headerBurger(burgerEl);
}

if (headerSearchEl) {
  headerSearch(headerSearchEl);
}
