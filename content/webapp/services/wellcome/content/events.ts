import { EventDocument } from './types/api';
import {
  ContentApiProps,
  ContentResultsList,
} from '@weco/content/services/wellcome/content/types/api';
// import { contentQuery } from '.';
import { QueryProps, WellcomeApiError } from '..';

export async function getEvents(
  props: QueryProps<ContentApiProps> // eslint-disable-line 
): Promise<ContentResultsList<EventDocument> | WellcomeApiError> {
  // const getEventsResult = await contentQuery<ContentApiProps, EventDocument>(
  //   'events',
  //   props
  // );
  // return getEventsResult;
  return {
    type: 'ResultList',
    totalResults: 200,
    totalPages: 10,
    results: [
      {
        type: 'Event',
        title: 'Land Body Ecologies Festival Day Two',
        format: {
          id: 'W5fV5iYAACQAMxHb',
          label: 'Festival',
          type: 'EventFormat',
        },
        id: 'ZFt0WhQAAHnPEH7P',
        image: {
          type: 'PrismicImage',
          alt: 'Photograph of a farmer getting ready to harvest his organic crop of native Ragi in Kariyappanadoddi, India. Behind him are hills and a small single storey building. Interwoven into the scene is a graphic element made up of thin red drawn circular lines, which create a larger organic pattern behind the farmer.',
          copyright:
            'Farmer Basavaraj in Kariyappanadoddi inspects his ragi crop before harvesting near Bannerghatta, India | | | | | Quicksand |',
          dimensions: {
            height: 2250,
            width: 4000,
          },
          url: 'https://images.prismic.io/wellcomecollection/0793d963-8807-4525-a3d7-e77fa4435baa_LBE+Key+Image+04.jpg?auto=compress,format',
          edit: {
            background: '#fff',
            x: 0,
            y: 0,
            zoom: 1,
          },
          id: 'ZGYrjxQAADxsO9nG',
          '16:9': {
            alt: 'Photograph of a farmer getting ready to harvest his organic crop of native Ragi in Kariyappanadoddi, India. Behind him are hills and a small single storey building. Interwoven into the scene is a graphic element made up of thin red drawn circular lines, which create a larger organic pattern behind the farmer.',
            copyright:
              'Farmer Basavaraj in Kariyappanadoddi inspects his ragi crop before harvesting near Bannerghatta, India | | | | | Quicksand |',
            dimensions: {
              height: 1800,
              width: 3200,
            },
            edit: {
              background: '#fff',
              x: 0,
              y: 0,
              zoom: 0.8,
            },
            id: 'ZGYrjxQAADxsO9nG',
            url: 'https://images.prismic.io/wellcomecollection/0793d963-8807-4525-a3d7-e77fa4435baa_LBE+Key+Image+04.jpg?auto=compress,format&rect=0,0,4000,2250&w=3200&h=1800',
          },
          '32:15': {
            alt: 'Photograph of a farmer getting ready to harvest his organic crop of native Ragi in Kariyappanadoddi, India. Behind him are hills and a small single storey building. Interwoven into the scene is a graphic element made up of thin red drawn circular lines, which create a larger organic pattern behind the farmer.',
            copyright:
              'Farmer Basavaraj in Kariyappanadoddi inspects his ragi crop before harvesting near Bannerghatta, India | | | | | Quicksand |',
            dimensions: {
              height: 1500,
              width: 3200,
            },
            edit: {
              background: '#fff',
              x: 0,
              y: -185,
              zoom: 0.8,
            },
            id: 'ZGYrjxQAADxsO9nG',
            url: 'https://images.prismic.io/wellcomecollection/0793d963-8807-4525-a3d7-e77fa4435baa_LBE+Key+Image+04.jpg?auto=compress,format&rect=0,232,4000,1875&w=3200&h=1500',
          },
          square: {
            alt: 'Photograph of a farmer getting ready to harvest his organic crop of native Ragi in Kariyappanadoddi, India. Behind him are hills and a small single storey building. Interwoven into the scene is a graphic element made up of thin red drawn circular lines, which create a larger organic pattern behind the farmer.',
            copyright:
              'Farmer Basavaraj in Kariyappanadoddi inspects his ragi crop before harvesting near Bannerghatta, India | | | | | Quicksand |',
            dimensions: {
              height: 3200,
              width: 3200,
            },
            edit: {
              background: '#fff',
              x: -1709,
              y: 0,
              zoom: 1.4222222222222223,
            },
            id: 'ZGYrjxQAADxsO9nG',
            url: 'https://images.prismic.io/wellcomecollection/0793d963-8807-4525-a3d7-e77fa4435baa_LBE+Key+Image+04.jpg?auto=compress,format&rect=1202,0,2250,2250&w=3200&h=3200',
          },
        },
        interpretations: [],
        locations: [
          {
            id: 'XEnJIhUAAArdgVsW',
            label: 'Throughout our building',
            type: 'EventLocation',
          },
          {
            id: 'ef04c8e3-26be-4fbc-9bef-f52589ebc56c',
            label: 'Online',
            type: 'EventLocation',
          },
        ],
        times: [
          {
            endDateTime: new Date('2023-06-23T17:00:00.000Z'),
            startDateTime: new Date('2023-06-23T09:00:00.000Z'),
          },
        ],
        isAvailableOnline: true,
      },
      {
        type: 'Event',
        title: 'Perspective Tour With Jess Dobkin',
        format: {
          id: 'WmYRpCQAACUAn-Ap',
          label: 'Gallery tour',
          type: 'EventFormat',
        },
        id: 'ZJLZoRAAACIARz42',
        image: {
          type: 'PrismicImage',
          url: 'https://images.prismic.io/wellcomecollection/3e1ef5ca-cf7f-40e5-b1dc-0730a5e11225_EP_002225_007-full.jpg?auto=compress,format',
          alt: "Photograph of an art installation in gallery space. It's a dark space with black glossy floors and walls. A large parachute suspended from the ceiling which is lit with vibrant pink and orange light. Two visitors are looking at the instillation.",
          copyright:
            'From the Collection: For What It’s Worth, 2023. Jess Dobkin |  Gallery photo: Steven Pocock | | | CC-BY-NC | |',
          dimensions: {
            height: 2250,
            width: 4000,
          },
          edit: {
            background: '#fff',
            x: 0,
            y: 0,
            zoom: 1,
          },
          id: 'ZKgZeBAAACEAfpCr',
          '16:9': {
            alt: "Photograph of an art installation in gallery space. It's a dark space with black glossy floors and walls. A large parachute suspended from the ceiling which is lit with vibrant pink and orange light. Two visitors are looking at the instillation.",
            copyright:
              'From the Collection: For What It’s Worth, 2023. Jess Dobkin |  Gallery photo: Steven Pocock | | | CC-BY-NC | |',
            dimensions: {
              height: 1800,
              width: 3200,
            },
            edit: {
              background: '#fff',
              x: 0,
              y: 0,
              zoom: 0.8,
            },
            id: 'ZKgZeBAAACEAfpCr',
            url: 'https://images.prismic.io/wellcomecollection/3e1ef5ca-cf7f-40e5-b1dc-0730a5e11225_EP_002225_007-full.jpg?auto=compress,format&rect=0,0,4000,2250&w=3200&h=1800',
          },
          '32:15': {
            alt: "Photograph of an art installation in gallery space. It's a dark space with black glossy floors and walls. A large parachute suspended from the ceiling which is lit with vibrant pink and orange light. Two visitors are looking at the instillation.",
            copyright:
              'From the Collection: For What It’s Worth, 2023. Jess Dobkin |  Gallery photo: Steven Pocock | | | CC-BY-NC | |',
            dimensions: {
              height: 1500,
              width: 3200,
            },
            edit: {
              background: '#fff',
              x: 0,
              y: -150,
              zoom: 0.8,
            },
            id: 'ZKgZeBAAACEAfpCr',
            url: 'https://images.prismic.io/wellcomecollection/3e1ef5ca-cf7f-40e5-b1dc-0730a5e11225_EP_002225_007-full.jpg?auto=compress,format&rect=0,188,4000,1875&w=3200&h=1500',
          },
          square: {
            alt: "Photograph of an art installation in gallery space. It's a dark space with black glossy floors and walls. A large parachute suspended from the ceiling which is lit with vibrant pink and orange light. Two visitors are looking at the instillation.",
            copyright:
              'From the Collection: For What It’s Worth, 2023. Jess Dobkin |  Gallery photo: Steven Pocock | | | CC-BY-NC | |',
            dimensions: {
              height: 3200,
              width: 3200,
            },
            edit: {
              background: '#fff',
              x: -1935,
              y: 0,
              zoom: 1.4222222222222223,
            },
            id: 'ZKgZeBAAACEAfpCr',
            url: 'https://images.prismic.io/wellcomecollection/3e1ef5ca-cf7f-40e5-b1dc-0730a5e11225_EP_002225_007-full.jpg?auto=compress,format&rect=1361,0,2250,2250&w=3200&h=3200',
          },
        },
        interpretations: [
          {
            id: 'XkFGqxEAACIAIhNH',
            label: 'British Sign Language',
            type: 'EventInterpretation',
          },
        ],
        locations: [
          {
            id: 'W22bICkAACgA-hVJ',
            label: 'Information Point',
            type: 'EventLocation',
          },
        ],
        times: [
          {
            endDateTime: new Date('2023-08-24T17:30:00.000Z'),
            startDateTime: new Date('2023-08-24T16:30:00.000Z'),
          },
        ],
        isAvailableOnline: false,
      },
    ],
    pageSize: 6,
    prevPage: null,
    nextPage: null,
    _requestUrl: '',
  };
}