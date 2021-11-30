export default {
  toggles: {
    showLogin: false,
    showItemRequestFlow: false,
    stagingApi: false,
    apiToolbar: false,
  },
  globalAlert: {
    text: [
      { type: 'heading2', text: 'We are open', spans: [] },
      {
        type: 'paragraph',
        text: 'To make your visit as safe and enjoyable as possible you’ll need to book a free ticket in order to enter the building. Find out all you need to know.',
        spans: [
          {
            start: 119,
            end: 148,
            type: 'hyperlink',
            data: {
              id: 'X5amzBIAAB0Aq6Gm',
              type: 'pages',
              tags: ['visit-us'],
              slug: 'welcome-back',
              lang: 'en-gb',
              first_publication_date: '2020-10-29T16:41:48+0000',
              last_publication_date: '2021-07-19T08:11:58+0000',
              link_type: 'Document',
              isBroken: false,
            },
          },
        ],
      },
    ],
    isShown: 'hide',
    routeRegex: '^(?!(.*\\/items)|(.*\\/images)).*$',
  },
};
