// @flow
import ArticleSeries from './series';
import title from './parts/title';

export default {
  'Webcomic series': Object.assign({}, ArticleSeries['Article series'], { title })
};
