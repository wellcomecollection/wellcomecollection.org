import { ExploreMoreDocument as RawExploreMoreDocument } from '@weco/common/prismicio-types';
import { ExploreMore } from '@weco/content/types/explore-more';

import { asRichText, asTitle } from '.';

export function transformExploreMore(
  document: RawExploreMoreDocument
): ExploreMore {
  const { data } = document;

  return {
    id: document.id,
    uid: document.uid,
    title: asTitle(data.title),
    description: data.description ? asRichText(data.description) : undefined,
    slices: data.slices,
  };
}
