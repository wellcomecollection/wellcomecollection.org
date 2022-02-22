import { asText } from './parsers';
// $FlowFixMe
import type { Resource } from '../../model/resource';
import type { PrismicFragment } from './types';

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
