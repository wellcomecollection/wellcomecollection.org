import {message} from './wellcome';
import nunjucks from 'nunjucks/browser/nunjucks-slim';
import render from './render';

message();

render('componnet/article', {title: 'Title', body: 'body'});
// returns string of template
