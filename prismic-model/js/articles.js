// @flow
import title from './parts/title';
import promo from './parts/promo';
import list from './parts/list';
import link from './parts/link';
import number from './parts/number';
import articleBody from './parts/article-body';
import contributorsWithTitle from './parts/contributorsWithTitle';
import singleLineText from './parts/single-line-text';

const Article = {
  Article: {
    title,
    format: link('Format', 'document', ['article-formats']),
    body: articleBody
  },
  Promo: {
    promo
  },
  Contributors: contributorsWithTitle(),
  Series: {
    series: list('Series', {
      series: link('Series', 'document', ['series']),
      positionInSeries: number('Position in series')
    })
  },
  βeta: {
    outroResearchItem: link('Outro: Research item'),
    outroResearchLinkText: singleLineText('Outro: Research link text'),
    outroReadItem: link('Outro: Read item'),
    outroReadLinkText: singleLineText('Outro: Read link text'),
    outroVisitItem: link('Outro: Visit item'),
    outroVisitLinkText: singleLineText('Outro: Visit link text')
  },
  Migration: {
    'publishDate': {
      'config': {
        'label': 'Override publish date'
      },
      'type': 'Timestamp'
    },
    'wordpressSlug': {
      'config': {
        'label': 'Wordpress slug'
      },
      'type': 'Text'
    },
    // TODO: deprecate
    'contributorsDeprecated': {
      'type': 'Slices',
      'fieldset': 'Contributors',
      'config': {
        'choices': {
          'person': {
            'type': 'Slice',
            'fieldset': 'Person',
            'non-repeat': {
              'role': {
                'type': 'Link',
                'config': {
                  'label': 'Role',
                  'select': 'document',
                  'customtypes': [ 'editorial-contributor-roles' ],
                  'tags': [ 'editorial' ]
                }
              },
              'person': {
                'type': 'Link',
                'config': {
                  'label': 'Person',
                  'select': 'document',
                  'customtypes': [ 'people' ],
                  'placeholder': 'Select a person…'
                }
              }
            }
          }
        }
      }
    }
  }
};

export default Article;
