import title from './parts/title';
import promo from './parts/promo';
import { body } from './parts/bodies';
import contributorsWithTitle from './parts/contributorsWithTitle';
import list from './parts/list';
import select from './parts/select';
import timestamp from './parts/timestamp';
import { singleLineText } from './parts/text';
import { documentLink } from './parts/link';
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
      title,
      format: documentLink('Format', { linkedType: 'article-formats' }),
      color: select('Colour', {
        options: [
          'accent.green',
          'accent.purple',
          'accent.salmon',
          'accent.blue',
        ],
      }),
      body,
    },
    Schedule: {
      schedule: list('Schedule', {
        title,
        publishDate: timestamp('Date to be published'),
      }),
    },
    Contributors: contributorsWithTitle(),
    Promo: {
      promo,
    },
    Metadata: {
      metadataDescription: singleLineText('Metadata description'),
    },
    'Content relationships': {
      seasons: list('Seasons', {
        season: documentLink('Season', {
          linkedType: 'seasons',
          placeholder: 'Select a Season',
        }),
      }),
    },
  },
  format: 'custom',
};

export default articleSeries;
