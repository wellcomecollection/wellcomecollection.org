import { clock } from '@weco/common/icons';
import { isNotUndefined } from '@weco/common/utils/array';

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
  const facilityPromoMetas = {
    'The Reading Room': {
      metaIcon: clock,
      metaText: 'Open during gallery hours',
    },
  };

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
            // Add any extra meta information which can't be recorded in Prismic
            ...(facilityPromoMetas[item.title]
              ? facilityPromoMetas[item.title]
              : {}),
          }
        : undefined
    )
    .filter(isNotUndefined);
}
