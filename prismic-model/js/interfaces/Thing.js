// @flow
import title from '../parts/title';
import body from '../parts/body';
import link from '../parts/link';
import singleLineText from '../parts/single-line-text';
import list from '../parts/list';

function createThing(type: string, data: Object) {
  const model = {
    Main: {
      title,
      // maybe this should be `type`
      // e.g. type of story, type of event, type of exhibition?
      format: link('Format', 'document', ['formats']),
      body,
    },
    Info: {
      ...data,
    },
    Relationships: {
      partOf: list('Part of', {
        item: link('Item', 'document', ['series', 'exhibitions']),
      }),
    },
    'Site info': {
      promoText: singleLineText,
      promoImage: singleLineText,
      metadataDescription: singleLineText,
    },
  };

  return model;
}

export default createThing;
