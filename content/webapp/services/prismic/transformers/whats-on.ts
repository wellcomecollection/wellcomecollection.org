import { collectionVenueId } from '@weco/common/data/hardcoded-ids';
import { clock } from '@weco/common/icons';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { transformContentListSlice } from '@weco/content/services/prismic/transformers/body';
import { isContentList } from '@weco/content/types/body';
import { FacilityCard as FacilityCardType } from '@weco/content/types/facility';
import { Page as PageType } from '@weco/content/types/pages';

/** The What's On page in Prismic includes a content list which is used to pick
 * items for the 'Try these too' promo section.
 *
 * This extracts them from the page, and also adds a bit of extra info we can't
 * easily record in Prismic.
 *
 */

export function getTryTheseTooPromos(
  whatsOnPage: PageType
): FacilityCardType[] {
  const contentLists = whatsOnPage.untransformedBody
    .filter(isContentList)
    .map(transformContentListSlice);
  return contentLists
    .filter(slice => slice.value.title === 'Try these too')
    .flatMap(slice => slice.value.items)
    .map(item =>
      item.type === 'pages'
        ? {
            id: item.id,
            url: linkResolver(item),
            title: item.title,
            image: item.promo!.image!,
            description: item.promo!.caption!,
          }
        : undefined
    )
    .filter(isNotUndefined);
}

export function enrichTryTheseTooPromos(
  promos: FacilityCardType[]
): FacilityCardType[] {
  const facilityPromoMetas = {
    [collectionVenueId.readingRoom.id]: {
      metaIcon: clock,
      metaText: 'Open during gallery hours',
    },
  };

  return promos.map(p => ({
    ...p,
    // Add any extra meta information which can't be recorded in Prismic
    ...(facilityPromoMetas[p.id] ? facilityPromoMetas[p.id] : {}),
  }));
}
