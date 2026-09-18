import { DigitalLocation } from '@weco/common/model/catalogue';
import { Label } from '@weco/common/model/labels';
import { OptionalToUndefined } from '@weco/common/utils/utility-types';
import { Note } from '@weco/content/services/wellcome/catalogue/types';
import {
  ArchiveLabels,
  getArchiveLabels,
  getCardLabels,
  getLanguageId,
  getProductionDates,
  isArchiveCollectionRoot,
} from '@weco/content/utils/works';

import { Work } from '.';

export type WorkBasic = OptionalToUndefined<{
  id: string;
  title: string;
  workTypeId?: string;
  thumbnail?: DigitalLocation;
  referenceNumber?: string;
  languageId?: string;
  productionDates: string[];
  archiveLabels?: ArchiveLabels;
  cardLabels: Label[];
  primaryContributorLabel?: string;
  notes: Note[];
  isArchiveCollectionRoot: boolean;
  physicalDescription: string;
}>;

export function toWorkBasic(work: Work): WorkBasic {
  const {
    id,
    title,
    notes,
    physicalDescription,
    referenceNumber,
    thumbnail,
    workType,
  } = work;

  const languageId = getLanguageId(work);

  return {
    id,
    title,
    workTypeId: workType?.id,
    thumbnail,
    referenceNumber,
    languageId,
    productionDates: getProductionDates(work),
    archiveLabels: getArchiveLabels(work),
    cardLabels: getCardLabels(work),
    primaryContributorLabel: work.contributors.find(
      contributor => contributor.primary
    )?.agent.label,
    notes,
    isArchiveCollectionRoot: isArchiveCollectionRoot(work),
    physicalDescription,
  };
}
