type ToggleTypes = 'permanent' | 'experimental' | 'test' | 'stage';

type ToggleBase = {
  id: string;
  title: string;
  description: string;
  type: ToggleTypes;
  documentationLink?: string;
};

export type FeatureFlagDefinition = ToggleBase & {
  initialValue: boolean;
};

// Only ever populated for experimental toggles. Shared by feature flags and
// phased flags - both go public and get tracked this way; a mode never does.
type WithLifecycleDates = {
  dateCreated?: string;
  dateActivated?: string;
};

export type PublishedFeatureFlag = ToggleBase &
  WithLifecycleDates & {
    defaultValue: boolean;
  };

export type ABTest = {
  id: string;
  title: string;
  type: 'test';
  range: [number, number];
};

export type ModeOption = {
  id: string;
  label: string;
};

export type ModeDefinition = {
  id: string;
  title: string;
  description: string;
  options: readonly ModeOption[];
};

export type PhaseDefinition = {
  id: string;
  label: string;
  // What THIS phase specifically adds — keep to ~20 words. Anything longer
  // belongs in the feature's own `documentationLink` instead.
  description: string;
};

export type PhasedFlagDefinition = ToggleBase & {
  // Ordered earliest to latest. Selecting a phase in the dashboard shows
  // that phase's work plus everything from the phases before it.
  phases: readonly PhaseDefinition[];
  // The phase that's public the first time this flag is published - for a
  // feature whose earlier phases already shipped behind a boolean flag.
  // Like a feature flag's initialValue, it's only read for a brand new
  // flag; after that the public phase changes via setDefaultValueFor.
  initialPhase?: string;
};

export type PublishedPhasedFlag = ToggleBase &
  WithLifecycleDates & {
    phases: readonly PhaseDefinition[];
    // What's actually public. Null the first time a phased flag is
    // published, unless its definition set an initialPhase (for a feature
    // whose earlier phases already shipped behind a boolean flag) - either
    // way, set explicitly from then on as each phase ships, the same way
    // PublishedFeatureFlag.defaultValue works for booleans.
    defaultPhase: string | null;
  };

