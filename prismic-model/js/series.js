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
    title: title,
    color: select('Colour', ['teal', 'red', 'green', 'purple']),
    description: structuredText(
      '[Deprecated] Description. Please use standfirst slice'
    ),
    body,
  },
  Schedule: {
    schedule: list('Schedule', {
      title: title,
      publishDate: timestamp('Date to be published'),
    }),
  },
  Contributors: contributorsWithTitle(),
  Promo: {
    promo,
  },
  Metadata: {
    metadataDescription: structuredText('Metadata description', 'single'),
  },
  Deprecated: {
    commissionedLength: number('[Deprecated] Commissioned length'),
    wordpressSlug: text('[Deprecated] Wordpress slug'),
  },
};

export default ArticleSeries;
