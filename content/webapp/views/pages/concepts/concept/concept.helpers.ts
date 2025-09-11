import { ReturnedResults } from '@weco/common/utils/search';
import { ConceptConfig } from '@weco/content/contexts/ConceptPageContext/concept.config';
import {
  Image as ImageType,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';

export type ThemeTabType = 'by' | 'in' | 'about';
export const themeTabOrder: ThemeTabType[] = ['by', 'in', 'about'];

export type SectionData = {
  works?: ReturnedResults<WorkBasic>;
  images?: ReturnedResults<ImageType>;
  totalResults: { works?: number; images?: number };
};

export type ThemePageSectionsData = {
  about: SectionData;
  by: SectionData;
  in: SectionData;
};

export function getSectionTypeLabel(
  tabType: ThemeTabType,
  config: ConceptConfig,
  sectionType: 'images' | 'works'
): string {
  const capitalisedSectionType = sectionType === 'images' ? 'Images' : 'Works';

  switch (tabType) {
    case 'by':
      return config[`${sectionType}By`].label || capitalisedSectionType;
    case 'about':
      return config[`${sectionType}About`].label || capitalisedSectionType;
    case 'in':
      return config[`${sectionType}In`].label || capitalisedSectionType;
    default:
      return capitalisedSectionType;
  }
}