const toggleConfig = {
  // Feature flags (permanent toggles, experiments, stage toggles)
  // Toggles of type 'stage' will only be applied on stage
  featureFlags: [
    {
      id: 'apiToolbar',
      title: 'API toolbar',
      initialValue: false,
      description: 'A toolbar to help us navigate the secret depths of the API',
      type: 'permanent',
    },
    {
      id: 'toggleWidget',
      title: 'Toggle widget',
      initialValue: false,
      description:
        'A floating widget to preview a toggle a dashboard user has starred, without going through the toggles dashboard.',
      type: 'permanent',
    },
    {
      id: 'conceptsSearch',
      title: 'Concepts search',
      initialValue: false,
      description:
        'Enables the concepts search tab and functionality in the search interface',
      type: 'permanent',
    },
    {
      id: 'disableRequesting',
      title: 'Disables requesting functionality',
      description:
        'Replaces the "sign into your library account to request items" message, with "requesting is currently unavailable". Adds a note to say when requesting will be available again.',
      documentationLink:
        'https://app.gitbook.com/o/-LumfFcEMKx4gYXKAZTQ/s/mNeKBZYcfnVQtLDYvJ5T/turn-off-requesting',
      initialValue: false,
      type: 'permanent',
    },
    {
      id: 'stagingApi',
      title: 'Staging API',
      initialValue: false,
      description: 'Use the staging Wellcome APIs',
      type: 'permanent',
    },
    {
      id: 'aggregationsInSearch',
      title: 'Aggregations in search',
      initialValue: true,
      description:
        'Whether to enable aggregations in search. Aggregations are an expensive part of the query, and they can be temporarily disabled if the API is having performance issues.',
      type: 'permanent',
    },
    {
      id: 'issuesBanner',
      title: 'Banner for issues across the website',
      initialValue: false,
      description:
        "Banner to display publicly when we're experiencing issues across the website that will take longer to fix or are out of our control.",
      type: 'permanent',
    },
    {
      id: 'prismicStage',
      title: 'Use Prismic stage environment content',
      initialValue: false,
      description:
        "Makes all content queries to the Prismic stage environment instead of production. Useful for testing model changes or previewing landing page changes that wouldn't be possible with standard Prismic preview.",
      type: 'permanent',
    },
    {
      id: 'themePagesAllFields',
      title: 'Show all fields on theme pages',
      initialValue: false,
      description:
        'Show all experimental fields on theme pages, including alternative labels, broader topics, etc.',
      type: 'permanent',
    },
    {
      id: 'archiveBrowsing',
      title: 'Archive browsing',
      initialValue: false,
      description: 'Enables access to new archive browsing features/pages',
      type: 'experimental',
    },
    {
      id: 'itemViewerRefactor',
      title: 'Item viewer refactor',
      initialValue: false,
      description:
        'Displays the refactored item viewer instead of the current one.',
      type: 'experimental',
    },
    {
      id: 'brandUpdate',
      title: 'Brand update',
      initialValue: false,
      description: 'Shows the new brand values.',
      type: 'experimental',
    },
  ] as const,
  // Phased flags: like a feature flag, but with an ordered set of phases
  // instead of on/off. Selecting a phase always includes every phase before it.
  phasedFlags: [
    {
      id: 'thematicBrowsingPhases',
      title: 'Thematic browsing',
      description:
        'Staged rollout of thematic browsing, replacing the thematicBrowsing and thematicBrowsingSubCategory feature flags.',
      type: 'experimental',
      phases: [
        {
          id: 'categoryPages',
          label: 'Category pages',
          description:
            'The three thematic browsing category pages (subjects, people & organisations, types & techniques) become accessible.',
        },
        {
          id: 'subCategoryPages',
          label: 'Sub-category pages',
          description:
            'Subject sub-category pages become accessible, and the subjects category page gains a sub-category menu.',
        },
      ],
    },
    {
      id: 'archiveCollectionPhases',
      title: 'Archive collection',
      description: 'Staged rollout of archive collection level pages.',
      type: 'experimental',
      // MVP was already public behind archiveCollection when we created it as a phased flag.
      initialPhase: 'mvp',
      phases: [
        {
          id: 'mvp',
          label: 'MVP',
          description:
            'Archive collection level pages, plus the archive collection treatment on the work page and in search results.',
        },
        {
          id: 'phase2',
          label: 'Phase 2',
          description:
            "The catalogue API's shortDescription is shown on the archive collection hero and in search results.",
        },
      ],
    },
  ] as const,
  // We have to include a reference to any test toggles here as well as in the cache dir
  // because they are deployed separately and consequently can't share a source of truth
  tests: [] as ABTest[],
  // Modes are toggles whose value is a selected option string rather than a boolean.
  // They are activated via a cookie containing the option value.
  modes: [
    {
      id: 'kioskMode',
      title: 'Kiosk mode',
      description:
        'Select which kiosk device this browser represents and it will activate kiosk-specific behaviour and layout.\n\nDeveloper mode is also available to allow testing of kiosk features without setting off the Inactivity modal.\n\n<strong>Selecting a kiosk mode will override any cookie consent settings and automatically grant consent for analytics and marketing.</strong>',
      options: [
        { id: 'devMode', label: 'Developer mode' },
        { id: 'RR-iPad1', label: 'Reading Room: iPad 1' },
        { id: 'RR-iPad2', label: 'Reading Room: iPad 2' },
        { id: 'TR-iPad1', label: 'Tenderness & Rage: iPad 1' },
        { id: 'TR-iPad2', label: 'Tenderness & Rage: iPad 2' },
      ],
    },
    {
      id: 'cataloguePipeline',
      title: 'Catalogue pipeline',
      description:
        'Selects which catalogue pipeline serves works, images and concepts requests. When set, an elasticCluster param carrying the selected value is added to all catalogue works, images and concepts API queries (search and detail), so they are served from that pipeline’s cluster. Off means the normal pipeline setup. Requests to an unavailable cluster fail with an error page rather than falling back to the default pipeline, except theme cards, which render empty.',
      options: [
        {
          id: 'pipeline-2026-09-30',
          label: '2026-09-30 pipeline (Axiell part_of trees)',
        },
      ],
    },
  ] as const,
};

export default toggleConfig;
