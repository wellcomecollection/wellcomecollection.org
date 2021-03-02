export type Work = {
  type: 'Work' | 'Collection' | 'Section' | 'Series';
  id: string;
  title: string;
  alternativeTitles: string[];
  referenceNumber?: string;
  description?: string;
  physicalDescription: string;
  workType: WorkType;
  lettering?: string;
  createdDate?: Period;
  contributors: Contributor[];
  identifiers: Identifier[];
  subjects: Subject[];
  genres: Genre[];
  thumbnail?: DigitalLocation;
  items?: Item[];
  production: Production[];
  languages: Language[];
  edition?: string;
  notes: Note[];
  duration?: number;
  collectionPath?: CollectionPath;
  collection?: Collection;
  images?: ImageInclude[];
  parts: RelatedWork[];
  partOf: RelatedWork[];
  precededBy: RelatedWork[];
  succeededBy: RelatedWork[];
  totalParts?: number;
  totalDescendentParts?: number;
  availableOnline: boolean;
  '@context'?: string;
};

type MinimalRelatedWorkFields =
  | 'id'
  | 'title'
  | 'alternativeTitles'
  | 'referenceNumber'
  | 'availableOnline'
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

type IdentifierType = {
  id: string;
  label: string;
  type: 'IdentifierType';
};

type Identifier = {
  value: string;
  identifierType: IdentifierType;
  type: 'Identifier';
};

type AgentType = 'Agent' | 'Person' | 'Organisation' | 'Meeting';

type Agent = {
  id?: string;
  identifiers?: Identifier[];
  label: string;
  type: AgentType;
};

type ContributorRole = {
  label: string;
  type: 'ContributionRole';
};

type Contributor = {
  agent: Agent;
  roles: ContributorRole[];
  type: 'Contributor';
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

type ConceptType = 'Concept' | 'Period' | 'Place';

type Concept = {
  id?: string;
  identifiers?: Identifier[];
  label: string;
  type: ConceptType;
};

export type DigitalLocation = {
  locationType: LocationType;
  url: string;
  credit?: string;
  license: License;
  accessConditions: AccessCondition[];
  type: 'DigitalLocation';
};

export type PhysicalLocation = {
  locationType: LocationType;
  label: string;
  accessConditions: AccessCondition[];
  type: 'PhysicalLocation';
};

type Location = DigitalLocation | PhysicalLocation;

type LocationType = {
  id: string;
  label: string;
  type: 'LocationType';
};

type License = {
  id: string;
  label: string;
  url: string;
  type: 'License';
};

type AccessCondition = {
  status?: AccessStatus;
  terms?: string;
  to?: string;
  type: 'AccessCondition';
};

type AccessStatus = {
  id: string;
  label: string;
  type: 'AccessStatus';
};

export type Item = {
  id?: string;
  identifiers?: Identifier[];
  title?: string;
  locations: Location[];
  type: 'Item';
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
  id?: string;
  label: string;
  type: 'Language';
};

type Note = {
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

type Collection = {
  path: CollectionPath;
  work?: Work;
  children?: Collection[];
  type: 'Collection';
};

type CollectionPath = {
  path: string;
  level?: string;
  label?: string;
  type: 'CollectionPath';
};

// Response objects
export type CatalogueApiError = {
  errorType: string;
  httpStatus: number;
  label: string;
  description: string;
  type: 'Error';
};

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
    type: string;
  };
  visuallySimilar?: Image[];
};

// export type CatalogueApiError = {|
//   errorType: string,
//   httpStatus: number,
//   label: string,
//   description: string,
//   type: 'Error',
// |};

export type CatalogueAggregationBucket = {
  count: number;
  data: {
    id: string;
    label: string;
    type: string;
  };
  type: 'AggregationBucket';
};

export type CatalogueAggregationBucketNoId = {
  count: number;
  data: {
    label: string;
    type: string;
  };
  type: 'AggregationBucket';
};

export type CatalogueAggregationContributorsBucket = {
  count: number;
  data: {
    agent: {
      label: string;
      type: string;
    };
  };
  type: 'AggregationBucket';
};

export type CatalogueAggregationContributor = {
  buckets: CatalogueAggregationContributorsBucket[];
};

export type CatalogueAggregation = {
  buckets: CatalogueAggregationBucket[];
};

export type CatalogueAggregationNoId = {
  buckets: CatalogueAggregationBucketNoId[];
};

export type CatalogueAggregations = {
  workType: CatalogueAggregation;
  locationType: CatalogueAggregation;
  languages?: CatalogueAggregation;
  genres?: CatalogueAggregationNoId;
  subjects?: CatalogueAggregationNoId;
  contributors?: CatalogueAggregationContributor;
};

export type CatalogueResultsList<Result = Work> = {
  type: 'ResultList';
  totalResults: number;
  results: Result[];
  pageSize: number;
  prevPage: string | null;
  nextPage: string | null;
  aggregations?: CatalogueAggregations;
};
