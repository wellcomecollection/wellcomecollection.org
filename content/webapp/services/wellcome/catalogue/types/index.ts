import {
  Agent,
  Contributor,
  DigitalLocation,
  Identifier,
  Location,
  PhysicalLocation,
} from '@weco/common/model/catalogue';
import { WellcomeResultList } from '@weco/content/services/wellcome';

import {
  ConceptAggregations,
  ImageAggregations,
  WorkAggregations,
} from './aggregations';
import {
  CatalogueConceptsApiProps,
  CatalogueImagesApiProps,
  CatalogueWorksApiProps,
} from './api';
import { toWorkBasic, WorkBasic } from './work';

export type {
  CatalogueWorksApiProps,
  CatalogueImagesApiProps,
  CatalogueConceptsApiProps,
  ConceptAggregations,
  ImageAggregations,
  WorkAggregations,
  WorkBasic,
};

export { toWorkBasic };

export type Work = {
  type: 'Work' | 'Collection' | 'Section' | 'Series';
  id: string;
  title: string;
  alternativeTitles: string[];
  referenceNumber?: string;
  description?: string;
  physicalDescription: string;
  workType?: WorkType;
  lettering?: string;
  createdDate?: Period;
  contributors: Contributor[];
  identifiers: Identifier[];
  subjects: Subject[];
  genres: Genre[];
  thumbnail?: DigitalLocation;
  items?: Item<Location>[];
  production: Production[];
  currentFrequency?: string;
  formerFrequency: string[];
  designation: string[];
  languages: Language[];
  edition?: string;
  notes: Note[];
  duration?: number;
  images?: ImageInclude[];
  parts: RelatedWork[];
  partOf: RelatedWork[];
  precededBy: RelatedWork[];
  succeededBy: RelatedWork[];
  totalParts?: number;
  totalDescendentParts?: number;
  availableOnline?: boolean;
  availabilities?: Availability[];
  holdings: Holding[];
};

export type ItemsList = {
  type: 'ItemsList';
  totalResults: number;
  results: Item<Location>[];
};

export type Holding = {
  note?: string;
  enumeration: string[];
  location?: Location;
  type: 'Holdings';
};

type MinimalRelatedWorkFields =
  | 'id'
  | 'title'
  | 'alternativeTitles'
  | 'referenceNumber'
  | 'availableOnline'
  | 'availabilities'
  | 'type';
export type RelatedWork = Partial<Work> & Pick<Work, MinimalRelatedWorkFields>;

type WorkType = {
  id: string;
  label: string;
  type: 'Format';
};

type Period = {
  id?: string;
  identifiers?: Identifier[];
  label: string;
  type: 'Period';
};

type Subject = {
  id?: string;
  identifiers?: Identifier[];
  label: string;
  concepts: Concept[];
  type: 'Subject';
};

type Genre = {
  label: string;
  concepts: Concept[];
  type: 'Genre';
};

type ConceptType =
  | 'Subject'
  | 'Meeting'
  | 'Organisation'
  | 'Person'
  | 'Concept'
  | 'Period'
  | 'Place'
  | 'Genre';

export type RelatedConcept = {
  label: string;
  id: string;
  relationshipType?: string;
};

export type Concept = {
  id?: string;
  identifiers?: Identifier[];
  label: string;
  type: ConceptType;
  sameAs?: string[];
  description?: string;
  relatedConcepts?: {
    fieldsOfWork?: RelatedConcept[];
    relatedTo?: RelatedConcept[];
    narrowerThan?: RelatedConcept[];
    broaderThan?: RelatedConcept[];
    people?: RelatedConcept[];
    referencedTogether?: RelatedConcept[];
  };
  alternativeLabels?: string[];
};

type Availability = {
  id: string;
  label: string;
  type: 'Availability';
};

export type Item<LocationType> = {
  id?: string;
  identifiers?: Identifier[];
  title?: string;
  locations: LocationType[];
  type: 'Item';
  note?: string;
  availableDates?: AvailabilitySlot[];
};

export type PhysicalItem = Item<PhysicalLocation> & {
  status?: {
    id: string;
    label: string;
    type: string;
  };
};

export type AvailabilitySlot = {
  from: string;
  to: string;
};

type Date = {
  label: string;
  type: 'Period';
};

type Place = {
  id?: string;
  identifiers?: Identifier[];
  label: string;
  type: 'Place';
};

type Production = {
  label: string;
  places: Place[];
  agents: Agent[];
  dates: Date[];
  type: 'ProductionEvent';
};

type Language = {
  id: string;
  label: string;
  type: 'Language';
};

export type Note = {
  contents: string[];
  noteType: NoteType;
  type: 'Note';
};

type NoteType = {
  id: string;
  label: string;
  type: 'NoteType';
};

type ImageInclude = {
  id: string;
  type: 'Image';
};

// Response objects
export type CatalogueApiRedirect = {
  status: number;
  redirectToId: string;
  type: 'Redirect';
};

export type Image = {
  type: 'Image';
  id: string;
  locations: DigitalLocation[];
  source: {
    id: string;
    title: string;
    contributors?: Contributor[];
    type: string;
  };
  withSimilarFeatures?: Image[];
  aspectRatio?: number;
  requestUrl?: string;
};

export type ResultType = Work | Image | Concept;

type CatalogueAggregations<Result extends ResultType> = Result extends Work
  ? WorkAggregations
  : Result extends Image
    ? ImageAggregations
    : Result extends Concept
      ? ConceptAggregations
      : undefined;

export type CatalogueResultsList<Result extends ResultType> =
  WellcomeResultList<Result, CatalogueAggregations<Result>>;
