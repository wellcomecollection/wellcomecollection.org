import {message} from './wellcome';
import headerBurger from './components/header/burger';
import headerSearch from './components/header/search';
import openingHours from './components/opening-hours';

message();

const burgerEl = document.querySelector('.js-header-burger');
const headerSearchEl = document.getElementById('header-search');
const openingHoursEls = document.querySelectorAll('.js-opening-hours');

if (burgerEl) {
  headerBurger(burgerEl);
}

if (headerSearchEl) {
  headerSearch(headerSearchEl);
}

if (openingHoursEls) {
  openingHours(openingHoursEls);
}
