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

type ConceptSection = {
  display: boolean;
  label?: string;
};

type ConceptConfig = {
  [key: string]: {
    displayName: ConceptSection;
    partOf: ConceptSection;
    sourcedDescription: ConceptSection;
    fieldOrArea: ConceptSection;
    imagesBy: ConceptSection;
    imagesAbout: ConceptSection;
    worksBy: ConceptSection;
    worksAbout: ConceptSection;
    contributors: {
      maxCount: number;
      label?: string;
    };
    relatedTopics: {
      display: boolean;
      excludedTopics?: ConceptType[];
    };
  };
};

type ConceptsConfig = {
  [key in ConceptType]?: ConceptConfig[key];
};

export const conceptsConfig: ConceptsConfig = {
  Person: {
    displayName: {
      display: false,
    },
    sourcedDescription: {
      display: true,
    },
    partOf: {
      display: false,
    },
    fieldOrArea: {
      display: true,
      label: 'Field',
    },
    imagesBy: {
      display: true,
      label: 'Images by',
    },
    imagesAbout: {
      display: true,
      label: 'Images featuring',
    },
    worksBy: {
      display: true,
      label: 'Works by this person',
    },
    worksAbout: {
      display: true,
      label: 'Works featuring this person',
    },
    contributors: {
      maxCount: 12,
      label: 'Frequent collaborators',
    },
    relatedTopics: {
      display: true,
      excludedTopics: ['Person', 'Organisation', 'Agent'],
    },
  },
  Agent: {
    displayName: {
      display: true,
      label: 'Person/group',
    },
    sourcedDescription: {
      display: true,
    },
    partOf: {
      display: false,
    },
    fieldOrArea: {
      display: true,
      label: 'Field',
    },
    imagesBy: {
      display: true,
      label: 'Images by',
    },
    imagesAbout: {
      display: true,
      label: 'Images referencing',
    },
    worksBy: {
      display: true,
      label: 'Works by this person/group',
    },
    worksAbout: {
      display: true,
      label: 'Works referencing this person/group',
    },
    contributors: {
      maxCount: 12,
      label: 'Frequent collaborators',
    },
    relatedTopics: {
      display: true,
      excludedTopics: ['Person', 'Organisation', 'Agent'],
    },
  },
  Organisation: {
    displayName: {
      display: false,
    },
    sourcedDescription: {
      display: true,
    },
    partOf: {
      display: false,
    },
    fieldOrArea: {
      display: true,
      label: 'Area',
    },
    imagesBy: {
      display: true,
      label: 'Images produced by',
    },
    imagesAbout: {
      display: true,
      label: 'Images referencing',
    },
    worksBy: {
      display: true,
      label: 'Works by this organisation',
    },
    worksAbout: {
      display: true,
      label: 'Works referencing this organisation',
    },
    contributors: {
      maxCount: 12,
      label: 'Frequent collaborators',
    },
    relatedTopics: {
      display: true,
      excludedTopics: ['Person', 'Organisation', 'Agent'],
    },
  },
  Place: {
    displayName: {
      display: false,
    },
    sourcedDescription: {
      display: true,
    },
    partOf: {
      display: false,
    },
    fieldOrArea: {
      display: false,
    },
    imagesBy: {
      display: true,
      label: 'Images produced by',
    },
    imagesAbout: {
      display: true,
      label: 'Images referencing',
    },
    worksBy: {
      display: true,
      label: 'Works produced by this place',
    },
    worksAbout: {
      display: true,
      label: 'Works referencing this place',
    },
    contributors: {
      maxCount: 0,
    },
    relatedTopics: {
      display: true,
    },
  },
  Subject: {
    displayName: {
      display: false,
    },
    sourcedDescription: {
      display: false,
    },
    partOf: {
      display: true,
    },
    fieldOrArea: {
      display: false,
    },
    imagesBy: {
      display: false,
    },
    imagesAbout: {
      display: true,
      label: 'Images about',
    },
    worksBy: {
      display: false,
    },
    worksAbout: {
      display: true,
      label: 'Works about this subject',
    },
    contributors: {
      maxCount: 4,
      label: 'Top contributors to the collections in',
    },
    relatedTopics: {
      display: true,
    },
  },
  Genre: {
    displayName: {
      display: true,
      label: 'Type/technique',
    },
    sourcedDescription: {
      display: true,
    },
    partOf: {
      display: false,
    },
    fieldOrArea: {
      display: false,
    },
    imagesBy: {
      display: true,
      label: 'Images of',
    },
    imagesAbout: {
      display: true,
      label: 'Images about',
    },
    worksBy: {
      display: true,
      label: 'Works using this type/technique',
    },
    worksAbout: {
      display: true,
      label: 'Works about this type/technique',
    },
    contributors: {
      maxCount: 4,
      label: 'Top contributors to the collections using this type/technique',
    },
    relatedTopics: {
      display: true,
      excludedTopics: ['Person', 'Organisation', 'Agent'],
    },
  },
  Concept: {
    displayName: {
      display: true,
      label: 'Topic',
    },
    sourcedDescription: {
      display: true,
    },
    partOf: {
      display: false,
    },
    fieldOrArea: {
      display: false,
    },
    imagesBy: {
      display: true,
      label: 'Images produced by',
    },
    imagesAbout: {
      display: true,
      label: 'Images referencing',
    },
    worksBy: {
      display: true,
      label: 'Works by this topic',
    },
    worksAbout: {
      display: true,
      label: 'Works referencing this topic',
    },
    contributors: {
      maxCount: 0,
    },
    relatedTopics: {
      display: false,
    },
  },
};
