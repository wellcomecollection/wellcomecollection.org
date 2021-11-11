import title from './parts/title';
import promo from './parts/promo';
import list from './parts/list';
import link from './parts/link';
import number from './parts/number';
import articleBody from './parts/article-body';
import contributorsWithTitle from './parts/contributorsWithTitle';
import singleLineText from './parts/single-line-text';
import structuredText from './parts/structured-text';
import { CustomType } from './types/CustomType';

const articles: CustomType = {
  id: 'articles',
  label: 'Story',
  repeatable: true,
  status: true,
  json: {
    Story: {
      title,
      format: link('Format', 'document', ['article-formats']),
      body: articleBody,
    },
    Outro: {
      outroResearchItem: link('Outro: Research item'),
      outroResearchLinkText: singleLineText('Outro: Research link text'),
      outroReadItem: link('Outro: Read item'),
      outroReadLinkText: singleLineText('Outro: Read link text'),
      outroVisitItem: link('Outro: Visit item'),
      outroVisitLinkText: singleLineText('Outro: Visit link text'),
    },
    Contributors: contributorsWithTitle(),
    Promo: {
      promo,
    },
    Metadata: {
      metadataDescription: structuredText('Metadata description', 'single'),
    },
    'Content relationships': {
      series: list('Series', {
        series: link('Series', 'document', ['series']),
        positionInSeries: number('Position in series'),
      }),
      seasons: list('Seasons', {
        season: link('Season', 'document', ['seasons'], 'Select a Season'),
      }),
      parents: list('Parents', {
        order: number('Order'),
        parent: link('Parent', 'document', ['exhibitions'], 'Select a parent'),
      }),
    },
    Migration: {
      publishDate: {
        config: {
          label: 'Override publish date',
        },
        type: 'Timestamp',
      },
      wordpressSlug: {
        config: {
          label: 'Wordpress slug',
        },
        type: 'Text',
      },
      // TODO: deprecate
      contributorsDeprecated: {
        type: 'Slices',
        fieldset: 'Contributors',
        config: {
          choices: {
            person: {
              type: 'Slice',
              fieldset: 'Person',
              'non-repeat': {
                role: {
                  type: 'Link',
                  config: {
                    label: 'Role',
                    select: 'document',
                    customtypes: ['editorial-contributor-roles'],
                    tags: ['editorial'],
                  },
                },
                person: {
                  type: 'Link',
                  config: {
                    label: 'Person',
                    select: 'document',
                    customtypes: ['people'],
                    placeholder: 'Select a person…',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default articles;
