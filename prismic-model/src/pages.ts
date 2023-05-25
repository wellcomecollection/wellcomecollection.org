import title from './parts/title';
import body from './parts/body';
import promo from './parts/promo';
import { documentLink } from './parts/link';
import list from './parts/list';
import timestamp from './parts/timestamp';
import { singleLineText } from './parts/text';
import number from './parts/number';
import boolean from './parts/boolean';
import contributorsWithTitle from './parts/contributorsWithTitle';
import { CustomType } from './types/CustomType';

const pages: CustomType = {
  id: 'pages',
  label: 'Page',
  repeatable: true,
  status: true,
  json: {
    Page: {
      title,
      format: documentLink('Format', { linkedType: 'page-formats' }),
      datePublished: timestamp('Date published'),
      showOnThisPage: boolean(
        "Show 'On this page' anchor links. This will only appear if there are more than 2 H2s in the body",
        { defaultValue: false }
      ),
      body,
    },
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
      parents: list('Parent pages', {
        order: number('Order'),
        parent: documentLink('Parent page', {
          linkedTypes: ['pages', 'exhibitions'],
          placeholder: 'Select a parent page',
        }),
      }),
    },
    Contributors: contributorsWithTitle(),
  },
  format: 'custom',
};

export default pages;
