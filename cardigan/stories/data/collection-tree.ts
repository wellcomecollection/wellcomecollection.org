import { Work } from '@weco/content/services/wellcome/catalogue/types';
import { UiTree } from '@weco/content/views/pages/works/work/work.types';

// A small, made-up archive hierarchy - just enough branching to show
// nesting, chevrons and the guideline. Not real catalogue data. Used to
// demo NestedList.
export const sampleTree: UiTree = [
  {
    openStatus: true,
    data: {
      id: 'root',
      title: 'Sample archive collection',
      alternativeTitles: [],
      referenceNumber: 'PP/SAMPLE',
      type: 'Collection',
      totalParts: 2,
    },
    children: [
      {
        openStatus: true,
        data: {
          id: 'series-a',
          title: 'Correspondence',
          alternativeTitles: [],
          referenceNumber: 'PP/SAMPLE/A',
          type: 'Series',
          totalParts: 2,
        },
        children: [
          {
            openStatus: true,
            data: {
              id: 'item-a1',
              title: 'Letter to a colleague',
              alternativeTitles: [],
              referenceNumber: 'PP/SAMPLE/A/1',
              type: 'Work',
            },
          },
          {
            openStatus: true,
            data: {
              id: 'item-a2',
              title: 'Letter from a colleague',
              alternativeTitles: [],
              referenceNumber: 'PP/SAMPLE/A/2',
              type: 'Work',
            },
          },
        ],
      },
      {
        openStatus: false,
        data: {
          id: 'series-b',
          title: 'Photographs',
          alternativeTitles: [],
          referenceNumber: 'PP/SAMPLE/B',
          type: 'Series',
          totalParts: 1,
        },
        children: [
          {
            openStatus: true,
            data: {
              id: 'item-b1',
              title: 'Photograph of a laboratory',
              alternativeTitles: [],
              referenceNumber: 'PP/SAMPLE/B/1',
              type: 'Work',
            },
          },
        ],
      },
    ],
  },
];

// The root of a real archive collection, used to demo ArchiveCollectionContents.
const collectionTree: Work = {
  id: 'aegabdcp',
  title: "Cleave, Surgeon Captain 'Peter' Thomas Latimer",
  alternativeTitles: [],
  referenceNumber: 'PP/TLC',
  physicalDescription: '',
  workType: {
    id: 'h',
    label: 'Archives and manuscripts',
    type: 'Format',
  },
  contributors: [],
  identifiers: [
    {
      identifierType: {
        id: 'calm-record-id',
        label: 'Calm RecordIdentifier',
        type: 'IdentifierType',
      },
      value: '81fbeaf1-e7a4-45d7-a063-6ab6d9f5bf64',
      type: 'Identifier',
    },
  ],
  subjects: [],
  genres: [],
  items: [],
  production: [],
  notes: [],
  images: [],
  parts: [],
  partOf: [],
  type: 'Collection',
  formerFrequency: [],
  designation: [],
  languages: [],
  holdings: [],
  collection: {
    root: {
      id: 'aegabdcp',
      title: "Cleave, Surgeon Captain 'Peter' Thomas Latimer",
      alternativeTitles: [],
      referenceNumber: 'PP/TLC',
      type: 'Collection',
      totalParts: 7,
    },
    isRoot: true,
  },
};

export default collectionTree;
