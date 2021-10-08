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
export default {
  toggles: [
    {
      id: 'buildingReopening',
      title: 'Wellcome Collection reopening UI changes',
      description:
        'Show additions/amendments made in preparation for the reopening of the Wellcome Collection building',
      defaultValue: true,
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
    {
      id: 'tei',
      title: 'Tei visible',
      defaultValue: false,
      description: 'Makes Tei visible',
    },
  ] as Toggle[],
  tests: [] as ABTest[],
};
