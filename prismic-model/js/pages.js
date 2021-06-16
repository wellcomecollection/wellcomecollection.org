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
import boolean from './parts/boolean';
import contributorsWithTitle from './parts/contributorsWithTitle';

const Page = {
  Page: {
    title,
    format: link('Format', 'document', ['page-formats']),
    datePublished: timestamp('Date published'),
    showOnThisPage: boolean('Show \'On this page\' anchor links (even when true, this will only appear if there are more than 2 H2s in the body)', false),
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
    parents: list('Parent pages', {
      order: number('Order'),
      parent: link(
        'Parent page',
        'document',
        ['pages', 'exhibitions'],
        'Select a parent page'
      ),
    }),
  },
  Contributors: contributorsWithTitle(),
  // TODO: (drupal migration) Remove this
  Migration: {
    drupalPromoImage: link('Drupal promo image', 'web'),
    drupalNid: text('Drupal node ID'),
    drupalPath: text('Drupal path'),
  },
};

export default Page;
