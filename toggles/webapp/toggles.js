module.exports = {
  toggles: [
    {
      id: 'simplifiedPreview',
      title: 'Shows simplified preview on works',
      defaultValue: false,
      description:
        'Shows a simplified preview that is consistent for all work types',
    },
    {
      id: 'unfilteredSearchResults',
      title: 'Complete catalogue search',
      defaultValue: false,
      description: 'Search the complete catalogue without any filters',
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
  ],
};
