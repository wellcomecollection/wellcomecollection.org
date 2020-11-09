export type Work = {
  type: 'Work' | 'Collection' | 'Section' | 'Series';
  id: string;
  title: string;
  alternativeTitles: string[];
  referenceNumber: string;
  description: string;
  physicalDescription: string;
  workType: WorkType;
  lettering?: string;
  createdDate?: Period;
  contributors?: Contributor[];
  identifiers: Identifier[];
  subjects?: Subject;
  genres?: Genre;
  thumbnail?: DigitalLocation;
  items?: Item[];
  production: Production[];
  language: Language;
  edition?: string;
  notes?: Note[];
  duration?: number;
  collectionPath?: CollectionPath;
  collection?: Collection;
  images?: ImageInclude[];
  parts: Work[];
  partOf: Work[];
  precededBy: Work[];
  succeededBy: Work[];
};

type WorkType = {
  id: string;
  label: string;
  type: 'WorkType';
};

type Period = {
  id?: string;
  identifiers?: Identifier[];
  label: string;
  type: 'Period';
};

type Identifier = {
  value: string;
  type: 'Identifier';
};

type Agent = {
  id?: string;
  identifiers?: Identifier[];
  label: string;
  type: 'Agent';
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
  type: 'Subject';
};

type Concept = {
  id?: string;
  identifiers?: Identifier[];
  label: string;
};

export type DigitalLocation = {
  locationType: LocationType;
  url: string;
  credit?: string;
  license: License;
  accessConditions: AccessCondition[];
  type: 'DigitalLocation';
};

type PhysicalLocation = {
  locationType: LocationType;
  label: string;
  accessConditions: AccessCondition[];
  type: 'DigitalLocation';
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

type Item = {
  id?: string;
  identifiers?: Identifier[];
  title?: string;
  locations: Location[];
  type: 'Item';
};

type Date = {
  label: string;
  type: 'Period';
}

type Place = {
  id: string;
  identifiers: Identifier[];
  label: string;
  type: 'Place';
}

type Production = {
  label: string;
  places: Place[];
  agents: Agent[];
  dates: Date[];
  type: 'ProductionEvent';
}

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
  locations: Array<{
    url: string;
    Object;
  }>;
  source: {
    id: string;
    type: string;
  };
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

export type CatalogueAggregation = {
  buckets: CatalogueAggregationBucket[];
};

export type CatalogueAggregations = {
  workType: CatalogueAggregation;
  locationType: CatalogueAggregation;
};

export type CatalogueResultsList<Result = Work> = {
  type: 'ResultList';
  totalResults: number;
  results: Result[];
  pageSize: number;
  prevPage: string | null;
  nextPage: string | null;
  aggregations: {
    workType: CatalogueAggregation;
  } | null;
};

// export type CatalogueApiRedirect = {
//   type: 'Redirect',
//   status: number,
//   redirectToId: string,
// };
