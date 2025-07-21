import { ReturnedResults } from '@weco/common/utils/search';
import {
  Concept,
  ConceptType,
  Image as ImageType,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import { conceptTypeDisplayName } from '@weco/content/utils/concepts';

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

type ConceptConfig = {
  [key: string]: {
    imagesAbout: boolean;
    imagesbBy: boolean;
    worksAbout: boolean;
    worksBy: boolean;
    relatedTopics: boolean;
    contributors: {
      display: boolean;
      count: number;
    };
  };
};

type ConceptsConfig = {
  [key in ConceptType]?: ConceptConfig[key];
};

export const conceptsConfig: ConceptsConfig = {
  Person: {
    imagesAbout: true,
    imagesbBy: false,
    worksAbout: true,
    worksBy: true,
    relatedTopics: false,
    contributors: { display: true, count: 4 },
  },
  Organisation: {
    imagesAbout: false,
    imagesbBy: true,
    worksAbout: false,
    worksBy: true,
    relatedTopics: true,
    contributors: { display: true, count: 4 },
  },
};
