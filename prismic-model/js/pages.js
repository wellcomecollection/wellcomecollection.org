// @flow
import title from './parts/title';
import body from './parts/body';
import promo from './parts/promo';
import link from './parts/link';
import list from './parts/list';
import text from './parts/text';
import timestamp from './parts/timestamp';
import structuredText from './parts/structured-text';
import number from './parts/number';

const Page = {
  Page: {
    title,
    format: link('Format', 'document', ['page-formats']),
    datePublished: timestamp('Date published'),
    body,
  },
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
    parents: list('Parents', {
      order: number('Order'),
      parent: link(
        'Parent',
        'document',
        ['pages', 'exhibitions'],
        'Select a parent'
      ),
    }),
  },
  // TODO: (drupal migration) Remove this
  Migration: {
    drupalPromoImage: link('Drupal promo image', 'web'),
    drupalNid: text('Drupal node ID'),
    drupalPath: text('Drupal path'),
  },
};

export default Page;
