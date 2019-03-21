// @flow
import createThing from './Thing';
import contributorsWithTitle from '../parts/contributorsWithTitle';

function createContributedThing(type: string, data: Object) {
  const model = createThing(type, {
    ...contributorsWithTitle(),
    ...data,
  });

  return model;
}

export default createContributedThing;
