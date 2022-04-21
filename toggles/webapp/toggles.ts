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
      id: 'enableRequesting',
      title: 'Enables login and requesting functionality',
      description:
        'Puts login links in the headers and enables requesting functionality on works pages ',
      defaultValue: true,
    },
    {
      id: 'enablePickUpDate',
      title: 'Enables pick up date functionality',
      description: 'Adds a date picker to the requesting modal',
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
      id: 'selfRegistration',
      title: 'Self registration',
      defaultValue: false,
      description: 'Allow users to sign up for an account',
    },
    {
      id: 'inter',
      title: 'Inter font',
      defaultValue: false,
      description: 'Use Inter in place of Helvetica Neue',
    },
  ] as const,
  tests: [] as ABTest[],
};

export default toggles;
