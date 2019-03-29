// @flow
import contributorsWithTitle from '../parts/contributorsWithTitle';

function ContributedThing() {
  return {
    Contributors: {
      ...contributorsWithTitle(),
    },
  };
}

export default ContributedThing;
