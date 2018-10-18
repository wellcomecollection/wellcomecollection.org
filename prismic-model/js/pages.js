// @flow
import title from './parts/title';
import body from './parts/body';
import promo from './parts/promo';
import link from './parts/link';
import text from './parts/text';
import timestamp from './parts/timestamp';

const Page = {
  Page: {
    title,
    datePublished: timestamp('Date published'),
    body
  },
  Promo: {
    promo
  },

  // TODO: (drupal migration) Remove this
  Deprecated: {
    drupalPromoImage: link('Drupal promo image', 'web'),
    drupalNid: text('Drupal node ID'),
    drupalPath: text('Drupal path')
  }
};

export default Page;
