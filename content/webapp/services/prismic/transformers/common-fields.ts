import { PrismicDocument } from '@prismicio/types';
import * as prismicH from 'prismic-helpers-beta';
import { CommonPrismicFields } from '../types';
import { CommonFields } from '../../../types/common-fields';

export function transformCommonFields(
  document: PrismicDocument<CommonPrismicFields>
): CommonFields {
  const { id, data } = document;
  const title = prismicH.asText(data.title);

  return { id, title };
}
