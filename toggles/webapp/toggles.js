module.exports = {
  toggles: [
    {
      id: 'betaBar',
      title: 'Beta bar',
      defaultValue: false,
      description:
        'Letting people know that the service is being worked on, how they might ' +
        "find out about what's going on, and let us know what they think.",
    },
    {
      id: 'catalogueSearchHeaderExploreMessaging',
      title: 'Search landing page messaging',
      defaultValue: false,
      description:
        'Using a different type of language on the landing page for our collections',
    },
    {
      id: 'collectionsInMainNavigation',
      title: 'Collections in main navigation',
      defaultValue: false,
      description: 'Use `Collections` as the label in the main navigation',
    },
    {
      id: 'tabbedNavOnSearchForm',
      title: 'Tabbed work type navigation on search form',
      defaultValue: false,
      description:
        'Tabbed navigation on search form to allow people to select between books and visuals',
    },
    {
      id: 'tabbedNavOnResults',
      title: 'Tabbed work type navigation on search results',
      defaultValue: false,
      description:
        'Tabbed navigation on search results to allow people to select between books and visuals',
    },
    {
      id: 'showCatalogueSearchFilters',
      title: 'Catalogue search filters',
      defaultValue: false,
      description:
        'We currently filter the results of the catalogue to show Pictures and ' +
        'Digital images work types, and only results with images.' +
        'This will show unfilter those results, and allow for filtering.',
    },
    {
      id: 'feedback',
      title: 'Feedback',
      defaultValue: false,
      description: 'Asking people for feedback on our service',
    },
    {
      id: 'showWorkLocations',
      title: 'Show the locations of a work in the header',
      defaultValue: false,
      description:
        'These can be either physical or digital locations. We need to do a little bt of work figuring out what all the codes mean to get the messaging right.',
    },
  ],
};
