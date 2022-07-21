import title from './parts/title';
import promo from './parts/promo';
import timestamp from './parts/timestamp';
import place from './parts/place';
import link from './parts/link';
import list from './parts/list';
import structuredText, { singleLineText } from './parts/structured-text';
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
      format: link('Format', 'document', ['exhibition-formats']),
      title,
      shortTitle: singleLineText({
        label: 'Short title',
        textOptions: 'heading1',
      }),
      body,
      start: timestamp('Start date'),
      end: timestamp('End date'),
      isPermanent: booleanDeprecated('Is permanent?'),
      statusOverride: structuredText({
        label: 'Status override',
        allowMultipleParagraphs: false,
      }),
      bslInfo: structuredText({
        label: 'BSL information',
        allowMultipleParagraphs: false,
      }),
      audioDescriptionInfo: structuredText({
        label: 'Audio description information',
        allowMultipleParagraphs: false,
      }),
      place,
    },
    'In this exhibition': {
      exhibits: list('Exhibits', {
        item: link('Exhibit', 'document', ['exhibitions']),
      }),
      events: list('Gallery tours', {
        item: link('Gallery tour', 'document', ['events']),
      }),
    },
    'About this exhibition': {
      articles: list('Articles', {
        item: link('Article', 'document', ['articles']),
      }),
    },
    Resources: {
      resources: list('Resources', {
        resource: link('Resource', 'document', ['exhibition-resources']),
      }),
    },
    Contributors: contributorsWithTitle(),
    Promo: {
      promo,
    },
    Metadata: {
      metadataDescription: structuredText({
        label: 'Metadata description',
        allowMultipleParagraphs: false,
      }),
    },
    'Content relationships': {
      seasons: list('Seasons', {
        season: link('Season', 'document', ['seasons'], 'Select a Season'),
      }),
      parents: list('Parents', {
        order: number('Order'),
        parent: link('Parent', 'document', ['exhibitions'], 'Select a parent'),
      }),
    },
  },
};

export default exhibitions;
