import {message} from './wellcome';
import headerBurger from './components/header/burger';
import headerSearch from './components/header/search';

message();

headerBurger(document.querySelector('.js-header-burger'));
headerSearch(document.getElementById('header-search'));
