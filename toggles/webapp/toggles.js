module.exports = {
  toggles: [
    {
      id: 'enableImageSearch',
      title: 'Enable the images-only search on /images',
      defaultValue: false,
      description:
        'Enables a separate page that performs image-only search with a different UI',
    },
    {
      id: 'stacksRequestService',
      title: 'Items status and requesting',
      defaultValue: false,
      description: 'Get the status of items and request them from the stacks',
    },
    {
      id: 'unfilteredSearchResults',
      title:
        'Return all posible results from the catalogue API, without filtering by type or location',
      defaultValue: false,
      description: 'Shows all possible search results from the catalogue API',
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
