export default {
  toggles: [
    {
      id: 'structuresPrototype',
      title: 'Digitised material structures',
      description: 'Shows the structures of digitised material in the viewer',
      defaultValue: false,
    },
    {
      id: 'openWithAdvisoryPrototype',
      title: 'Open with advisory',
      description:
        'Adds functionality for viewing digitised items with an access condition of open-with-advisory',
      defaultValue: true,
    },
    {
      id: 'buildingReopening',
      title: 'Wellcome Collection reopening UI changes',
      description:
        'Show additions/amendments made in preparation for the reopening of the Wellcome Collection building',
      defaultValue: false,
    },
    {
      id: 'modalFiltersPrototype',
      title: 'Use the modal filter prototype',
      defaultValue: false,
      description: 'Search filters will appear in a modal',
    },
    {
      id: 'paletteColorFilter',
      title: 'Palette-based colour filter',
      description:
        'Use a new colour filtering UI that provides a fixed palette and a hue slider',
      defaultValue: false,
    },
    {
      id: 'searchToolbar',
      title: 'Search toolbar',
      defaultValue: false,
      description:
        'Select from search query algorithms and other search functionality',
    },
    {
      id: 'stagingApi',
      title: 'Staging API',
      defaultValue: false,
      description: 'Use the staging catalogue API',
    },
    {
      id: 'relevanceRating',
      title: 'Rate search result relevance',
      defaultValue: false,
      description:
        'Give your search results a rating of 1 to 4 stars to help us improve search relevance',
    },
    {
      id: 'stacksRequestService',
      title: 'Items status and requesting',
      defaultValue: false,
      description: 'Get the status of items and request them from the stacks',
    },
    {
      id: 'helveticaRegular',
      title: 'Helvetica regular',
      defaultValue: false,
      description:
        'Displays body copy in Helvetica regular (where it is currently Helvetica light)',
    },
    {
      id: 'searchMoreFilters',
      title: 'More Filters',
      defaultValue: true,
      description: 'Enable more filters within the search results',
    },
  ] as const,
};
