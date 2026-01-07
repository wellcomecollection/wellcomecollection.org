import * as prismic from '@prismicio/client';

import { licenseTypeArray } from '@weco/common/model/license';
import { Tasl } from '@weco/common/model/tasl';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import {
  isFilledLinkToDocument,
  isFilledLinkToMediaField,
  isFilledLinkToWebField,
} from '@weco/common/services/prismic/types';

export function transformTaslFromString(pipedString: string | null): Tasl {
  if (pipedString === null) {
    return { title: '' };
  }

  // We expect a string of title|author|sourceName|sourceLink|license|copyrightHolder|copyrightLink
  // e.g. Self|Rob Bidder|||CC-BY-NC
  try {
    const list = (pipedString || '').split('|');

    if (list.length > 7) {
      throw new Error('TASL has more than 7 elements');
    }

    const v = list
      .concat(Array(7 - list.length))
      .map(v => (!v.trim() ? undefined : v.trim()));

    const [
      title,
      author,
      sourceName,
      sourceLink,
      maybeLicense,
      copyrightHolder,
      copyrightLink,
    ] = v;
    const license = licenseTypeArray.find(l => l === maybeLicense);
    return {
      title,
      author,
      sourceName,
      sourceLink,
      license,
      copyrightHolder,
      copyrightLink,
    };
  } catch (e) {
    console.warn(`Unable to parse TASL from input (${pipedString}): ${e}`);
    return {
      title: pipedString,
    };
  }
}

export function transformLink(
  /* eslint-disable @typescript-eslint/no-explicit-any */
  link?: prismic.LinkField<string, string, any>
  /* eslint-enable @typescript-eslint/no-explicit-any */
): string | undefined {
  if (link) {
    if (isFilledLinkToWebField(link) || isFilledLinkToMediaField(link)) {
      return link.url;
    } else if (
      isFilledLinkToDocument(link as prismic.ContentRelationshipField)
    ) {
      return linkResolver(link as prismic.ContentRelationshipField);
    } else {
      console.warn(`Unable to construct link for ${JSON.stringify(link)}`);
    }
  }
}

/** Transform a Prismic timestamp into a JavaScript date.
 *
 * Note: this is preferable to passing a value to the `Date` constructor
 * (i.e. `new Date(…)`) because it handles the timezone offset which is present
 * in Prismic timestamps, whereas some older browsers can't parse that.
 *
 */
export function transformTimestamp(
  field: prismic.TimestampField
): Date | undefined {
  return prismic.asDate(field) || undefined;
}
