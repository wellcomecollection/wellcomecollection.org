// @flow
import type {Link} from '../model/link';

export function createLinkObject(val: string, prepend?: string): Link {
  return {
    text: val,
    url: prepend ? `/works?query=${encodeURIComponent(prepend + val)}` : `/works?query=${encodeURI(val)}`
  };
};

export function getLinkObjects(objectArray: Array<{}>, objectKey: string, prepend?: string) {
  return objectArray.map((object) => {
    return createLinkObject(object[objectKey], prepend);
  });
}
