import title from './parts/title';
import { multiLineText, singleLineText } from './parts/text';
import body from './parts/body';
import { documentLink, webLink } from './parts/link';
import keyword from './parts/keyword';
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
      subtitle: singleLineText('Subtitle'),
      body,
      orderLink: webLink('Order link'),
      price: keyword('Price'),
      format: keyword('Format'),
      extent: keyword('Extent'),
      isbn: keyword('ISBN'),
      reviews: list('Reviews', {
        text: multiLineText('Review'),
        citation: singleLineText('Citation'),
      }),
      datePublished: timestamp('Date published'),
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
      parents: list('Parents', {
        order: number('Order'),
        parent: documentLink('Parent', {
          linkedType: 'exhibitions',
          placeholder: 'Select a parent',
        }),
      }),
    },
  },
  format: 'custom',
};

export default books;
