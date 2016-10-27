import {message} from './wellcome';
import render from './render';

message();

render('componnet/article', {title: 'Title', body: 'body'});
// returns string of template
