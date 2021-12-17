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
  description: string;
  defaultValue: boolean;
};

const toggles = {
  // This should probably be called `features` as we have feature toggles, and a/b testing toggles.
  toggles: [
    {
      id: 'buildingClosure',
      title: 'The building is currently closed.',
      description:
        'Indicates that the building is closed and associated services are unavailable',
      defaultValue: false,
    },
    {
      id: 'enableRequesting',
      title: 'Enables login and requesting functionality',
      description:
        'Puts login links in the headers and enables requesting functionality on works pages ',
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
  tests: [] as ABTest[],
};

export default toggles;
