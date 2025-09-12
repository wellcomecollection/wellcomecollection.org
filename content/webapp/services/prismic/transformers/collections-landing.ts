// This is temporary as I believe we'll be fetching everything we need from the Content API
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { transformContentListSlice } from '@weco/content/services/prismic/transformers/body';
import { isContentList } from '@weco/content/types/body';
import { MultiContent } from '@weco/content/types/multi-content';
import { Page as PageType } from '@weco/content/types/pages';

/** The Collections page in Prismic includes a content list which is used to pick
 * items for the 'Inside our collections' promo section.
 */

export function getInsideOurCollectionsCards(
  collectionsLanding: PageType
): MultiContent[] {
  const contentLists = collectionsLanding.untransformedBody
    .filter(isContentList)
    .map(transformContentListSlice);

  return contentLists
    .filter(slice => slice.value.title === 'Inside our collections')
    .flatMap(slice => slice.value.items)
    .map(item => {
      return item.type === 'articles'
        ? {
            type: 'articles' as const,
            id: item.id,
            uid: item.uid,
            url: linkResolver(item),
            title: item.title,
            image: item.promo?.image,
            promo: item.promo,
            description: item.promo?.caption,
            series: item.series ?? [],
            datePublished: item.datePublished,
            labels: item.labels ?? [],
            hasLinkedWorks: item.hasLinkedWorks ?? false,
          }
        : undefined;
    })
    .filter(isNotUndefined);
}
