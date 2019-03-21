// @flow
import createContributedThing from '../interfaces/ContributedThing';
import createLocatedThing from '../interfaces/LocatedThing';
import createTimedThing from '../interfaces/TimedThing';

// TODO: researvation / schedule
const type = 'exhibition';
const Exhibition = createTimedThing(
  type,
  createContributedThing(type, createLocatedThing(type, {}))
);

export default Exhibition;
