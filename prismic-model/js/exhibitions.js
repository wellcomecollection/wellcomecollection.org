// @flow
import title from './parts/title';
import description from './parts/description';
import promo from './parts/promo';
import timestamp from './parts/timestamp';
import place from './parts/place';
import link from './parts/link';
import list from './parts/list';
import text from './parts/text';
import structuredText from './parts/structured-text';
import contributorsWithTitle from './parts/contributorsWithTitle';
import body from './parts/body';
import boolean from './parts/boolean';

const Exhibitions = {
  Exhibition: {
    format: link('Format', 'document', ['exhibition-formats']),
    title,
    body,
    start: timestamp('Start date'),
    end: timestamp('End date'),
    isPermanent: boolean('Is permanent?'),
    statusOverride: structuredText('Status override', 'single'),
    place
  },
  Contributors: contributorsWithTitle(),
  'In this exhibition': {
    exhibits: list('Exhibits', {
      item: link('Exhibit', 'document', ['installations'])
    }),
    events: list('Events', {
      item: link('Event', 'document', ['events'])
    })
  },
  'About this exhibition': {
    articles: list('Articles', {
      item: link('Article', 'document', ['articles'])
    }),
    books: list('Books', {
      item: link('Book', 'document', ['books'])
    })
  },
  Promo: {
    promo
  },
  Resources: {
    resources: list('Resources', {
      resource: link('Resource', 'document', ['exhibition-resources'])
    })
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
    },
    textAndCaptionsDocument: link('Text and captions document', 'media'),
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
  }
};

export default Exhibitions;
