// @flow
import list from '../parts/list';
import link from '../parts/link';

const PartOfThing = {
  Relationships: {
    partOf: list('Part of', {
      item: link('Item', 'document', ['series', 'exhibitions']),
    }),
  },
};

export default PartOfThing;
