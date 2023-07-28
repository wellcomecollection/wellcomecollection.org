import {
  ArchiveLabels,
  getArchiveLabels,
  getCardLabels,
  getProductionDates,
} from '@weco/content/utils/works';
import { Work } from '.';
import { Label } from '@weco/common/model/labels';
import { DigitalLocation } from '@weco/common/model/catalogue';
import { OptionalToUndefined } from '@weco/common/utils/utility-types';

export type WorkBasic = OptionalToUndefined<{
  id: string;
  title: string;
  description?: string;
  languageId?: string;
  thumbnail?: DigitalLocation;
  referenceNumber?: string;
  productionDates: string[];
  archiveLabels?: ArchiveLabels;
  cardLabels: Label[];
  primaryContributorLabel?: string;
}>;

export function toWorkBasic(work: Work): WorkBasic {
  const { id, title, description, thumbnail, referenceNumber } = work;

  // We only send a lang if it's unambiguous -- better to send
  // no language than the wrong one.
  const languageId =
    work.languages && work.languages.length === 1
      ? work.languages[0].id
      : undefined;

  return {
    id,
    title,
    description,
    thumbnail,
    referenceNumber,
    languageId,
    productionDates: getProductionDates(work),
    archiveLabels: getArchiveLabels(work),
    cardLabels: getCardLabels(work),
    primaryContributorLabel: work.contributors.find(
      contributor => contributor.primary
    )?.agent.label,
  };
}
