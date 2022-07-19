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
      id: 'enablePickUpDate',
      title: 'Enables pick up date functionality',
      description: 'Adds a date picker to the requesting modal',
      defaultValue: true,
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
      id: 'selfRegistration',
      title: 'Self registration',
      defaultValue: true,
      description: 'Allow users to sign up for an account',
    },
    {
      id: 'conceptsPages',
      title: 'Concepts pages',
      defaultValue: false,
      description:
        'View pages for concepts (subjects and people) and link to them from works pages',
    },
  ] as const,
  tests: [] as ABTest[],
};

export default toggles;
