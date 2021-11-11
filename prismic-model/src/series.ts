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
import link from './parts/link';
import { CustomType } from './types/CustomType';

// This is called `ArticleSeries` and the id `series`, as it was a
// mistake we made way back when when all we were doing was articles
const articleSeries: CustomType = {
  id: 'series',
  label: 'Story series',
  repeatable: true,
  status: true,
  json: {
    'Story series': {
      title: title,
      color: select('Colour', ['teal', 'red', 'green', 'purple']),
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
    'Content relationships': {
      seasons: list('Seasons', {
        season: link('Season', 'document', ['seasons'], 'Select a Season'),
      }),
    },
    Deprecated: {
      description: structuredText(
        '[Deprecated] Description. Please use standfirst slice'
      ),
      commissionedLength: number('[Deprecated] Commissioned length'),
      wordpressSlug: text('[Deprecated] Wordpress slug'),
    },
  },
};

export default articleSeries;
