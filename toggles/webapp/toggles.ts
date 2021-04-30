export default {
  toggles: [
    {
      id: 'showHoldingsOnWork',
      title: 'Show holdings on the work page',
      description: 'Shows the holding information for a work',
      defaultValue: false,
    },
    {
      id: 'buildingReopening',
      title: 'Wellcome Collection reopening UI changes',
      description:
        'Show additions/amendments made in preparation for the reopening of the Wellcome Collection building',
      defaultValue: false,
    },
    {
      id: 'stagingApi',
      title: 'Staging API',
      defaultValue: false,
      description: 'Use the staging catalogue API',
    },
    {
      id: 'showPhysicalItems',
      title: 'Show physical items on the work page',
      defaultValue: false,
      description: 'Shows physical items and their locations on the work page',
    },
    {
      id: 'helveticaRegular',
      title: 'Helvetica regular',
      defaultValue: false,
      description:
        'Displays body copy in Helvetica regular (where it is currently Helvetica light)',
    },
    {
      id: 'switchIIIFManifestSource',
      title: 'Switch IIIF manifest source',
      defaultValue: false,
      description:
        'Switches the manifest sources from wellcomelibrary.org to iiif.wellcomecollection.org for testing.',
    },
    {
      id: 'newSiteSections',
      title: 'New site sections - Get Involved and About us',
      defaultValue: false,
      description:
        'The new site section Get Involved, and newly promoted About us section',
    },
  ] as const,
  tests: [
    {
      id: 'showSidebarToggleLabel',
      title: 'Sidebar show/hide toggle label visibility',
      range: [0, 100],
      defaultValue: true,
      description:
        'Testing whether the presence of a label alongside the chevrons to show/hide the sidebar will impact on button usage',
    },
  ] as const,
};
