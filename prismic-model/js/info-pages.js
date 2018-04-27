import title from './parts/title';
import body from './parts/body';
import promo from './parts/promo';
import link from './parts/link';
import text from './parts/text';

const Page = {
  Page: {
    title,
    body
  },
  Promo: {
    promo
  },

  // TODO (drupal migration): Remove this
  Migration: {
    drupalPromoImage: link('Drupal promo image', 'web'),
    drupalNid: text('Drupal node ID'),
    drupalPath: text('Drupal path')
  }
};

export default Page;
