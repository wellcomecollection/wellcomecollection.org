import { clock } from '@weco/common/icons';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { collectionVenueId } from '@weco/common/data/hardcoded-ids';

import { isContentList } from '../../../types/body';
import { FacilityPromo as FacilityPromoType } from '../../../types/facility-promo';
import { Page as PageType } from '../../../types/pages';

/** The What's On page in Prismic includes a content list which is used to pick
 * items for the 'Try these too' promo section.
 *
 * This extracts them from the page, and also adds a bit of extra info we can't
 * easily record in Prismic.
 *
 */

export function getTryTheseTooPromos(
  whatsOnPage: PageType
): FacilityPromoType[] {
  return whatsOnPage.body
    .filter(isContentList)
    .filter(slice => slice.value.title === 'Try these too')
    .flatMap(slice => slice.value.items)
    .map(item =>
      item.type === 'pages'
        ? {
            id: item.id,
            url: `/pages/${item.id}`,
            title: item.title,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            image: item.promo!.image!,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            description: item.promo!.caption!,
          }
        : undefined
    )
    .filter(isNotUndefined);
}

export function enrichTryTheseTooPromos(
  promos: FacilityPromoType[]
): FacilityPromoType[] {
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
