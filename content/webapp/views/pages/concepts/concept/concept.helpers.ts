import { ReturnedResults } from '@weco/common/utils/search';
import {
  Concept,
  ConceptType,
  Image as ImageType,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import { conceptTypeDisplayName } from '@weco/content/utils/concepts';

import { makeConceptConfig } from './concept.config';

export type ThemeTabType = 'by' | 'in' | 'about';
export const themeTabOrder: ThemeTabType[] = ['by', 'in', 'about'];

export type SectionData = {
  label: string;
  works?: ReturnedResults<WorkBasic>;
  images?: ReturnedResults<ImageType>;
  totalResults: { works?: number; images?: number };
};

export type ThemePageSectionsData = {
  about: SectionData;
  by: SectionData;
  in: SectionData;
};

const getThemeTabLabel = (tabType: ThemeTabType, conceptType: ConceptType) => {
  if (tabType === 'about' && conceptType === 'Person') return 'featuring';
  return tabType;
};

export const getThemeSectionHeading = (
  tabType: ThemeTabType,
  concept: Concept,
  isLong = false
) => {
  const tabLabel = getThemeTabLabel(tabType, concept.type);
  const conceptTypeLabel = conceptTypeDisplayName(concept).toLowerCase();

  if (isLong && concept.type === 'Person') {
    return `${tabLabel} ${concept.displayLabel || concept.label}`;
  }

  return `${tabLabel} this ${conceptTypeLabel}`;
};

export function getImagesSectionHeading(
  tabType: ThemeTabType,
  concept: Concept
) {
  const config = makeConceptConfig(concept);
  switch (tabType) {
    case 'by':
      return config?.imagesBy.label;
    case 'about':
      return config?.imagesAbout.label;
    case 'in':
      return config?.imagesIn.label;
    default:
      return '';
  }
}

export function getWorksTabHeading(tabType: ThemeTabType, concept: Concept) {
  const config = makeConceptConfig(concept);
  switch (tabType) {
    case 'by':
      return config?.worksBy.label;
    case 'about':
      return config?.worksAbout.label;
    case 'in':
      return config?.worksIn.label;
    default:
      return '';
  }
}
