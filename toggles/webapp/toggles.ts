export type Toggle = {
  id: string;
  title: string;
  description: string;
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
        'Replaces the "sign into your library account to request items" message, with "requesting is currently unavailable". Adds a note to say when requesting will be available again.',
      defaultValue: false,
    },
    {
      id: 'stagingApi',
      title: 'Staging API',
      defaultValue: false,
      description: 'Use the staging catalogue API',
    },
    {
      id: 'apiToolbar',
      title: 'API toolbar',
      defaultValue: false,
      description: 'A toolbar to help us navigate the secret depths of the API',
    },
    {
      id: 'conceptsPages',
      title: 'Concepts pages',
      defaultValue: false,
      description:
        'View pages for concepts (subjects and people) and link to them from works pages',
    },
    {
      id: 'exhibitionGuides',
      title: 'Exhibition guides',
      defaultValue: false,
      description: 'View pages related to exhibition guides',
    },
    {
      id: 'newPalette',
      title: 'New Colour Palette',
      defaultValue: false,
      description: 'View pages with the new colour palette',
    },
  ] as const,
  tests: [] as ABTest[],
};

export default toggles;
