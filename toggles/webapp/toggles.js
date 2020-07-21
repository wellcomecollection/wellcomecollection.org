module.exports = {
  toggles: [
    {
      id: 'archivesPrototype',
      title: 'View additions to the work page relating to archives',
      defaultValue: false,
      description:
        'View prototypes of breadcrumbs and onward journey links for archives',
    },
    {
      id: 'unfilteredSearchResults',
      title: 'Entire catalogue search',
      defaultValue: false,
      description: 'Search the entire catalogue, including all work types',
    },
    {
      id: 'collectionSearch',
      title: 'Search and explore archive collections',
      defaultValue: false,
      description:
        'Search for top-level collections and surface them on work pages',
    },
    {
      id: 'imagesEndpoint',
      title: 'Use the images endpoint for image searches',
      defaultValue: false,
      description:
        'Rather than searching for works filtered by iiif-image, use the new (beta) images endpoint for image search',
    },
    {
      id: 'miroMergingTest',
      title: 'Use the Miro merging test index',
      defaultValue: false,
      description:
        'The miro merging test merges as many miro works as possible (ie regardless of number or worktype)',
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
  ],
};
