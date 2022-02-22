import { isDocumentLink, asText, asHtml } from './parsers';
// $FlowFixMe
import type { Resource } from '../../model/resource';
import type { PrismicFragment } from './types';
import type { ExhibitionFormat } from '../../model/exhibitions';

export function parseResourceTypeList(
  fragment: PrismicFragment[],
  labelKey: string
): Resource[] {
  return fragment
    .map(label => label[labelKey])
    .filter(Boolean)
    .filter(label => label.isBroken === false)
    .map(label => parseResourceType(label.data));
}

function parseResourceType(fragment: PrismicFragment): Resource {
  return {
    id: fragment.id,
    title: asText(fragment.title),
    description: fragment.description,
    icon: fragment.icon,
  };
}

export function parseExhibitionFormat(frag: Object): ?ExhibitionFormat {
  return isDocumentLink(frag)
    ? {
        id: frag.id,
        title: (frag.data && asText(frag.data.title)) || '',
        description: frag.data && asHtml(frag.data.description),
      }
    : undefined;
}
