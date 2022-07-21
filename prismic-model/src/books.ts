import title from './parts/title';
import structuredText from './parts/structured-text';
import body from './parts/body';
import link from './parts/link';
import text from './parts/text';
import list from './parts/list';
import promo from './parts/promo';
import timestamp from './parts/timestamp';
import contributorsWithTitle from './parts/contributorsWithTitle';
import number from './parts/number';
import { CustomType } from './types/CustomType';

const books: CustomType = {
  id: 'books',
  label: 'Book',
  repeatable: true,
  status: true,
  json: {
    Book: {
      title,
      subtitle: structuredText({ label: 'Subtitle', singleOrMulti: 'single' }),
      body: body,
      orderLink: link('Order link', 'web'),
      price: text('Price'),
      format: text('Format'),
      extent: text('Extent'),
      isbn: text('ISBN'),
      reviews: list('Reviews', {
        text: structuredText({ label: 'Review' }),
        citation: structuredText({
          label: 'Citation',
          singleOrMulti: 'single',
        }),
      }),
      datePublished: timestamp('Date published'),
    },
    Contributors: contributorsWithTitle(),
    Promo: {
      promo,
    },
    Metadata: {
      metadataDescription: structuredText({
        label: 'Metadata description',
        singleOrMulti: 'single',
      }),
    },
    'Content relationships': {
      seasons: list('Seasons', {
        season: link('Season', 'document', ['seasons'], 'Select a Season'),
      }),
      parents: list('Parents', {
        order: number('Order'),
        parent: link('Parent', 'document', ['exhibitions'], 'Select a parent'),
      }),
    },
  },
};

export default books;
