import title from './parts/title';
import body from './parts/body';
import promo from './parts/promo';
import { singleLineText } from './parts/text';
import contributorsWithTitle from './parts/contributorsWithTitle';
import { documentLink } from './parts/link';
import list from './parts/list';
import timestamp from './parts/timestamp';
import { CustomType } from './types/CustomType';

const projects: CustomType = {
  id: 'projects',
  label: 'Project',
  repeatable: true,
  status: true,
  json: {
    Project: {
      title,
      format: documentLink('Format', { linkedType: 'project-formats' }),
      start: timestamp('Start date'),
      end: timestamp('End date'),
      body,
    },
    Contributors: contributorsWithTitle(),
    Promo: {
      promo,
    },
    'Content relationships': {
      seasons: list('Seasons', {
        season: documentLink('Season', {
          linkedType: 'seasons',
          placeholder: 'Select a Season',
        }),
      }),
    },
    Metadata: {
      metadataDescription: singleLineText('Metadata description'),
    },
  },
  format: 'custom',
};

export default projects;
