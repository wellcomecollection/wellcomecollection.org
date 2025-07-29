import {
  Concept,
  ConceptType,
} from '@weco/content/services/wellcome/catalogue/types';

type ConceptSection = {
  display: boolean;
  label?: string;
};

export type ConceptConfig = {
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
  collaborators: ConceptSection & {
    maxCount?: number;
  };
  relatedTopics: ConceptSection & { excludedTopics?: ConceptType[] };
};

const defaultConceptConfig: ConceptConfig = {
  displayName: {
    display: false,
  },
  partOf: {
    display: false,
  },
  sourcedDescription: {
    display: false,
  },
  fieldOrArea: {
    display: false,
  },
  imagesBy: {
    display: true,
    label: 'Images by this concept',
  },
  imagesAbout: {
    display: true,
    label: 'Images about this concept',
  },
  imagesIn: {
    display: false,
  },
  worksBy: {
    display: true,
    label: 'Works by this concept',
  },
  worksAbout: {
    display: true,
    label: 'Works about this concept',
  },
  worksIn: {
    display: false,
  },
  collaborators: {
    display: false,
  },
  relatedTopics: {
    display: false,
  },
};

// The API response hasn't been curated for the front-end in order to make as much content available to
// the wider public as possible. Here we define a config for each of the individual displayed concept types
// to simplify the front end templates (fewer hard-to-read conditionals). This will hopefully also help
// with explaining to non-devs how and why different concepts are expected to appear
export function makeConceptConfig(concept: Concept): ConceptConfig {
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
          label: 'Field of work',
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
        collaborators: {
          display: true,
          label: 'Frequent collaborators',
          maxCount: 12,
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
          label: 'Field of work',
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
        collaborators: {
          display: true,
          label: 'Frequent collaborators',
          maxCount: 12,
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
          label: 'Area of work',
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
        collaborators: {
          display: true,
          label: 'Frequent collaborators',
          maxCount: 12,
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
        collaborators: {
          display: false,
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
        collaborators: {
          display: true,
          label: `Top contributors to the collections in ${concept.displayLabel || concept.label}`,
          maxCount: 4,
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
        collaborators: {
          display: true,
          label:
            'Top contributors to the collections using this type/technique',
          maxCount: 4,
        },
        relatedTopics: {
          display: true,
          excludedTopics: ['Person', 'Organisation', 'Agent'],
        },
      };

    case 'Concept':
      return {
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
          label: 'Works by this topic',
        },
        worksAbout: {
          display: true,
          label: 'Works referencing this topic',
        },
        worksIn: {
          display: false,
        },
        collaborators: {
          display: false,
        },
        relatedTopics: {
          display: false,
        },
      };

    default:
      return defaultConceptConfig;
  }
}
