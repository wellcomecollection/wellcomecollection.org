import {message} from './wellcome';
import {nodeList} from './util';
import palette from './components/palette';
import icons from './components/icons';
import header from './components/header';

message();

nodeList(document.querySelectorAll('[data-component="palette"]')).forEach((el) => palette(el));
nodeList(document.querySelectorAll('[data-component="icons"]')).forEach((el) => icons(el));
header(document.querySelector('[data-component="header"]'));
