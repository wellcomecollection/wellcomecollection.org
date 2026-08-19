/**
 * This file is generated from wellcomecollection/catalogue-api's OpenAPI spec
 * (reference/catalogue.yaml) by `yarn generate:catalogue-types`.
 * Do not edit it by hand.
 */

export interface paths {
  '/works': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * /works
     * @description Returns a paginated list of works
     */
    get: operations['getWorks'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/works/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * /works/{id}
     * @description Returns a single work
     */
    get: operations['getWork'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/images': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * /images
     * @description Returns a paginated list of images
     */
    get: operations['getImages'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/images/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * /images/{id}
     * @description Returns a single image
     */
    get: operations['getImage'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/concepts': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * /concepts
     * @description Returns a paginated list of concepts
     */
    get: operations['getConcepts'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/concepts/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * /concepts/{id}
     * @description Returns a single concept
     */
    get: operations['getConcept'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    /**
     * AccessCondition
     * @description Information about any access restrictions placed on the work
     */
    AccessCondition: {
      method?: components['schemas']['AccessMethod'];
      status?: components['schemas']['AccessStatus'];
      terms?: string;
      note?: string;
      /** @default AccessCondition */
      type: string;
    };
    /**
     * AccessMethod
     * @example {
     *       "id": "online-request",
     *       "label": "Online request",
     *       "type": "AccessMethod"
     *     }
     */
    AccessMethod: {
      /** @enum {string} */
      id?:
        | 'online-request'
        | 'manual-request'
        | 'not-requestable'
        | 'view-online'
        | 'open-shelves';
      /** @enum {string} */
      label?:
        | 'Online request'
        | 'Manual request'
        | 'Not requestable'
        | 'View online'
        | 'Open shelves';
      /** @default AccessMethod */
      type: string;
    };
    /**
     * AccessStatus
     * @description The access status of an item. Note that this can carry statuses which the
     *     `items.locations.accessConditions.status` filter does not accept, such as
     *     `temporarily-unavailable`.
     */
    AccessStatus: {
      id?: string;
      label?: string;
      /** @default AccessStatus */
      type: string;
    };
    /**
     * Agent
     * @description A person, organisation, meeting or other entity that can act on a work.
     */
    Agent: {
      id?: string;
      label?: string;
      identifiers?: components['schemas']['Identifier'][];
      /** @enum {string} */
      type?: 'Agent' | 'Person' | 'Organisation' | 'Meeting';
    };
    /**
     * Aggregation
     * @description An aggregation over the results.
     */
    Aggregation: {
      buckets?: components['schemas']['AggregationBucket'][];
      /** @default Aggregation */
      type: string;
    };
    /**
     * AggregationBucket
     * @description An individual bucket within an aggregation.
     */
    AggregationBucket: {
      /**
       * @description The thing being aggregated over. `id` is only populated when the aggregation
       *     was requested by its id-based name.
       */
      data?: {
        id?: string;
        label?: string;
      };
      /**
       * Format: int32
       * @description The count of how often this data occurs in this set of results.
       */
      count?: number;
      /** @default AggregationBucket */
      type: string;
    };
    /**
     * ArchiveCategory
     * @description A recognised category of archive, e.g. 'Personal Papers' for archives whose collection path starts with `PP/`.
     */
    ArchiveCategory: {
      id?: string;
      label?: string;
      type?: string;
    };
    /**
     * Availability
     * @description Ways in which the work is available to access
     */
    Availability: {
      /** @enum {string} */
      id?: 'open-shelves' | 'closed-stores' | 'online';
      label?: string;
      type?: string;
    };
    /**
     * Concept
     * @description Concepts are the units of thought — ideas, meanings, or (categories of) objects and events — which underlie many knowledge organization systems. As such, concepts exist in the mind as abstract entities which are independent of the terms used to label them.
     */
    Concept: {
      id?: string;
      label?: string;
      /** @description The label to show to users. May differ from `label`. */
      displayLabel?: string;
      /** @description Alternative labels for the concept. */
      alternativeLabels?: string[];
      description?: components['schemas']['ConceptDescription'];
      identifiers?: components['schemas']['Identifier'][];
      relatedConcepts?: components['schemas']['RelatedConcepts'];
      /** @description The ids of other concepts that refer to the same thing. */
      sameAs?: string[];
      /** @description Locations of images used to illustrate the concept. */
      displayImages?: components['schemas']['DigitalLocation'][];
      /** @enum {string} */
      type?:
        | 'Agent'
        | 'Concept'
        | 'Genre'
        | 'Meeting'
        | 'Organisation'
        | 'Period'
        | 'Person'
        | 'Place'
        | 'Subject';
    };
    /**
     * ConceptStub
     * @description A concept as it appears nested inside a work's subjects, genres or production
     *     events. Unlike the `Concept` returned by `/concepts`, this carries only enough
     *     to identify and label the concept.
     */
    ConceptStub: {
      id?: string;
      label?: string;
      identifiers?: components['schemas']['Identifier'][];
      /** @enum {string} */
      type?:
        | 'Agent'
        | 'Concept'
        | 'Genre'
        | 'Meeting'
        | 'Organisation'
        | 'Period'
        | 'Person'
        | 'Place'
        | 'Subject';
    };
    /**
     * ConceptDescription
     * @description A short description of a concept, drawn from an external source.
     */
    ConceptDescription: {
      text?: string;
      /** @description The source the description was taken from, e.g. `wikidata`. */
      sourceLabel?: string;
      /** @description A link to the description in its source. */
      sourceUrl?: string;
    };
    /**
     * RelatedConcept
     * @description A stub representing a concept related to another concept.
     */
    RelatedConcept: {
      id?: string;
      label?: string;
      conceptType?: string;
    };
    /**
     * RelatedConcepts
     * @description Concepts related to this one, grouped by the nature of the relationship.
     */
    RelatedConcepts: {
      relatedTo?: components['schemas']['RelatedConcept'][];
      fieldsOfWork?: components['schemas']['RelatedConcept'][];
      narrowerThan?: components['schemas']['RelatedConcept'][];
      broaderThan?: components['schemas']['RelatedConcept'][];
      people?: components['schemas']['RelatedConcept'][];
      frequentCollaborators?: components['schemas']['RelatedConcept'][];
      relatedTopics?: components['schemas']['RelatedConcept'][];
      foundedBy?: components['schemas']['RelatedConcept'][];
    };
    /**
     * ConceptResultList
     * @description A paginated list of concepts.
     */
    ConceptResultList: {
      /** @default ResultList */
      type: string;
      /** Format: int32 */
      pageSize?: number;
      /** Format: int32 */
      totalPages?: number;
      /** Format: int32 */
      totalResults?: number;
      results?: components['schemas']['Concept'][];
      prevPage?: string;
      nextPage?: string;
    };
    /**
     * ContributionRole
     * @description A contribution role
     */
    ContributionRole: {
      label?: string;
      type?: string;
    };
    /**
     * Contributor
     * @description A contributor
     */
    Contributor: {
      agent?: components['schemas']['Agent'];
      roles?: components['schemas']['ContributionRole'][];
      /** @description Whether this is the primary contributor to the work. */
      primary?: boolean;
      type?: string;
    };
    /**
     * DigitalLocation
     * @description A digital location that provides access to an item
     */
    DigitalLocation: {
      locationType?: components['schemas']['LocationType'];
      /** @description The URL of the digital asset. */
      url?: string;
      /** @description Who to credit the image to */
      credit?: string;
      /** @description Text that can be used when linking to the item - for example, 'View this journal' rather than the raw URL */
      linkText?: string;
      license?: components['schemas']['License'];
      accessConditions?: components['schemas']['AccessCondition'][];
      /**
       * @description discriminator enum property added by openapi-typescript
       * @enum {string}
       */
      type: 'DigitalLocation';
    };
    /** Error */
    Error: {
      /**
       * @description The type of error
       * @enum {string}
       */
      errorType?: 'http';
      /**
       * Format: int32
       * @description The HTTP response status code
       */
      httpStatus?: number;
      /** @description The title or other short name of the error */
      label?: string;
      /** @description The specific error */
      description?: string;
      /** @default Error */
      type: string;
    };
    /**
     * Format
     * @description A broad, top-level description of the form of a work: namely, whether it is a printed book, archive, painting, photograph, moving image, etc.
     */
    Format: {
      id?: string;
      label?: string;
      type?: string;
    };
    /**
     * Genre
     * @description A genre
     */
    Genre: {
      /** @description A label given to a thing. */
      label?: string;
      concepts?: components['schemas']['ConceptStub'][];
      type?: string;
    };
    /**
     * Holdings
     * @description A collection of materials owned by the library.
     */
    Holdings: {
      /** @description Additional information about the holdings. */
      note?: string;
      enumeration?: string[];
      /** @description The location of the holdings */
      location?:
        | components['schemas']['DigitalLocation']
        | components['schemas']['PhysicalLocation'];
      type?: string;
    };
    /**
     * Identifier
     * @description A unique system-generated identifier that governs interaction between systems and is regarded as canonical within the Wellcome data ecosystem.
     */
    Identifier: {
      identifierType?: components['schemas']['IdentifierType'];
      /** @description The value of the thing. e.g. an identifier */
      value?: string;
      type?: string;
    };
    /**
     * IdentifierType
     * @description Relates a Identifier to a particular authoritative source identifier scheme: for example, if the identifier is MS.49 this property might indicate that this identifier has its origins in the Wellcome Library's CALM archive management system.
     */
    IdentifierType: {
      id?: string;
      label?: string;
      type?: string;
    };
    /**
     * Image
     * @description An image
     */
    Image: {
      /** @description The canonical identifier given to a thing. */
      readonly id?: string;
      thumbnail?: components['schemas']['DigitalLocation'];
      /** @description The locations which provide access to the image */
      locations?: components['schemas']['DigitalLocation'][];
      /**
       * Format: float
       * @description Calculated aspect ratio of the image
       */
      aspectRatio?: number;
      /** @description The average colour of the image, as a hex string. */
      averageColor?: string;
      source?: components['schemas']['ImageSource'];
      /**
       * @description A list of images with similar features. Only returned by `/images/{id}`, when
       *     requested with `?include=withSimilarFeatures`.
       */
      withSimilarFeatures?: components['schemas']['Image'][];
      /** @default Image */
      type: string;
    };
    /**
     * ImageSource
     * @description The work from which an image was sourced.
     */
    ImageSource: {
      id?: string;
      title?: string;
      contributors?: components['schemas']['Contributor'][];
      genres?: components['schemas']['Genre'][];
      subjects?: components['schemas']['Subject'][];
      languages?: components['schemas']['Language'][];
      /** @default Work */
      type: string;
    };
    /**
     * ImageAggregations
     * @description A map containing the requested aggregations.
     */
    ImageAggregations: {
      license?: components['schemas']['Aggregation'];
      'source.genres.label'?: components['schemas']['Aggregation'];
      'source.subjects.label'?: components['schemas']['Aggregation'];
      'source.contributors.agent.label'?: components['schemas']['Aggregation'];
      type?: string;
    };
    /**
     * ImageResultList
     * @description A paginated list of images.
     */
    ImageResultList: {
      /** @default ResultList */
      type: string;
      /** Format: int32 */
      pageSize?: number;
      /** Format: int32 */
      totalPages?: number;
      /** Format: int32 */
      totalResults?: number;
      results?: components['schemas']['Image'][];
      prevPage?: string;
      nextPage?: string;
      aggregations?: components['schemas']['ImageAggregations'];
    };
    /**
     * Item
     * @description An item is a manifestation of a Work.
     */
    Item: {
      /** @description The canonical identifier given to a thing. */
      id?: string;
      identifiers?: components['schemas']['Identifier'][];
      /** @description A human readable title. */
      title?: string;
      /** @description Information to help distinguish different items. */
      note?: string;
      locations?: (
        | components['schemas']['DigitalLocation']
        | components['schemas']['PhysicalLocation']
      )[];
      type?: string;
    };
    /**
     * Language
     * @description A language recognised as one of those in the ISO 639-2 language codes.
     */
    Language: {
      /** @description An ISO 639-2 language code. */
      id?: string;
      /** @description The name of a language */
      label?: string;
      type?: string;
    };
    /**
     * License
     * @description The specific license under which the work in question is released to the public - for example, one of the forms of Creative Commons - if it is a precise license to which a link can be made.
     */
    License: {
      /**
       * @description A type of license under which the work in question is released to the public.
       * @enum {string}
       */
      id?:
        | 'cc-by'
        | 'cc-by-nc'
        | 'cc-by-nc-nd'
        | 'cc-0'
        | 'pdm'
        | 'cc-by-nd'
        | 'cc-by-sa'
        | 'cc-by-nc-sa'
        | 'ogl'
        | 'opl'
        | 'inc';
      /** @description The title or other short name of a license */
      label?: string;
      /** @description URL to the full text of a license */
      url?: string;
      type?: string;
    };
    /**
     * LocationType
     * @description The type of location that an item is accessible from.
     */
    LocationType: {
      id?: string;
      label?: string;
      type?: string;
    };
    /**
     * Note
     * @description A note associated with the work.
     */
    Note: {
      contents?: string[];
      noteType?: components['schemas']['NoteType'];
      type?: string;
    };
    /**
     * NoteType
     * @description Indicates the type of note associated with the work.
     */
    NoteType: {
      id?: string;
      label?: string;
      type?: string;
    };
    /**
     * Period
     * @description A period of time
     */
    Period: {
      label?: string;
      type?: string;
    };
    /**
     * PhysicalLocation
     * @description A physical location that provides access to an item
     */
    PhysicalLocation: {
      locationType?: components['schemas']['LocationType'];
      /** @description The title or other short name of the location. */
      label?: string;
      license?: components['schemas']['License'];
      /** @description The specific shelf where this item can be found */
      shelfmark?: string;
      accessConditions?: components['schemas']['AccessCondition'][];
      /**
       * @description discriminator enum property added by openapi-typescript
       * @enum {string}
       */
      type: 'PhysicalLocation';
    };
    /**
     * Place
     * @description A place
     */
    Place: {
      label?: string;
      type?: string;
    };
    /**
     * ProductionEvent
     * @description An event contributing to the production, publishing or distribution of a work.
     */
    ProductionEvent: {
      label?: string;
      places?: components['schemas']['Place'][];
      agents?: components['schemas']['Agent'][];
      dates?: components['schemas']['Period'][];
      function?: components['schemas']['ConceptStub'];
      type?: string;
    };
    /**
     * RelatedImage
     * @description An Image stub included on a work
     */
    RelatedImage: {
      /** @description The image ID */
      id?: string;
      type?: string;
    };
    /**
     * RelatedWork
     * @description Stub for representing a work related to another work.
     */
    RelatedWork: {
      /** @description The canonical identifier given to a thing. */
      readonly id?: string;
      /** @description The title or other short label of a work, including labels not present in the actual work or item but applied by the cataloguer for the purposes of search or description. */
      title?: string;
      /** @description The identifier used by researchers to cite or refer to a work. */
      referenceNumber?: string;
      /**
       * Format: int32
       * @description Number of child works.
       */
      totalParts?: number;
      type?: string;
    };
    /**
     * Subject
     * @description A subject
     */
    Subject: {
      id?: string;
      identifiers?: components['schemas']['Identifier'][];
      /** @description A label given to a thing. */
      label?: string;
      concepts?: components['schemas']['ConceptStub'][];
      type?: string;
    };
    /**
     * Work
     * @description An individual work such as a text, archive item or picture; or a grouping of individual works (so, for instance, an archive collection counts as a work, as do all the series and individual files within it).  Each work may exist in multiple instances (e.g. copies of the same book).  N.B. this is not synonymous with \"work\" as that is understood in the International Federation of Library Associations and Institutions' Functional Requirements for Bibliographic Records model (FRBR) but represents something lower down the FRBR hierarchy, namely manifestation. Groups of related items are also included as works because they have similar properties to the individual ones.
     */
    Work: {
      /** @description The canonical identifier given to a thing. */
      readonly id?: string;
      /** @description The title or other short label of a work, including labels not present in the actual work or item but applied by the cataloguer for the purposes of search or description. */
      title?: string;
      alternativeTitles?: string[];
      /** @description The identifier used by researchers to cite or refer to a work. */
      referenceNumber?: string;
      /** @description A description given to a thing. */
      description?: string;
      /** @description A description of specific physical characteristics of the work. */
      physicalDescription?: string;
      workType?: components['schemas']['Format'];
      /** @description Recording written text on a (usually visual) work. */
      lettering?: string;
      createdDate?: components['schemas']['Period'];
      /** @description Relates a work to its author, compiler, editor, artist or other entity responsible for its coming into existence in the form that it has. */
      contributors?: components['schemas']['Contributor'][];
      identifiers?: components['schemas']['Identifier'][];
      subjects?: components['schemas']['Subject'][];
      genres?: components['schemas']['Genre'][];
      thumbnail?: components['schemas']['DigitalLocation'];
      items?: components['schemas']['Item'][];
      holdings?: components['schemas']['Holdings'][];
      availabilities?: components['schemas']['Availability'][];
      production?: components['schemas']['ProductionEvent'][];
      languages?: components['schemas']['Language'][];
      /** @description Information about the archive this work belongs to. */
      archive?: {
        category?: components['schemas']['ArchiveCategory'];
      };
      /**
       * @description Information about the collection this work belongs to.
       *
       *     `root` is the work at the root of this work's collection path. Unlike
       *     `partOf`, it is only ever the root rather than every ancestor, and it is
       *     populated on the root itself.
       */
      collection?: {
        root?: components['schemas']['RelatedWork'];
        /**
         * @description Whether this work is the root of a collection, i.e. whether it has at
         *     least one child work and no parent works. Only present when true.
         */
        isRoot?: boolean;
      };
      /** @description Information relating to the edition of a work. */
      edition?: string;
      notes?: components['schemas']['Note'][];
      /** @description The playing time for audiovisual works, in seconds. */
      duration?: number;
      /** @description The current stated publication frequency, e.g. of a serial or journal. */
      currentFrequency?: string;
      formerFrequency?: string[];
      designation?: string[];
      images?: components['schemas']['RelatedImage'][];
      /** @description Child works. */
      parts?: components['schemas']['RelatedWork'][];
      /** @description Ancestor works. */
      partOf?: components['schemas']['RelatedWork'][];
      /** @default Work */
      type: string;
    };
    /**
     * WorkAggregations
     * @description A map containing the requested aggregations.
     */
    WorkAggregations: {
      workType?: components['schemas']['Aggregation'];
      'production.dates'?: components['schemas']['Aggregation'];
      'genres.label'?: components['schemas']['Aggregation'];
      'subjects.label'?: components['schemas']['Aggregation'];
      'contributors.agent.label'?: components['schemas']['Aggregation'];
      languages?: components['schemas']['Aggregation'];
      'archive.category'?: components['schemas']['Aggregation'];
      'collection.root'?: components['schemas']['Aggregation'];
      'items.locations.license'?: components['schemas']['Aggregation'];
      availabilities?: components['schemas']['Aggregation'];
      type?: string;
    };
    /**
     * WorkResultList
     * @description A paginated list of works.
     */
    WorkResultList: {
      /** @default ResultList */
      type: string;
      /** Format: int32 */
      pageSize?: number;
      /** Format: int32 */
      totalPages?: number;
      /** Format: int32 */
      totalResults?: number;
      results?: components['schemas']['Work'][];
      prevPage?: string;
      nextPage?: string;
      aggregations?: components['schemas']['WorkAggregations'];
    };
  };
  responses: {
    /** @description Bad Request Error */
    BadRequest: {
      headers: {
        [name: string]: unknown;
      };
      content: {
        'application/json': components['schemas']['Error'];
      };
    };
    /** @description Not Found Error */
    NotFound: {
      headers: {
        [name: string]: unknown;
      };
      content: {
        'application/json': components['schemas']['Error'];
      };
    };
    /** @description Gone Error */
    Gone: {
      headers: {
        [name: string]: unknown;
      };
      content: {
        'application/json': components['schemas']['Error'];
      };
    };
    /** @description Internal Server Error */
    InternalServerError: {
      headers: {
        [name: string]: unknown;
      };
      content: {
        'application/json': components['schemas']['Error'];
      };
    };
    /** @description Service Unavailable Error */
    ServiceUnavailable: {
      headers: {
        [name: string]: unknown;
      };
      content: {
        'application/json': components['schemas']['Error'];
      };
    };
  };
  parameters: {
    /** @description The canonical identifier of the record to return. */
    Id: string;
    /** @description Full-text search query */
    Query: string;
    /** @description The page to return from the result list */
    Page: number;
    /** @description The number of results to return per page */
    PageSize: number;
    /** @description The order in which to return the results */
    SortOrder: 'asc' | 'desc';
    /** @description A comma-separated list of extra fields to include */
    WorksInclude: (
      | 'identifiers'
      | 'items'
      | 'holdings'
      | 'subjects'
      | 'genres'
      | 'contributors'
      | 'production'
      | 'languages'
      | 'archive'
      | 'collection'
      | 'notes'
      | 'formerFrequency'
      | 'designation'
      | 'images'
      | 'parts'
      | 'partOf'
    )[];
    /**
     * @description What aggregated data in correlation to the results should we return.
     *
     *     The id-based variants (`genres`, `subjects`, `contributors.agent`) are returned
     *     under the same response key as their label-based counterparts
     *     (`genres.label`, `subjects.label`, `contributors.agent.label`); requesting the
     *     id variant populates the `id` field of each bucket's `data`.
     */
    WorksAggregations: (
      | 'workType'
      | 'genres.label'
      | 'genres'
      | 'production.dates'
      | 'subjects.label'
      | 'subjects'
      | 'languages'
      | 'archive.category'
      | 'collection.root'
      | 'contributors.agent.label'
      | 'contributors.agent'
      | 'items.locations.license'
      | 'availabilities'
    )[];
    /** @description Which field to sort the results on */
    WorksSort: (
      'production.dates' | 'items.locations.createdDate' | 'collectionPath'
    )[];
    /**
     * @description Filter by the access status of items on the retrieved works. A comma-separated
     *     list of AccessStatus ids. Prefix a value with `!` to exclude it instead, e.g.
     *     `!closed`.
     */
    WorksAccessStatusFilter: (
      | 'open'
      | 'open-with-advisory'
      | 'restricted'
      | 'closed'
      | 'licensed-resources'
      | 'unavailable'
      | 'permission-required'
    )[];
    /** @description A comma-separated list of extra fields to include */
    ImagesInclude: (
      | 'source.contributors'
      | 'source.languages'
      | 'source.genres'
      | 'source.subjects'
    )[];
    /**
     * @description A comma-separated list of extra fields to include. `withSimilarFeatures` is only
     *     available on this endpoint, not on `/images`.
     */
    ImagesIncludeSingle: (
      | 'withSimilarFeatures'
      | 'source.contributors'
      | 'source.languages'
      | 'source.genres'
      | 'source.subjects'
    )[];
    /**
     * @description What aggregated data in correlation to the results should we return.
     *
     *     `locations.license` is returned under the response key `license`. The id-based
     *     variants (`source.genres`, `source.subjects`, `source.contributors.agent`) are
     *     returned under the same response key as their label-based counterparts;
     *     requesting the id variant populates the `id` field of each bucket's `data`.
     */
    ImagesAggregations: (
      | 'locations.license'
      | 'source.contributors.agent.label'
      | 'source.contributors.agent'
      | 'source.genres.label'
      | 'source.genres'
      | 'source.subjects.label'
      | 'source.subjects'
    )[];
    /** @description Which field to sort the results on */
    ImagesSort: 'source.production.dates'[];
  };
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  getWorks: {
    parameters: {
      query?: {
        /** @description Full-text search query */
        query?: components['parameters']['Query'];
        /** @description A comma-separated list of extra fields to include */
        include?: components['parameters']['WorksInclude'];
        /**
         * @description What aggregated data in correlation to the results should we return.
         *
         *     The id-based variants (`genres`, `subjects`, `contributors.agent`) are returned
         *     under the same response key as their label-based counterparts
         *     (`genres.label`, `subjects.label`, `contributors.agent.label`); requesting the
         *     id variant populates the `id` field of each bucket's `data`.
         */
        aggregations?: components['parameters']['WorksAggregations'];
        /** @description Which field to sort the results on */
        sort?: components['parameters']['WorksSort'];
        /** @description The order in which to return the results */
        sortOrder?: components['parameters']['SortOrder'];
        /** @description The page to return from the result list */
        page?: components['parameters']['Page'];
        /** @description The number of results to return per page */
        pageSize?: components['parameters']['PageSize'];
        /**
         * @description Filter by the access status of items on the retrieved works. A comma-separated
         *     list of AccessStatus ids. Prefix a value with `!` to exclude it instead, e.g.
         *     `!closed`.
         */
        'items.locations.accessConditions.status'?: components['parameters']['WorksAccessStatusFilter'];
        /** @description Filter by the format of the searched works. A comma-separated list of Format ids, e.g. `a,k`. */
        workType?: string;
        /** @description Filter by the type of the searched works */
        type?: 'Collection' | 'Series' | 'Section';
        /** @description Filter by language. A comma-separated list of ISO 639-2 language ids. */
        languages?: string;
        /** @description Filter by the category of archive a work belongs to. A comma-separated list of ArchiveCategory ids, e.g. `PP,SA`. */
        'archive.category'?: string;
        /** @description Filter by the collection a work belongs to. A comma-separated list of work ids. */
        'collection.root'?: string;
        /**
         * @description Filter by whether a work is the root of a collection. Note that
         *     `collection.isRoot=false` matches every work which is not a collection
         *     root, including the majority which do not belong to a collection at all.
         */
        'collection.isRoot'?: boolean;
        /** @description Filter by genre label. A comma-separated list of labels. */
        'genres.label'?: string;
        /** @description Filter by genre id. A comma-separated list of concept ids. */
        genres?: string;
        /** @description Filter by subject label. A comma-separated list of labels. */
        'subjects.label'?: string;
        /** @description Filter by subject id. A comma-separated list of concept ids. */
        subjects?: string;
        /** @description Filter by contributor label. A comma-separated list of labels. */
        'contributors.agent.label'?: string;
        /** @description Filter by contributor id. A comma-separated list of concept ids. */
        'contributors.agent'?: string;
        /** @description Filter by identifier value. A comma-separated list of identifiers. */
        identifiers?: string;
        /** @description Filter by availability. A comma-separated list of Availability ids, e.g. `online,open-shelves`. */
        availabilities?: string;
        /** @description Filter by the id of an ancestor work. */
        partOf?: string;
        /** @description Filter by the title of an ancestor work. */
        'partOf.title'?: string;
        /** @description Filter by item id. A comma-separated list of item ids. */
        items?: string;
        /** @description Filter by item identifier value. A comma-separated list of identifiers. */
        'items.identifiers'?: string;
        /** @description Filter by the LocationType of items on the retrieved works. A comma-separated list of LocationType ids. */
        'items.locations.locationType'?: string;
        /** @description Filter by the license of items on the retrieved works. A comma-separated list of License ids. */
        'items.locations.license'?: string;
        /** @description Return works produced on or after this date, in `YYYY-MM-DD` format. */
        'production.dates.from'?: string;
        /** @description Return works produced on or before this date, in `YYYY-MM-DD` format. */
        'production.dates.to'?: string;
        /** @description Return works with an item location created on or after this date, in `YYYY-MM-DD` format. */
        'items.locations.createdDate.from'?: string;
        /** @description Return works with an item location created on or before this date, in `YYYY-MM-DD` format. */
        'items.locations.createdDate.to'?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The works */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['WorkResultList'];
        };
      };
      400: components['responses']['BadRequest'];
      500: components['responses']['InternalServerError'];
      503: components['responses']['ServiceUnavailable'];
    };
  };
  getWork: {
    parameters: {
      query?: {
        /** @description A comma-separated list of extra fields to include */
        include?: components['parameters']['WorksInclude'];
      };
      header?: never;
      path: {
        /** @description The canonical identifier of the record to return. */
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The work */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['Work'];
        };
      };
      /**
       * @description The work has been redirected to another work. The `Location` header contains
       *     the path of the work that replaces it. No response body is returned.
       */
      302: {
        headers: {
          /** @description The path of the work that this work redirects to. */
          Location?: string;
          [name: string]: unknown;
        };
        content?: never;
      };
      400: components['responses']['BadRequest'];
      404: components['responses']['NotFound'];
      410: components['responses']['Gone'];
      500: components['responses']['InternalServerError'];
      503: components['responses']['ServiceUnavailable'];
    };
  };
  getImages: {
    parameters: {
      query?: {
        /** @description Full-text search query */
        query?: components['parameters']['Query'];
        /** @description A comma-separated list of extra fields to include */
        include?: components['parameters']['ImagesInclude'];
        /**
         * @description What aggregated data in correlation to the results should we return.
         *
         *     `locations.license` is returned under the response key `license`. The id-based
         *     variants (`source.genres`, `source.subjects`, `source.contributors.agent`) are
         *     returned under the same response key as their label-based counterparts;
         *     requesting the id variant populates the `id` field of each bucket's `data`.
         */
        aggregations?: components['parameters']['ImagesAggregations'];
        /** @description Which field to sort the results on */
        sort?: components['parameters']['ImagesSort'];
        /** @description The order in which to return the results */
        sortOrder?: components['parameters']['SortOrder'];
        /** @description The page to return from the result list */
        page?: components['parameters']['Page'];
        /** @description The number of results to return per page */
        pageSize?: components['parameters']['PageSize'];
        /**
         * @description Filter by the colours of the image, given as a single hex colour without a
         *     leading `#`, e.g. `ff6700`.
         */
        color?: string;
        /** @description Filter by the license of the image. A comma-separated list of License ids. */
        'locations.license'?: string;
        /** @description Filter by the label of a contributor to the source work. A comma-separated list of labels. */
        'source.contributors.agent.label'?: string;
        /** @description Filter by the id of a contributor to the source work. A comma-separated list of concept ids. */
        'source.contributors.agent'?: string;
        /** @description Filter by the genre label of the source work. A comma-separated list of labels. */
        'source.genres.label'?: string;
        /** @description Filter by the genre id of the source work. A comma-separated list of concept ids. */
        'source.genres'?: string;
        /** @description Filter by the subject label of the source work. A comma-separated list of labels. */
        'source.subjects.label'?: string;
        /** @description Filter by the subject id of the source work. A comma-separated list of concept ids. */
        'source.subjects'?: string;
        /** @description Return images whose source work was produced on or after this date, in `YYYY-MM-DD` format. */
        'source.production.dates.from'?: string;
        /** @description Return images whose source work was produced on or before this date, in `YYYY-MM-DD` format. */
        'source.production.dates.to'?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The images */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ImageResultList'];
        };
      };
      400: components['responses']['BadRequest'];
      500: components['responses']['InternalServerError'];
      503: components['responses']['ServiceUnavailable'];
    };
  };
  getImage: {
    parameters: {
      query?: {
        /**
         * @description A comma-separated list of extra fields to include. `withSimilarFeatures` is only
         *     available on this endpoint, not on `/images`.
         */
        include?: components['parameters']['ImagesIncludeSingle'];
      };
      header?: never;
      path: {
        /** @description The canonical identifier of the record to return. */
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The image */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['Image'];
        };
      };
      400: components['responses']['BadRequest'];
      404: components['responses']['NotFound'];
      500: components['responses']['InternalServerError'];
      503: components['responses']['ServiceUnavailable'];
    };
  };
  getConcepts: {
    parameters: {
      query?: {
        /** @description Full-text search query */
        query?: components['parameters']['Query'];
        /** @description Filter the concepts by IdentifierType ID */
        'identifiers.identifierType'?: string;
        /**
         * @description A comma-separated list of concept ids to fetch directly.
         *
         *     When supplied, all other filters and pagination parameters are ignored: the
         *     concepts are fetched in a single batch, returned in the order requested, and
         *     ids that do not exist are silently omitted. The response has `totalPages: 1`
         *     and no `prevPage` or `nextPage`.
         */
        id?: string;
        /** @description The page to return from the result list */
        page?: components['parameters']['Page'];
        /** @description The number of results to return per page */
        pageSize?: components['parameters']['PageSize'];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The concepts */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ConceptResultList'];
        };
      };
      400: components['responses']['BadRequest'];
      500: components['responses']['InternalServerError'];
    };
  };
  getConcept: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description The canonical identifier of the record to return. */
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The concept */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['Concept'];
        };
      };
      400: components['responses']['BadRequest'];
      404: components['responses']['NotFound'];
      500: components['responses']['InternalServerError'];
    };
  };
}
