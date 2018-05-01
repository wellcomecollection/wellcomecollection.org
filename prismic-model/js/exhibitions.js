// @flow
import title from './parts/title';
import description from './parts/description';
import contributors from './parts/contributors';
import promo from './parts/promo';
import timestamp from './parts/timestamp';
import place from './parts/place';
import link from './parts/link';
import number from './parts/number';
import list from './parts/list';
import text from './parts/text';

const Exhibitions = {
  Exhibition: {
    title,
    description,
    start: timestamp('Start date'),
    end: timestamp('End date'),
    place,

    // Things it would be nice to deprecate
    // and fold into body
    intro: {
      'type': 'StructuredText',
      'config': {
        'label': 'Intro',
        'multi': 'heading2'
      }
    },
    textAndCaptionsDocument: link('Text and captions document', 'media'),

    // TODO: deprecate for place when the data has been updated
    galleryLevel: number('Gallery level')
  },
  Contributors: {
    contributors
  },
  Exhibits: {
    exhibits: list('Exhibits', {
      item: link('Exhibit', 'document', ['installations'])
    })
  },
  Promo: {
    promo
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
  }
};

export default Exhibitions;
