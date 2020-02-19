module.exports = {
  toggles: [
    {
      id: 'availableOnline',
      title: 'Show the "Available online" section on a work page',
      defaultValue: false,
      description:
        'Removes the previews from the top of the page and shows the "Available online" section instead.',
    },
    {
      id: 'unfilteredSearchResults',
      title: 'Complete catalogue search',
      defaultValue: false,
      description: 'Search the complete catalogue without any filters',
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
  ],
};
