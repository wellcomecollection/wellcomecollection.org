module.exports = {
  toggles: [
    {
      id: 'selectableQueries',
      title: `Selectable queries`,
      defaultValue: false,
      description:
        'Allow people to use different query types while searching the catalogue.',
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
      id: 'showWorkLocations',
      title: 'Show the locations of a work in the header',
      defaultValue: false,
      description:
        'These can be either physical or digital locations. We need to do a little bt of work figuring out what all the codes mean to get the messaging right.',
    },
    {
      id: 'audioVideoInSearch',
      title: 'Include audio and video in search results',
      defaultValue: false,
      description: 'Include audio and video in search results',
    },
    {
      id: 'showMultiVolumePreviews',
      title: 'Show multi volume previews',
      defaultValue: false,
      description:
        'Shows a preview for each volume in a multi volume work on the work page.',
    },
    {
      id: 'showDatesPrototype',
      title:
        'Display input boxes to allow a user to refine results by a date range',
      defaultValue: false,
      description:
        'Shows additional UI to allow a user to narrow search results by a date range.',
    },
    {
      id: 'showDatesSliderPrototype',
      title:
        'Display a slider to allow a user to refine results by a date range',
      defaultValue: false,
      description:
        'Shows additional UI to allow a user to narrow search results by using a date range slider.',
    },
    {
      id: 'showDatesAggregatePrototype',
      title:
        'Display list of date ranges to allow a user to refine results by a date range',
      defaultValue: false,
      description:
        'Shows additional UI to allow a user to narrow search results by using date ranges',
    },
  ],
};
