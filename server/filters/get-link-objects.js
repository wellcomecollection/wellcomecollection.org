// @flow
import type {Link} from '../model/link';

export function createLinkObject(val: string): Link {
  return {
    text: val,
    url: `/search?query=${encodeURI(val)}`
  };
};

export function getLinkObjects(objectArray: Array<{}>, objectKey: string) {
  return objectArray.map((object) => {
    return createLinkObject(object[objectKey]);
  });
}
