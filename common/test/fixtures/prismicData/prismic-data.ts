import { SimplifiedPrismicData } from '@weco/common/server-data/prismic';

const prismicData: SimplifiedPrismicData = {
  globalAlert: {
    data: {
      text: [
        { type: 'heading2', text: 'We are open', spans: [] },
        {
          type: 'paragraph',
          text: 'Our shop will be closed on Monday 22 January for staff training.',
          spans: [],
        },
      ],
      isShown: 'show',
      routeRegex: '^(?!(.*\\/items)|(.*\\/images)).*$',
    },
  },
  popupDialog: {
    data: {
      openButtonText: 'Got 10 minutes?',
      title: 'What brought you to our website today?',
      text: [
        {
          type: 'paragraph',
          text: 'We’re undertaking research with website visitors to find out some more about you and what you thought about your visit. This survey will take less than 10 minutes to complete. Thank you for your time!',
          spans: [],
        },
      ],
      linkText: 'Take the survey',
      link: {
        link_type: 'Web',
        url: 'https://interviewer.djsresearch.com/scripts/Dubinterviewer.dll/Frames?Quest=7577',
      },
      isShown: false,
      routeRegex: null,
    },
  },
  collectionVenues: {
    results: [
      {
        id: 'WsuZKh8AAOG_NyUo',
        data: {
          title: 'Wellcome Café',
          order: 4,
          monday: [
            {
              startDateTime: '2022-01-23T10:00:00+0000',
              endDateTime: '2022-01-23T18:00:00+0000',
            },
          ],
          tuesday: [
            {
              startDateTime: '2022-01-23T10:00:00+0000',
              endDateTime: '2022-01-23T18:00:00+0000',
            },
          ],
          wednesday: [
            {
              startDateTime: '2022-01-23T10:00:00+0000',
              endDateTime: '2022-01-23T18:00:00+0000',
            },
          ],
          thursday: [
            {
              startDateTime: '2022-01-23T10:00:00+0000',
              endDateTime: '2022-01-23T18:00:00+0000',
            },
          ],
          friday: [
            {
              startDateTime: '2022-01-23T10:00:00+0000',
              endDateTime: '2022-01-23T18:00:00+0000',
            },
          ],
          saturday: [
            {
              startDateTime: '2022-01-23T10:00:00+0000',
              endDateTime: '2022-01-23T18:00:00+0000',
            },
          ],
          sunday: [
            {
              startDateTime: '2022-01-23T10:00:00+0000',
              endDateTime: '2022-01-23T18:00:00+0000',
            },
          ],
          modifiedDayOpeningTimes: [],
        },
      },
      {
        id: 'Wsttgx8AAJeSNmJ4',
        data: {
          title: 'Galleries and Reading Room',
          order: 1,
          monday: [{ startDateTime: null, endDateTime: null }],
          tuesday: [
            {
              startDateTime: '2021-01-23T10:00:00+0000',
              endDateTime: '2022-01-23T18:00:00+0000',
            },
          ],
          wednesday: [
            {
              startDateTime: '2022-01-23T10:00:00+0000',
              endDateTime: '2022-01-23T18:00:00+0000',
            },
          ],
          thursday: [
            {
              startDateTime: '2022-01-23T10:00:00+0000',
              endDateTime: '2022-01-23T18:00:00+0000',
            },
          ],
          friday: [
            {
              startDateTime: '2022-01-23T10:00:00+0000',
              endDateTime: '2022-01-23T18:00:00+0000',
            },
          ],
          saturday: [
            {
              startDateTime: '2022-01-23T10:00:00+0000',
              endDateTime: '2022-01-23T18:00:00+0000',
            },
          ],
          sunday: [
            {
              startDateTime: '2022-01-23T10:00:00+0000',
              endDateTime: '2022-01-23T18:00:00+0000',
            },
          ],
          modifiedDayOpeningTimes: [],
        },
      },
      {
        id: 'WsuS_R8AACS1Nwlx',
        data: {
          title: 'Library',
          order: 2,
          monday: [
            {
              startDateTime: '2022-01-23T10:00:00+0000',
              endDateTime: '2022-01-23T18:00:00+0000',
            },
          ],
          tuesday: [
            {
              startDateTime: '2022-01-23T10:00:00+0000',
              endDateTime: '2022-01-23T18:00:00+0000',
            },
          ],
          wednesday: [
            {
              startDateTime: '2022-01-23T10:00:00+0000',
              endDateTime: '2022-01-23T18:00:00+0000',
            },
          ],
          thursday: [
            {
              startDateTime: '2022-01-23T10:00:00+0000',
              endDateTime: '2022-01-23T18:00:00+0000',
            },
          ],
          friday: [
            {
              startDateTime: '2022-01-23T10:00:00+0000',
              endDateTime: '2022-01-23T18:00:00+0000',
            },
          ],
          saturday: [
            {
              startDateTime: '2022-01-23T10:00:00+0000',
              endDateTime: '2022-01-23T16:00:00+0000',
            },
          ],
          sunday: [{ startDateTime: null, endDateTime: null }],
          modifiedDayOpeningTimes: [
            {
              overrideDate: '2020-12-24T10:00:00+0000',
              type: 'Christmas and New Year',
              startDateTime: null,
              endDateTime: null,
            },
            {
              overrideDate: '2020-12-25T10:00:00+0000',
              type: 'Christmas and New Year',
              startDateTime: null,
              endDateTime: null,
            },
            {
              overrideDate: '2020-12-27T10:00:00+0000',
              type: 'Christmas and New Year',
              startDateTime: null,
              endDateTime: null,
            },
          ],
        },
      },
      {
        id: 'WsuaIB8AAH-yNylo',
        data: {
          title: 'Wellcome Shop',
          order: 5,
          monday: [{ startDateTime: null, endDateTime: null }],
          tuesday: [{ startDateTime: null, endDateTime: null }],
          wednesday: [{ startDateTime: null, endDateTime: null }],
          thursday: [{ startDateTime: null, endDateTime: null }],
          friday: [{ startDateTime: null, endDateTime: null }],
          saturday: [{ startDateTime: null, endDateTime: null }],
          sunday: [{ startDateTime: null, endDateTime: null }],
          modifiedDayOpeningTimes: [],
        },
      },
    ],
  },
};

export default prismicData;
