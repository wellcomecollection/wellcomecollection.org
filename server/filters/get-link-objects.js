// @flow
import type {Link} from '../model/link';

export function createLinkObject(val: string, prepend?: string): Link {
  return {
    text: val,
    url: prepend ? `/search?query=${encodeURIComponent(prepend + val)}` : `/search?query=${encodeURI(val)}`
  };
};

export function getLinkObjects(objectArray: Array<{}>, objectKey: string, prepend?: string) {
  return objectArray.map((object) => {
    return createLinkObject(object[objectKey], prepend);
  });
}
