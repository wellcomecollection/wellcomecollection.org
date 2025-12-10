import { Label } from '@weco/common/model/labels';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import { ContentApiLinkedWork } from '@weco/content/services/wellcome/content/types/api';

export function transformCardData(work: WorkBasic | ContentApiLinkedWork) {
  const isCatalogueWork = 'notes' in work;

  const thumbnailUrl = isCatalogueWork
    ? work.thumbnail?.url
    : work.thumbnailUrl;

  const date = isCatalogueWork
    ? work.productionDates.length > 0
      ? work.productionDates[0]
      : undefined
    : work.date;

  const mainContributor = isCatalogueWork
    ? work.primaryContributorLabel
    : work.mainContributor;

  const labels = isCatalogueWork
    ? work.cardLabels
    : work.workType
      ? ([
          {
            text: work.workType,
            labelColor: 'warmNeutral.300',
          },
        ] as Label[])
      : [];

  return {
    thumbnailUrl,
    date,
    mainContributor,
    labels,
  };
}
