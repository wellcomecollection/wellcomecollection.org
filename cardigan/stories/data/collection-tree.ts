import {
  RelatedWork,
  Work,
} from '@weco/content/services/wellcome/catalogue/types';
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

const archiveWorkDefaults: Pick<
  Work,
  | 'alternativeTitles'
  | 'physicalDescription'
  | 'contributors'
  | 'identifiers'
  | 'subjects'
  | 'genres'
  | 'items'
  | 'production'
  | 'notes'
  | 'images'
  | 'parts'
  | 'formerFrequency'
  | 'designation'
  | 'languages'
  | 'holdings'
> = {
  alternativeTitles: [],
  physicalDescription: '',
  contributors: [],
  identifiers: [],
  subjects: [],
  genres: [],
  items: [],
  production: [],
  notes: [],
  images: [],
  parts: [],
  formerFrequency: [],
  designation: [],
  languages: [],
  holdings: [],
};

// A RelatedWork entry as it appears in another work's `partOf` - just
// enough to identify it and place it in the tree.
function ancestor(
  id: string,
  title: string,
  referenceNumber: string,
  type: Work['type'],
  totalParts: number
): RelatedWork {
  return {
    id,
    title,
    alternativeTitles: [],
    referenceNumber,
    type,
    totalParts,
  };
}

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

const rootRef = ancestor(
  collectionTree.id,
  collectionTree.title,
  collectionTree.referenceNumber!,
  collectionTree.type,
  1
);
const sectionRef = ancestor('section-a', 'Personal', 'PP/TLC/A', 'Section', 2);
const seriesA1Ref = ancestor('series-a1', 'Career', 'PP/TLC/A.1', 'Series', 2);
const seriesA2Ref = ancestor(
  'series-a2',
  'Non-professional writing',
  'PP/TLC/A.2',
  'Series',
  1
);

// A flat, collectionPath-ordered results page - what
// `getArchiveCollectionContents` gets back from a real `collection.root`
// search. Stubbed into the ArchiveCollectionContents story's fetch so it
// doesn't depend on live catalogue data.
export const collectionResults: Work[] = [
  { ...archiveWorkDefaults, ...collectionTree, partOf: [] },
  {
    ...archiveWorkDefaults,
    id: sectionRef.id,
    title: sectionRef.title,
    referenceNumber: sectionRef.referenceNumber,
    type: sectionRef.type,
    totalParts: sectionRef.totalParts,
    partOf: [rootRef],
  },
  {
    ...archiveWorkDefaults,
    id: seriesA1Ref.id,
    title: seriesA1Ref.title,
    referenceNumber: seriesA1Ref.referenceNumber,
    type: seriesA1Ref.type,
    totalParts: seriesA1Ref.totalParts,
    partOf: [sectionRef, rootRef],
  },
  {
    ...archiveWorkDefaults,
    id: 'item-a1-1',
    title: 'Newspaper clipping: fellowship examination results',
    referenceNumber: 'PP/TLC/A.1/1',
    type: 'Work',
    partOf: [seriesA1Ref, sectionRef, rootRef],
  },
  {
    ...archiveWorkDefaults,
    id: 'item-a1-2',
    title: 'Correspondence with the Royal College',
    referenceNumber: 'PP/TLC/A.1/2',
    type: 'Work',
    partOf: [seriesA1Ref, sectionRef, rootRef],
  },
  {
    ...archiveWorkDefaults,
    id: seriesA2Ref.id,
    title: seriesA2Ref.title,
    referenceNumber: seriesA2Ref.referenceNumber,
    type: seriesA2Ref.type,
    totalParts: seriesA2Ref.totalParts,
    partOf: [sectionRef, rootRef],
  },
  {
    ...archiveWorkDefaults,
    id: 'item-a2-1',
    title: 'Notebook of verse',
    referenceNumber: 'PP/TLC/A.2/1',
    type: 'Work',
    partOf: [seriesA2Ref, sectionRef, rootRef],
  },
];
