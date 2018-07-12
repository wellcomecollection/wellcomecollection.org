// @flow
import title from './parts/title';
import structuredText from './parts/structured-text';
import body from './parts/body';
import link from './parts/link';
import text from './parts/text';
import list from './parts/list';
import promo from './parts/promo';
import timestamp from './parts/timestamp';
import contributorsWithTitle from './parts/contributorsWithTitle';

const Books = {
  Book: {
    title,
    subtitle: structuredText('Subtitle', 'single'),
    body: body,
    orderLink: link('Order link', 'web'),
    price: text('Price'),
    format: text('Format'),
    extent: text('Extent'),
    isbn: text('ISBN'),
    reviews: list('Reviews', {
      text: structuredText('Review'),
      citation: structuredText('Citation', 'single')
    }),
    datePublished: timestamp('Date published')
  },
  Contributors: contributorsWithTitle(),
  Promo: {
    promo
  },
  Migration: {
    drupalPromoImage: link('Drupal promo image', 'web'),
    drupalNid: text('Drupal node ID'),
    drupalPath: text('Drupal path'),
    authorName: structuredText('Author\'s name', 'single'),
    authorImage: link('Author\'s image', 'web'),
    authorDescription: structuredText('About the author', 'single')
  }
};

export default Books;
