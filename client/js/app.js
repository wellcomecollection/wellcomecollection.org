import {message} from './wellcome';
import {nodeList} from './util';
import palette from './components/palette';

message();

nodeList(document.querySelectorAll('[data-component="palette"]')).forEach((el) => {
    console.log(el);
    palette(el);
});
