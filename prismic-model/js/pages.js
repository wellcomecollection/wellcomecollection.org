// @flow
import title from './parts/title';
import body from './parts/body';
import promo from './parts/promo';
import link from './parts/link';
import text from './parts/text';
import list from './parts/list';
import timestamp from './parts/timestamp';

const Page = {
  Page: {
    title,
    // We label this as `Site section` for the time that we only support this
    // type of tag
    tags: list('Site section', {
      tag: link('Site section', 'document', ['tags'])
    }),
    datePublished: timestamp('Date published'),
    body
  },
  Promo: {
    promo
  },
  'βeta': {
    uniquePath: text('uID')
  },

  // TODO (drupal migration): Remove this
  Migration: {
    drupalPromoImage: link('Drupal promo image', 'web'),
    drupalNid: text('Drupal node ID'),
    drupalPath: text('Drupal path')
  }
};

export default Page;
