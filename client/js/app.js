import {message} from './wellcome';
import {nodeList} from './util';
import palette from './components/palette';

message();

nodeList(document.querySelectorAll('[data-component="palette"]')).forEach(palette(el));
