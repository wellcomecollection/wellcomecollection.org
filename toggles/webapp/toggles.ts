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
      id: 'conceptsPages',
      title: 'Concepts pages',
      initialValue: false,
      description:
        'View pages for concepts (subjects and people) and link to them from works pages',
    },
    {
      id: 'exhibitionGuides',
      title: 'Exhibition guides',
      initialValue: false,
      description: 'View pages related to exhibition guides',
    },
    {
      id: 'newPalette',
      title: 'New Colour Palette',
      initialValue: false,
      description: 'View pages with the new colour palette',
    },
    {
      id: 'newStoriesLanding',
      title: 'New stories landing page content',
      initialValue: false,
      description:
        'Uses the new stories-landing type in Prismic to provide page content for /stories. Namely, the introductory text and featured books section (currently being populated from different places), and replaces the hard coded promoted series with a list of editor chosen articles and series.',
    },
  ] as const,
  tests: [] as ABTest[],
};

export default toggles;
