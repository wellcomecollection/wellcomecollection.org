import title from './parts/title';
import promo from './parts/promo';
import list from './parts/list';
import link, { documentLink } from './parts/link';
import number from './parts/number';
import articleBody from './parts/article-body';
import contributorsWithTitle from './parts/contributorsWithTitle';
import { singleLineText } from './parts/structured-text';
import { CustomType } from './types/CustomType';

const articles: CustomType = {
  id: 'articles',
  label: 'Story',
  repeatable: true,
  status: true,
  json: {
    Story: {
      title,
      format: documentLink({ label: 'Format', linkedType: 'article-formats' }),
      body: articleBody,
    },
    Outro: {
      outroResearchItem: link('Outro: Research item'),
      outroResearchLinkText: singleLineText({
        label: 'Outro: Research link text',
        overrideTextOptions: ['paragraph'],
      }),
      outroReadItem: link('Outro: Read item'),
      outroReadLinkText: singleLineText({
        label: 'Outro: Read link text',
        overrideTextOptions: ['paragraph'],
      }),
      outroVisitItem: link('Outro: Visit item'),
      outroVisitLinkText: singleLineText({
        label: 'Outro: Visit link text',
        overrideTextOptions: ['paragraph'],
      }),
    },
    Contributors: contributorsWithTitle(),
    Promo: {
      promo,
    },
    Metadata: {
      metadataDescription: singleLineText({
        label: 'Metadata description',
      }),
    },
    'Content relationships': {
      series: list('Series', {
        series: documentLink({ label: 'Series', linkedType: 'series' }),
        positionInSeries: number('Position in series'),
      }),
      seasons: list('Seasons', {
        season: documentLink({
          label: 'Season',
          linkedType: 'seasons',
          placeholder: 'Select a Season',
        }),
      }),
      parents: list('Parents', {
        order: number('Order'),
        parent: documentLink({
          label: 'Parent',
          linkedType: 'exhibitions',
          placeholder: 'Select a parent',
        }),
      }),
    },
    Overrides: {
      publishDate: {
        config: {
          label:
            'Override publish date rendering. This will not affect ordering',
        },
        type: 'Timestamp',
      },
    },
  },
};

export default articles;
