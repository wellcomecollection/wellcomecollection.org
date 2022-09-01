import { Tasl } from '../../../model/tasl';
import { licenseTypeArray } from '../../../model/license';
import { LinkField } from '@prismicio/types';
import linkResolver from '../link-resolver';
import {
  isFilledLinkToDocument,
  isFilledLinkToMediaField,
  isFilledLinkToWebField,
} from '../types';

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
  link?: LinkField<string, string, any>
): string | undefined {
  if (link) {
    if (isFilledLinkToWebField(link) || isFilledLinkToMediaField(link)) {
      return link.url;
    } else if (isFilledLinkToDocument(link)) {
      return linkResolver(link);
    } else {
      console.warn(`Unable to construct link for ${JSON.stringify(link)}`);
    }
  }
}
