type ToggleBase = {
  id: string;
  title: string;
  description: string;
};

export type ToggleDefinition = ToggleBase & {
  initialValue: boolean;
};

export type PublishedToggle = ToggleBase & {
  defaultValue: boolean;
};

export type ABTest = {
  id: string;
  title: string;
  range: [number, number];
  when: (request: Request) => boolean; // TODO: should take request of type CloudFrontRequest
};

const toggles = {
  // This should probably be called `features` as we have feature toggles, and a/b testing toggles.
  toggles: [
    {
      id: 'disableRequesting',
      title: 'Disables requesting functionality',
      description:
        'Replaces the "sign into your library account to request items" message, with "requesting is currently unavailable". Adds a note to say when requesting will be available again.' +
        'See documentation link (tbc).',
      initialValue: false,
    },
    {
      id: 'stagingApi',
      title: 'Staging API',
      initialValue: false,
      description: 'Use the staging catalogue API',
    },
    {
      id: 'apiToolbar',
      title: 'API toolbar',
      initialValue: false,
      description: 'A toolbar to help us navigate the secret depths of the API',
    },
    {
      id: 'exhibitionGuides',
      title: 'Exhibition guides',
      initialValue: false,
      description: 'View pages related to exhibition guides',
    },
    {
      id: 'searchPage',
      title: 'Search page',
      initialValue: false,
      description:
        'New search page to help develop new components and functionalities',
    },
    {
      id: 'searchPageEventsExhibitions',
      title: 'Search page: Events & Exhibitions',
      initialValue: false,
      description: 'Include events and exhibitions on the new search page',
    },
    {
      id: 'worksTabbedNav',
      title: 'Works page: Tabbed navigation',
      initialValue: false,
      description:
        'Adds tabbed navigation to the works page, for switching between work, item and related content',
    },
  ] as const,
  tests: [] as ABTest[],
};

export default toggles;
