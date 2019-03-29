// @flow
import list from '../parts/list';
import link from '../parts/link';

function PartOfThing(parents: string[]) {
  return {
    Relationships: {
      partOf: list('Part of', {
        item: link('Item', 'document', parents),
      }),
    },
  };
}

export default PartOfThing;
