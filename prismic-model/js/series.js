// @flow
import title from './parts/title';
import promo from './parts/promo';
import body from './parts/body';
import contributorsWithTitle from './parts/contributorsWithTitle';
import list from './parts/list';
import number from './parts/number';
import select from './parts/select';
import text from './parts/text';
import timestamp from './parts/timestamp';
import structuredText from './parts/structured-text';

// This is called `ArticleSeries` and the filename `series`, as it was a
// mistake we made way back when when all we were doing was articles
const ArticleSeries = {
  'Article series': {
    name: {
      type: 'Text',
      config: {
        label: 'Title',
        useAsTitle: true
      }
    },
    commissionedLength: number('Commissioned length'),
    color: select('Colour', [ 'turquoise', 'red', 'orange', 'purple' ]),
    description: structuredText('[Deprecated] Description. Please use featured text'),
    body
  },
  Contributors: contributorsWithTitle(),
  Schedule: {
    schedule: list('Schedule', {
      title: title,
      publishDate: timestamp('Date to be published')
    })
  },
  Promo: {
    promo
  },
  Deprecated: {
    wordpressSlug: text('Wordpress slug')
  }
};

export default ArticleSeries;
