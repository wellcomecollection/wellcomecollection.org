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

export type PublishedFeatureFlag = ToggleBase & {
  defaultValue: boolean;
  // Dates are only populated for experimental toggles
  dateCreated?: string;
  dateActivated?: string;
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
      id: 'thematicBrowsing',
      title: 'Thematic browsing: category pages',
      initialValue: false,
      description: 'Enables access to new thematic browsing category pages.',
      type: 'experimental',
    },
    {
      id: 'thematicBrowsingSubCategory',
      title: 'Thematic browsing: sub-category pages',
      initialValue: false,
      description:
        'Enables access to new thematic browsing sub-category pages.',
      type: 'experimental',
    },
    {
      id: 'semanticSearchPrototype',
      title: 'Semantic search prototype',
      initialValue: false,
      description:
        'Enables the semantic search prototype with predefined search terms and API selection. If enabled, please ensure the Semantic search comparison toggle is disabled.',
      type: 'experimental',
    },
    {
      id: 'semanticSearchComparison',
      title: 'Semantic search comparison',
      initialValue: false,
      description:
        'Allows use of semantic searches and facilitates the display of the semantic search results side by side with the standard search results for comparison. If enabled, please ensure the Semantic search prototype toggle is disabled.',
      type: 'experimental',
    },
    {
      id: 'verticalVideos',
      title: 'Vertical videos',
      initialValue: false,
      description: 'Allows testing of vertical videos.',
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
  ] as const,
};

export default toggleConfig;
