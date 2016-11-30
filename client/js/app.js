import {message} from './wellcome';
import {nodeList} from './util';
import palette from './components/palette';
import headerBurger from './components/header/burger';

message();

nodeList(document.querySelectorAll('[data-component="palette"]')).forEach((el) => palette(el));
headerBurger(document.querySelector('.js-header-burger'));
