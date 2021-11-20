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
      id: 'enableRequesting',
      title: 'Enables login and requesting functionality',
      description:
        'Puts login links in the headers and enables requesting functionality on works pages ',
      defaultValue: false,
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
      id: 'tei',
      title: 'Tei visible',
      defaultValue: false,
      description: 'Makes Tei visible',
    },
  ] as const,
  tests: [] as ABTest[],
};
