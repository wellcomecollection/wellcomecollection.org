import {message} from './wellcome';
import headerBurger from './components/header/burger';
import headerSearch from './components/header/search';
import './components/opening-hours';

message();

const burgerEl = document.querySelector('.js-header-burger');
const headerSearchEl = document.getElementById('header-search');

if (burgerEl) {
  headerBurger(burgerEl);
}

if (headerSearchEl) {
  headerSearch(headerSearchEl);
}
