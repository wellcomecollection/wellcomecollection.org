
// @flow
import title from './parts/title';
import link from './parts/link';

const Tags = {
  Tag: {
    type: link('Tag type', 'document', ['tag-types']),
    title
  }
};

export default Tags;
