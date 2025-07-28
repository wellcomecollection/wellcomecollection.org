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
  displayName: ConceptSection;
  partOf: ConceptSection;
  sourcedDescription: ConceptSection;
  fieldOrArea: ConceptSection;
  imagesBy: ConceptSection;
  imagesAbout: ConceptSection;
  imagesIn: ConceptSection;
  worksBy: ConceptSection;
  worksAbout: ConceptSection;
  worksIn: ConceptSection;
  contributors: {
    maxCount: number;
    label?: string;
  };
  relatedTopics: {
    display: boolean;
    excludedTopics?: ConceptType[];
  };
};

export function makeConceptsConfig(
  concept: Concept
): ConceptConfig | undefined {
  switch (concept.type) {
    case 'Person':
      return {
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
          label: `Images by ${concept.displayLabel || concept.label}`,
        },
        imagesAbout: {
          display: true,
          label: `Images featuring ${concept.displayLabel || concept.label}`,
        },
        imagesIn: {
          display: false,
        },
        worksBy: {
          display: true,
          label: 'Works by this person',
        },
        worksIn: {
          display: false,
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
      };

    case 'Agent':
      return {
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
          label: `Images by ${concept.displayLabel || concept.label}`,
        },
        imagesAbout: {
          display: true,
          label: `Images referencing ${concept.displayLabel || concept.label}`,
        },
        imagesIn: {
          display: false,
        },
        worksBy: {
          display: true,
          label: 'Works by this person/group',
        },
        worksAbout: {
          display: true,
          label: 'Works referencing this person/group',
        },
        worksIn: {
          display: false,
        },
        contributors: {
          maxCount: 12,
          label: 'Frequent collaborators',
        },
        relatedTopics: {
          display: true,
          excludedTopics: ['Person', 'Organisation', 'Agent'],
        },
      };

    case 'Organisation':
      return {
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
          label: `Images produced by ${concept.displayLabel || concept.label}`,
        },
        imagesAbout: {
          display: true,
          label: `Images referencing ${concept.displayLabel || concept.label}`,
        },
        imagesIn: {
          display: false,
        },
        worksBy: {
          display: true,
          label: 'Works by this organisation',
        },
        worksAbout: {
          display: true,
          label: 'Works referencing this organisation',
        },
        worksIn: {
          display: false,
        },
        contributors: {
          maxCount: 12,
          label: 'Frequent collaborators',
        },
        relatedTopics: {
          display: true,
          excludedTopics: ['Person', 'Organisation', 'Agent'],
        },
      };

    case 'Place':
      return {
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
          label: `Images produced by ${concept.displayLabel || concept.label}`,
        },
        imagesAbout: {
          display: true,
          label: `Images referencing ${concept.displayLabel || concept.label}`,
        },
        imagesIn: {
          display: false,
        },
        worksBy: {
          display: true,
          label: 'Works produced by this place',
        },
        worksAbout: {
          display: true,
          label: 'Works referencing this place',
        },
        worksIn: {
          display: false,
        },
        contributors: {
          maxCount: 0,
        },
        relatedTopics: {
          display: true,
        },
      };

    case 'Subject':
      return {
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
        imagesIn: {
          display: false,
        },
        imagesAbout: {
          display: true,
          label: `Images about ${concept.displayLabel || concept.label}`,
        },
        worksBy: {
          display: false,
        },
        worksIn: {
          display: false,
        },
        worksAbout: {
          display: true,
          label: 'Works about this subject',
        },
        contributors: {
          maxCount: 4,
          label: `Top contributors to the collections in ${concept.displayLabel || concept.label}`,
        },
        relatedTopics: {
          display: true,
        },
      };

    case 'Genre':
      return {
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
          display: false,
        },
        imagesAbout: {
          display: true,
          label: `Images about ${concept.displayLabel || concept.label}`,
        },
        imagesIn: {
          display: true,
          label: `Images of ${concept.displayLabel || concept.label}`,
        },
        worksBy: {
          display: false,
        },
        worksAbout: {
          display: true,
          label: 'Works about this type/technique',
        },
        worksIn: {
          display: true,
          label: 'Works using this type/technique',
        },
        contributors: {
          maxCount: 4,
          label:
            'Top contributors to the collections using this type/technique',
        },
        relatedTopics: {
          display: true,
          excludedTopics: ['Person', 'Organisation', 'Agent'],
        },
      };
  }
}
