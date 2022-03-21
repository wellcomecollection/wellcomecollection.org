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
  ] as const,
  tests: [
    {
      id: 'gaSecureCookies',
      title: 'GA Secure Cookies',
      range: [0, 10],
      when: () => true,
    },
  ] as ABTest[],
};

export default toggles;
