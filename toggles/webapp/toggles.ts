export type ToggleTypes = 'permanent' | 'experimental' | 'test' | 'stage';

type ToggleBase = {
  id: string;
  title: string;
  description: string;
  type: ToggleTypes;
  documentationLink?: string;
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
  type: 'test';
  range: [number, number];
};

const toggles = {
  // This should probably be called `features` as we have feature toggles, and a/b testing toggles.
  // Toggles of type 'stage' will only be applied on stage
  toggles: [
    {
      id: 'apiToolbar',
      title: 'API toolbar',
      initialValue: false,
      description: 'A toolbar to help us navigate the secret depths of the API',
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
      id: 'authV2',
      title: 'IIIF Auth V2',
      initialValue: false,
      description:
        'Will make use of the V2 auth services in the IIIF Presentation manifest, if they are available. N.B. some V2 services contain invalid data, so it is not safe to turn this on for everyone until all manifests have been regenerated.',
      type: 'experimental',
    },
    {
      id: 'extendedViewer',
      title: 'Allow viewer to render video, audio and pdfs',
      initialValue: false,
      description:
        'Displays a new version of the viewer that can render video, audio and pdfs in addition to images',
      type: 'experimental',
    },
    {
      id: 'newThemePages',
      title: 'New theme pages',
      initialValue: false,
      description:
        'Show new theme pages, with data populated from the catalogue graph.',
      type: 'experimental',
    },
    {
      id: 'themePagesAllFields',
      title: 'Show all fields on theme pages',
      initialValue: false,
      description:
        'Show all experimental fields on theme pages, including alternative labels, broader topics, etc.',
      type: 'experimental',
    },
    {
      id: 'exhibitionsInEvents',
      title: 'Exhibitions in events',
      initialValue: false,
      description: 'Adds exhibitions to the events search results',
      type: 'experimental',
    },
    {
      id: 'relatedContentOnWorks',
      title: 'Related content on works',
      initialValue: false,
      description: 'Shows related content on works pages',
      type: 'experimental',
    },
    {
      id: 'featuredWorksInAddressables',
      title: 'Featured works in addressables',
      initialValue: false,
      description:
        'Adds features in displaying featured works in the Content part of the website',
      type: 'experimental',
    },
  ] as const,
  // We have to include a reference to any test toggles here as well as in the cache dir
  // because they are deployed separately and consequently can't share a source of truth
  tests: [] as ABTest[],
};

export default toggles;
