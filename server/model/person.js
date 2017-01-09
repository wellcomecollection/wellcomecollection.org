import {Record} from 'immutable';

export const Person = Record({
  name: null,
  givenName: null,
  familyName: null,
  image: null,
  sameAs: []
});
