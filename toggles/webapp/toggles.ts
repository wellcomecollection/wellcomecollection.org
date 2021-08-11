type ABTest = {
  id: string;
  title: string;
  range: [number, number];
  description: string;
  defaultValue: boolean;
};
export default {
  toggles: [
    {
      id: 'showHoldingsOnWork',
      title: 'Show holdings on the work page',
      description: 'Shows the holding information for a work',
      defaultValue: true,
    },
    {
      id: 'buildingReopening',
      title: 'Wellcome Collection reopening UI changes',
      description:
        'Show additions/amendments made in preparation for the reopening of the Wellcome Collection building',
      defaultValue: true,
    },
    {
      id: 'showLogin',
      title: 'Show a link to log in',
      description: 'Shows a link to log in on /works',
      defaultValue: false,
    },
    {
      id: 'showItemRequestFlow',
      title: 'Show item request user flow',
      description:
        'Makes the Request item button call the items API and show the relevant request/confirm modal flow',
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
