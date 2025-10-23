import { Label } from '@weco/common/model/labels';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import { ContentApiLinkedWork } from '@weco/content/services/wellcome/content/types/api';

export function transformCardData(work: WorkBasic | ContentApiLinkedWork) {
  // Type guard - check for catalogue-specific fields
  const isCatalogueWork =
    'productionDates' in work || 'cardLabels' in work || 'thumbnail' in work;

  const thumbnailUrl = isCatalogueWork
    ? (work as WorkBasic).thumbnail?.url
    : (work as ContentApiLinkedWork).thumbnailUrl;

  const date = isCatalogueWork
    ? (work as WorkBasic).productionDates.length > 0
      ? (work as WorkBasic).productionDates[0]
      : undefined
    : (work as ContentApiLinkedWork).date;

  const mainContributor = isCatalogueWork
    ? (work as WorkBasic).primaryContributorLabel
    : (work as ContentApiLinkedWork).mainContributor;

  const labels = isCatalogueWork
    ? (work as WorkBasic).cardLabels
    : (work as ContentApiLinkedWork).workType
      ? ([
          {
            text: (work as ContentApiLinkedWork).workType,
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
