import {
  AudioPlayerSlice as RawAudioPlayerSlice,
  CollectionVenueSlice as RawCollectionVenueSlice,
  ContactSlice as RawContactSlice,
} from '@weco/common/prismicio-types';

import { imageWithCrops } from './images';

export const audioPlayerSlice: RawAudioPlayerSlice = {
  variation: 'default',
  version: 'initial',
  items: [],
  primary: {
    title: [
      {
        type: 'heading1',
        text: 'Introduction to Finger Talk with audio description',
        spans: [],
        direction: 'ltr',
      },
    ],
    audio: {
      link_type: 'Media',
      key: '31740bd0-2b7e-41f3-b8de-57dbfbdcbfcd',
      kind: 'file',
      id: 'aHELoUMqNJQqHy9X',
      url: 'https://wellcomecollection.cdn.prismic.io/wellcomecollection/aHELoUMqNJQqHy9X_FingerTalkAD.mp3',
      name: 'Finger Talk AD.mp3',
      size: '4154610',
    },
    transcript: [
      {
        type: 'paragraph',
        text: 'This is the audio description for Finger Talk.',
        spans: [],
        direction: 'ltr',
      },
      {
        type: 'paragraph',
        text: 'Hello, my name is Laurie Britton Newell. I am the curator of Finger Talk. ',
        spans: [],
        direction: 'ltr',
      },
      {
        type: 'paragraph',
        text: 'Finger Talk is a new British Sign Language artwork by Cathy Mager.',
        spans: [],
        direction: 'ltr',
      },
    ],
  },
  id: 'audioPlayer$fbb55178-fdab-4b95-92de-183c421f9718',
  slice_type: 'audioPlayer',
  slice_label: null,
};

export const collectionVenueSlice: RawCollectionVenueSlice = {
  variation: 'default',
  version: 'initial',
  items: [],
  primary: {
    content: {
      link_type: 'Document',
      id: 'Wsttgx8AAJeSNmJ4',
      uid: 'Wsttgx8AAJeSNmJ4',
      type: 'collection-venue',
      tags: ['ShortNoticeClosure'],
      lang: 'en-gb',
      data: {
        title: 'Galleries and Reading Room',
        order: 1,
        image: imageWithCrops,
        link: {
          link_type: 'Web',
          key: '644bd9e2-57a1-43cf-98b0-ec633ef73e44',
          url: 'https://wellcomecollection.org/whats-on',
        },
        linkText: [
          {
            type: 'paragraph',
            text: 'See what’s on',
            spans: [],
          },
        ],
        monday: [
          {
            startDateTime: null,
            endDateTime: null,
          },
        ],
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
            endDateTime: '2022-01-23T20:00:00+0000',
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
        modifiedDayOpeningTimes: [
          {
            overrideDate: '2035-08-24T23:00:00+0000',
            type: 'Bank holiday',
            startDateTime: '2035-08-25T09:00:00+0000',
            endDateTime: '2035-08-25T17:00:00+0000',
          },
        ],
      },
      isBroken: false,
    },
    showClosingTimes: null,
    isFeatured: false,
  },
  id: 'collectionVenue$c04c79f2-e53a-4ae2-aa69-958ae0d598ca',
  slice_type: 'collectionVenue',
  slice_label: null,
};

export const contactSlice: RawContactSlice = {
  variation: 'default',
  version: 'initial',
  items: [],
  primary: {
    content: {
      id: 'aJoEJxIAACUAetZ2',
      type: 'teams',
      tags: [],
      lang: 'en-gb',
      slug: 'collections-information-team',
      data: {
        title: [
          {
            type: 'paragraph',
            text: 'Joe Bloggs',
            spans: [],
          },
        ],
        subtitle: [
          {
            type: 'paragraph',
            text: 'Media & Communications Lead, Wellcome Collection',
            spans: [],
          },
        ],
        email: 'j.bloggs@wellcome.org',
        phone: '12345678',
      },
      link_type: 'Document',
      isBroken: false,
    },
  },
  id: 'contact$19896a6a-3e78-44c1-ae25-745f8ca77be9',
  slice_type: 'contact',
  slice_label: null,
};
