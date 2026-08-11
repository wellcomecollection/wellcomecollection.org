import { Work } from '@weco/content/services/wellcome/catalogue/types';

const collectionTree: Work = {
  id: 'mrhxzfyr',
  title: '"The organization of DNA in chromatin"',
  alternativeTitles: [],
  referenceNumber: 'PP/CRI/D/2/40/1',
  description:
    '<p>Two typescript texts (the second a "revised version") of Sobell, Tsai and Gilbert, "The organization of DNA in chromatin," together with correspondence between Crick and Sobell, and Crick and PNAS referees (Struther Arnott and Watson Fuller).\n\n</p><p>The typescripts are accompanied by three photographic plates (b/w, each 10" x 8"), and a single colour polaroid photograph (3" x 3") of a molecular model.</p>',
  physicalDescription:
    '1 file Three photographic plates (b/w, each 10" x 8"), and a single colour polaroid photograph (3" x 3") of a molecular model.',
  workType: {
    id: 'archive-item',
    label: 'Archive item',
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
      value: 'e8b7cfbd-9cd7-4173-8023-37152579c04c',
      type: 'Identifier',
    },
    {
      identifierType: {
        id: 'calm-ref-no',
        label: 'Calm RefNo',
        type: 'IdentifierType',
      },
      value: 'PPCRI/D/2/40/1',
      type: 'Identifier',
    },
    {
      identifierType: {
        id: 'calm-altref-no',
        label: 'Calm AltRefNo',
        type: 'IdentifierType',
      },
      value: 'PP/CRI/D/2/40/1',
      type: 'Identifier',
    },
    {
      identifierType: {
        id: 'mets',
        label: 'METS',
        type: 'IdentifierType',
      },
      value: 'b18185678',
      type: 'Identifier',
    },
    {
      identifierType: {
        id: 'sierra-system-number',
        label: 'Sierra system number',
        type: 'IdentifierType',
      },
      value: 'b18185678',
      type: 'Identifier',
    },
  ],
  subjects: [],
  genres: [],
  items: [
    {
      id: 'ar277geb',
      identifiers: [
        {
          identifierType: {
            id: 'sierra-system-number',
            label: 'Sierra system number',
            type: 'IdentifierType',
          },
          value: 'i17120561',
          type: 'Identifier',
        },
        {
          identifierType: {
            id: 'sierra-identifier',
            label: 'Sierra identifier',
            type: 'IdentifierType',
          },
          value: '1712056',
          type: 'Identifier',
        },
      ],
      locations: [
        {
          locationType: {
            id: 'scmac',
            label: 'Closed stores Arch. & MSS',
            type: 'LocationType',
          },
          label: 'Closed stores Arch. & MSS',
          accessConditions: [
            {
              status: {
                id: 'open',
                label: 'Open',
                type: 'AccessStatus',
              },
              terms:
                'The papers are available subject to the usual conditions of access to Archives and Manuscripts material. A digitised copy is available to view via the online catalogue on the Wellcome Library website.',
              type: 'AccessCondition',
            },
          ],
          type: 'PhysicalLocation',
        },
        {
          locationType: {
            id: 'iiif-presentation',
            label: 'IIIF Presentation API',
            type: 'LocationType',
          },
          url: 'https://wellcomelibrary.org/iiif/b18185678/manifest',
          license: {
            id: 'cc-by-nc',
            label: 'Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)',
            url: 'https://creativecommons.org/licenses/by-nc/4.0/',
            type: 'License',
          },
          accessConditions: [
            {
              status: {
                id: 'open-with-advisory',
                label: 'Open with Advisory',
                type: 'AccessStatus',
              },
              type: 'AccessCondition',
            },
          ],
          type: 'DigitalLocation',
        },
      ],
      type: 'Item',
    },
  ],
  production: [
    {
      label: '1976',
      places: [],
      agents: [],
      dates: [
        {
          label: '1976',
          type: 'Period',
        },
      ],
      type: 'ProductionEvent',
    },
  ],
  notes: [],
  images: [],
  parts: [],
  partOf: [
    {
      id: 'rt2rxj93',
      title: 'Correspondence: Sobell, Henry M',
      referenceNumber: 'PP/CRI/D/2/40',
      partOf: [
        {
          id: 'z8ssg9su',
          title: 'Individual Correspondents',
          referenceNumber: 'PP/CRI/D/2',
          partOf: [
            {
              id: 'ss8nh2gk',
              title: 'Correspondence',
              referenceNumber: 'PP/CRI/D',
              partOf: [
                {
                  id: 'hz43r7re',
                  title: 'Francis Crick (1916-2004): archives',
                  referenceNumber: 'PP/CRI',
                  partOf: [],
                  type: 'Work',
                },
              ],
              type: 'Work',
            },
          ],
          type: 'Work',
        },
      ],
      type: 'Work',
    },
  ],
  type: 'Work',
  formerFrequency: [],
  designation: [],
  languages: [],
  holdings: [],
};

export default collectionTree;
