// @flow
import title from './parts/title';
import description from './parts/description';
import promo from './parts/promo';
import timestamp from './parts/timestamp';
import place from './parts/place';
import link from './parts/link';
import number from './parts/number';
import list from './parts/list';
import text from './parts/text';
import structuredText from './parts/structured-text';
import contributorsWithTitle from './parts/contributorsWithTitle';
import body from './parts/body';

const Exhibitions = {
  Exhibition: {
    format: link('Format', 'document', ['exhibition-formats']),
    title,
    body,
    start: timestamp('Start date'),
    end: timestamp('End date'),
    statusOverride: structuredText('Status override', 'single'),
    place,
    textAndCaptionsDocument: link('Text and captions document', 'media'),

    // TODO: deprecate for place when the data has been updated
    galleryLevel: number('Gallery level')
  },
  Contributors: contributorsWithTitle(),
  Exhibits: {
    exhibits: list('Exhibits', {
      item: link('Exhibit', 'document', ['installations'])
    })
  },
  Promo: {
    promo
  },
  Listing: {
    listingWeight: number('Listing weight')
  },
  // When we get a better relational model up, this will be deprecated
  'Related promos': {
    'promoList': {
      'type': 'Group',
      'config': {
        'label': 'Related Promos',
        'fields': {
          'image': {
            'type': 'Image',
            'config': {
              'label': 'Image',
              'thumbnails': [{
                'name': '16:9',
                'width': 3200,
                'height': 1800
              }, {
                'name': 'square',
                'width': 3200,
                'height': 3200
              }]
            }
          },
          'type': {
            'type': 'Select',
            'config': {
              'label': 'Type',
              'options': ['gallery', 'book', 'event', 'article']
            }
          },
          'title': {
            'type': 'StructuredText',
            'config': {
              'single': 'heading3',
              'label': 'Title'
            }
          },
          'description': {
            'type': 'StructuredText',
            'config': {
              'single': 'paragraph',
              'label': 'Description'
            }
          },
          'link': {
            'config': {
              'label': 'Link',
              'select': 'web'
            },
            'type': 'Link'
          }
        }
      }
    }
  },
  Migration: {
    drupalPromoImage: link('Drupal promo image', 'web'),
    drupalNid: text('Drupal node ID'),
    drupalPath: text('Drupal path')
  },
  Deprecated: {
    description,
    intro: {
      'type': 'StructuredText',
      'config': {
        'label': 'Intro',
        'multi': 'heading2'
      }
    }
  }
};

export default Exhibitions;
