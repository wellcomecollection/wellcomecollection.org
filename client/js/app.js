import {message} from './wellcome';
import {nodeList} from './util';
import palette from './components/palette';
import icons from './components/icons';
import showHide from './components/show-hide';

message();

nodeList(document.querySelectorAll('[data-component="palette"]')).forEach((el) => palette(el));
nodeList(document.querySelectorAll('[data-component="icons"]')).forEach((el) => icons(el));
nodeList(document.querySelectorAll('[data-component="show-hide"]')).forEach(showHide);
