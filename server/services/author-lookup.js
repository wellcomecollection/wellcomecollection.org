// @flow
import {type Person} from '../model/person';
import * as people from '../data/people';

export const authorMap: { [key: string]: Person } = {
  'oops-i-wrote-a-britney-blog-post': people.russellDornan,
  'something-in-the-air': people.ruthGarde
};
