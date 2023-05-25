import title from './parts/title';
import promo from './parts/promo';
import timestamp from './parts/timestamp';
import place from './parts/place';
import { documentLink } from './parts/link';
import list from './parts/list';
import { singleLineText } from './parts/text';
import contributorsWithTitle from './parts/contributorsWithTitle';
import body from './parts/body';
import booleanDeprecated from './parts/boolean-deprecated';
import number from './parts/number';
import { CustomType } from './types/CustomType';

const exhibitions: CustomType = {
  id: 'exhibitions',
  label: 'Exhibition',
  repeatable: true,
  status: true,
  json: {
    Exhibition: {
      format: documentLink('Format', { linkedType: 'exhibition-formats' }),
      title,
      shortTitle: singleLineText('Short title', {
        overrideTextOptions: ['heading1'],
      }),
      body,
      start: timestamp('Start date'),
      end: timestamp('End date'),
      isPermanent: booleanDeprecated('Is permanent?'),
      statusOverride: singleLineText('Status override'),
      bslInfo: singleLineText('BSL information'),
      audioDescriptionInfo: singleLineText('Audio description information'),
      place,
    },
    'In this exhibition': {
      exhibits: list('Exhibits', {
        item: documentLink('Exhibit', { linkedType: 'exhibitions' }),
      }),
      events: list('Gallery tours', {
        item: documentLink('Gallery tour', { linkedType: 'events' }),
      }),
    },
    'About this exhibition': {
      articles: list('Articles', {
        item: documentLink('Article', { linkedType: 'articles' }),
      }),
    },
    Resources: {
      resources: list('Resources', {
        resource: documentLink('Resource', {
          linkedType: 'exhibition-resources',
        }),
      }),
    },
    Contributors: contributorsWithTitle(),
    Promo: {
      promo,
    },
    Metadata: {
      metadataDescription: singleLineText('Metadata description'),
    },
    'Content relationships': {
      seasons: list('Seasons', {
        season: documentLink('Season', {
          linkedType: 'seasons',
          placeholder: 'Select a Season',
        }),
      }),
      parents: list('Parents', {
        order: number('Order'),
        parent: documentLink('Parent', {
          linkedType: 'exhibitions',
          placeholder: 'Select a parent',
        }),
      }),
    },
  },
  format: 'custom',
};

export default exhibitions;
