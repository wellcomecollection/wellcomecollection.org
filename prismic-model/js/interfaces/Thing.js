// @flow
import title from '../parts/title';
import body from '../parts/body';
import link from '../parts/link';
import singleLineText from '../parts/single-line-text';

function createThing(type: string, data: Object, extenders: Object[]) {
  const Thing = {
    Main: {
      title,
      format: link('Format', 'document', ['formats']),
      body,
    },
    Info: {
      ...data,
    },
    ...Object.assign({}, ...extenders),
    'Site info': {
      promoText: singleLineText,
      promoImage: singleLineText,
      metadataDescription: singleLineText,
    },
  };

  return Thing;
}

export default createThing;
