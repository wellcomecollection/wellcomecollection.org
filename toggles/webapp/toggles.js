module.exports = {
  toggles: [
    {
      id: 'relevanceRatingOptIn',
      title: `Opt in to search relevance rating`,
      defaultValue: false,
      description:
        'Shows the opt in, which will allow people to rate the relevance of results on the search results page.',
    },
    {
      id: 'relevanceRating',
      title: `Search relevance rating`,
      defaultValue: false,
      description:
        'Allow people rate the relevance or results on the search results page.',
    },
    {
      id: 'useStageApi',
      title: `Use the staging API`,
      defaultValue: false,
      description:
        'Uses api.stage for requests to the API to view data that we are testing.',
    },
    {
      id: 'unfilteredSearchResults',
      title:
        'Return all posible results from the catalogue API, without filtering by type or location',
      defaultValue: false,
      description: 'Shows all possible search results from the catalogue API',
    },
    {
      id: 'refineFiltersPrototype',
      title: 'Display the Refine filters prototype',
      defaultValue: false,
      description:
        'Shows filters on the works search pages. Geared towards refinement.',
    },
    {
      id: 'helveticaRegular',
      title: 'Helvetica regular',
      defaultValue: false,
      description:
        'Displays body copy in Helvetica regular (where it is currently Helvetica light)',
    },
    {
      id: 'showImagesWithSimilarPalette',
      title: 'Show images with similar palette in the work details section',
      defaultValue: false,
      description:
        'If the work has a Miro image, we can show images with similar a palette.',
    },
    {
      id: 'showAdditionalCatalogueData',
      title: 'Show the latest Sierra data additions to the API',
      defaultValue: false,
      description:
        'Displays the latest data additions, that have been added to the API, on the work page.',
    },
    {
      id: 'showLocationsAndStatuses',
      title: 'Show physical locations and statuses of work items',
      defaultValue: false,
      description:
        "Shows the physical locations and statuses of a work's items where available",
    },
  ],
};
