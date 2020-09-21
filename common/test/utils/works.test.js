// @flow

import {
  getProductionDates,
  getItemsWith,
  getItemIdentifiersWith,
  getWorkIdentifiersWith,
  getArchiveAncestorArray,
} from '../../utils/works';
import { WorkFixture } from '../fixtures/catalogueApi/work';

describe('getProductionDates', () => {
  it('should extract date labels from a work', () => {
    const dateLabel = getProductionDates(WorkFixture);

    expect(dateLabel).toStrictEqual(['[between 1990 and 1999?]']);
  });
});

describe('getItemsWith', () => {
  it('gets the items with indicated by the parameters', () => {
    const items = getItemsWith(WorkFixture, {
      identifierId: 'sierra-system-number',
      locationType: 'PhysicalLocation',
    });

    expect(items.length).toBe(1);
    expect(items[0].id).toBe('ys3ern6x');
  });
});

describe('getWorkIdentifiersWith', () => {
  it('should get the work identifiers indicated by the parameters', () => {
    const identifiers = getWorkIdentifiersWith(WorkFixture, {
      identifierId: 'sierra-system-number',
    });

    expect(identifiers.length).toBe(1);
    expect(identifiers[0]).toBe('b16656180');
  });
});

describe('getItemIdentifiersWith', () => {
  it('gets the item identifiers indicated by the parameters', () => {
    const identifiers = getItemIdentifiersWith(
      WorkFixture,
      {
        identifierId: 'sierra-system-number',
        locationType: 'PhysicalLocation',
      },
      'sierra-system-number'
    );

    expect(identifiers.length).toBe(1);
    expect(identifiers[0]).toBe('i16010176');
  });
});

const workOne = {
  id: 'pbtyx2xx',
  title: 'Physics Research Students, Cavendish Laboratory',
  alternativeTitles: [],
  referenceNumber: 'PP/CRI/A/1/2/1',
  description:
    '<p>Group portrait of Physics Research Students, Cavendish Laboratory, Cambridge (June, 1952), with a key to individual students, including James Watson and Crick  (first row standing, sixth and seventh from the left, respectively).\n\n</p><p>The file includes a photographic facsimile.</p>',
  physicalDescription:
    '1 file Photograph (b/w, 111/2" x 9"): group portrait of Physics Research Students, Cavendish Laboratory (June, 1952).  Also, photographic facsimile of the same.',
  workType: {
    id: 'archive-item',
    label: 'Archive item',
    type: 'WorkType',
  },
  contributors: [],
  identifiers: [
    {
      identifierType: {
        id: 'calm-record-id',
        label: 'Calm RecordIdentifier',
        type: 'IdentifierType',
      },
      value: 'd946b657-d7db-44b6-b4f3-8790867c53f2',
      type: 'Identifier',
    },
    {
      identifierType: {
        id: 'calm-ref-no',
        label: 'Calm RefNo',
        type: 'IdentifierType',
      },
      value: 'PPCRI/A/1/2/1',
      type: 'Identifier',
    },
    {
      identifierType: {
        id: 'calm-altref-no',
        label: 'Calm AltRefNo',
        type: 'IdentifierType',
      },
      value: 'PP/CRI/A/1/2/1',
      type: 'Identifier',
    },
    {
      identifierType: {
        id: 'sierra-system-number',
        label: 'Sierra system number',
        type: 'IdentifierType',
      },
      value: 'b16129143',
      type: 'Identifier',
    },
    {
      identifierType: {
        id: 'mets',
        label: 'METS',
        type: 'IdentifierType',
      },
      value: 'b16129143',
      type: 'Identifier',
    },
  ],
  subjects: [],
  genres: [],
  items: [
    {
      id: 'fe2bznnj',
      identifiers: [
        {
          identifierType: {
            id: 'sierra-system-number',
            label: 'Sierra system number',
            type: 'IdentifierType',
          },
          value: 'i15344381',
          type: 'Identifier',
        },
        {
          identifierType: {
            id: 'sierra-identifier',
            label: 'Sierra identifier',
            type: 'IdentifierType',
          },
          value: '1534438',
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
          url: 'https://wellcomelibrary.org/iiif/b16129143/manifest',
          license: {
            id: 'cc-by-nc',
            label: 'Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)',
            url: 'https://creativecommons.org/licenses/by-nc/4.0/',
            type: 'License',
          },
          accessConditions: [
            {
              status: {
                id: 'open',
                label: 'Open',
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
      label: '1952',
      places: [],
      agents: [],
      dates: [
        {
          label: '1952',
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
      id: 't9d9yrsx',
      title: 'Miscellaneous Photographs',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2',
      contributors: [],
      identifiers: [
        {
          identifierType: {
            id: 'calm-record-id',
            label: 'Calm RecordIdentifier',
            type: 'IdentifierType',
          },
          value: '11afd01b-eb45-4f8c-9451-0f08778106c1',
          type: 'Identifier',
        },
      ],
      subjects: [],
      genres: [],
      items: [],
      production: [],
      notes: [],
      images: [],
      partOf: [
        {
          id: 'pwbpp7gj',
          title: 'Miscellaneous Personal Items',
          alternativeTitles: [],
          referenceNumber: 'PP/CRI/A/1',
          contributors: [],
          identifiers: [
            {
              identifierType: {
                id: 'calm-record-id',
                label: 'Calm RecordIdentifier',
                type: 'IdentifierType',
              },
              value: '8dedbf0f-3617-4edd-adf7-44a35526eb58',
              type: 'Identifier',
            },
          ],
          subjects: [],
          genres: [],
          items: [],
          production: [],
          notes: [],
          images: [],
          partOf: [
            {
              id: 'gnfmdk33',
              title: 'Personal Material',
              alternativeTitles: [],
              referenceNumber: 'PP/CRI/A',
              contributors: [],
              identifiers: [
                {
                  identifierType: {
                    id: 'calm-record-id',
                    label: 'Calm RecordIdentifier',
                    type: 'IdentifierType',
                  },
                  value: '6f53c141-652c-4079-bdfd-314ddfc87c1a',
                  type: 'Identifier',
                },
              ],
              subjects: [],
              genres: [],
              items: [],
              production: [],
              notes: [],
              images: [],
              partOf: [
                {
                  id: 'hz43r7re',
                  title: 'Francis Crick (1916-2004): archives',
                  alternativeTitles: [],
                  referenceNumber: 'PP/CRI',
                  contributors: [],
                  identifiers: [
                    {
                      identifierType: {
                        id: 'calm-record-id',
                        label: 'Calm RecordIdentifier',
                        type: 'IdentifierType',
                      },
                      value: '61170778-69e7-43fe-8e4a-a5ad4f8a1478',
                      type: 'Identifier',
                    },
                  ],
                  subjects: [],
                  genres: [],
                  items: [],
                  production: [],
                  notes: [],
                  images: [],
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
  precededBy: [],
  succeededBy: [
    {
      id: 'ytffguzf',
      title: 'Group Portrait, Gordon Research Conference',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/2',
      contributors: [],
      identifiers: [
        {
          identifierType: {
            id: 'calm-record-id',
            label: 'Calm RecordIdentifier',
            type: 'IdentifierType',
          },
          value: '45c07068-352f-4486-83fb-0c88578d8248',
          type: 'Identifier',
        },
      ],
      subjects: [],
      genres: [],
      items: [],
      production: [],
      notes: [],
      images: [],
      type: 'Work',
    },
    {
      id: 'jhxw83wa',
      title: 'Group Portrait, Gordon Research Conference',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/3',
      contributors: [],
      identifiers: [
        {
          identifierType: {
            id: 'calm-record-id',
            label: 'Calm RecordIdentifier',
            type: 'IdentifierType',
          },
          value: 'bee458f3-816f-4bee-ae79-ca75432e7aeb',
          type: 'Identifier',
        },
      ],
      subjects: [],
      genres: [],
      items: [],
      production: [],
      notes: [],
      images: [],
      type: 'Work',
    },
    {
      id: 'te2x8hc7',
      title: 'Crick at The Weizmann Institute of Science, Rehovoth, Israel',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/4',
      contributors: [],
      identifiers: [
        {
          identifierType: {
            id: 'calm-record-id',
            label: 'Calm RecordIdentifier',
            type: 'IdentifierType',
          },
          value: 'b9f6b2ac-0e4f-42af-ae81-1a7810dbbbfc',
          type: 'Identifier',
        },
      ],
      subjects: [],
      genres: [],
      items: [],
      production: [],
      notes: [],
      images: [],
      type: 'Work',
    },
    {
      id: 'j9cmjvpb',
      title: 'Crick, Onsager, Dirac and Lamb',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/5',
      contributors: [],
      identifiers: [
        {
          identifierType: {
            id: 'calm-record-id',
            label: 'Calm RecordIdentifier',
            type: 'IdentifierType',
          },
          value: 'ef1974fb-b4ab-4db1-84c5-a37c86259908',
          type: 'Identifier',
        },
      ],
      subjects: [],
      genres: [],
      items: [],
      production: [],
      notes: [],
      images: [],
      type: 'Work',
    },
    {
      id: 'gqwjr82x',
      title: 'National Geographic Society Portrait',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/6',
      contributors: [],
      identifiers: [
        {
          identifierType: {
            id: 'calm-record-id',
            label: 'Calm RecordIdentifier',
            type: 'IdentifierType',
          },
          value: '2456f81f-87d1-407f-8343-fffa9c3c5ca9',
          type: 'Identifier',
        },
      ],
      subjects: [],
      genres: [],
      items: [],
      production: [],
      notes: [],
      images: [],
      type: 'Work',
    },
    {
      id: 'gh3ykjcx',
      title: 'Crick Lecturing (Composite Image)',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/7',
      contributors: [],
      identifiers: [
        {
          identifierType: {
            id: 'calm-record-id',
            label: 'Calm RecordIdentifier',
            type: 'IdentifierType',
          },
          value: 'c90af24d-05b4-4cf7-8a93-5951c1a62994',
          type: 'Identifier',
        },
      ],
      subjects: [],
      genres: [],
      items: [],
      production: [],
      notes: [],
      images: [],
      type: 'Work',
    },
    {
      id: 'q8z3a932',
      title: 'Wall Graffiti',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/8',
      contributors: [],
      identifiers: [
        {
          identifierType: {
            id: 'calm-record-id',
            label: 'Calm RecordIdentifier',
            type: 'IdentifierType',
          },
          value: 'c1f0a9ca-dc9c-4ff5-b91d-431ee47ea67f',
          type: 'Identifier',
        },
      ],
      subjects: [],
      genres: [],
      items: [],
      production: [],
      notes: [],
      images: [],
      type: 'Work',
    },
    {
      id: 'y5vqsvj4',
      title: 'Crick Lecturing',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/9',
      contributors: [],
      identifiers: [
        {
          identifierType: {
            id: 'calm-record-id',
            label: 'Calm RecordIdentifier',
            type: 'IdentifierType',
          },
          value: 'bde71dd2-8081-4cd8-954b-8c5267d0ab9b',
          type: 'Identifier',
        },
      ],
      subjects: [],
      genres: [],
      items: [],
      production: [],
      notes: [],
      images: [],
      type: 'Work',
    },
  ],
  type: 'Work',
  '@context': 'https://api.wellcomecollection.org/catalogue/v2/context.json',
};

const workOneResult = [
  {
    id: 'hz43r7re',
    title: 'Francis Crick (1916-2004): archives',
    alternativeTitles: [],
    referenceNumber: 'PP/CRI',
    type: 'Work',
  },
  {
    id: 'gnfmdk33',
    title: 'Personal Material',
    alternativeTitles: [],
    referenceNumber: 'PP/CRI/A',
    type: 'Work',
  },
  {
    id: 'pwbpp7gj',
    title: 'Miscellaneous Personal Items',
    alternativeTitles: [],
    referenceNumber: 'PP/CRI/A/1',
    type: 'Work',
  },
  {
    id: 't9d9yrsx',
    title: 'Miscellaneous Photographs',
    alternativeTitles: [],
    referenceNumber: 'PP/CRI/A/1/2',
    type: 'Work',
  },
];

const workTwo = {
  id: 't9d9yrsx',
  title: 'Miscellaneous Photographs',
  alternativeTitles: [],
  referenceNumber: 'PP/CRI/A/1/2',
  description:
    'Miscellaneous photographs.  Further photographs, scientific and personal, can be found in situ in the main body of PP/CRI (a search against "photograph" will reveal them).',
  physicalDescription: '9 files',
  workType: {
    id: 'archive-series',
    label: 'Archive series',
    type: 'WorkType',
  },
  contributors: [],
  identifiers: [
    {
      identifierType: {
        id: 'calm-record-id',
        label: 'Calm RecordIdentifier',
        type: 'IdentifierType',
      },
      value: '11afd01b-eb45-4f8c-9451-0f08778106c1',
      type: 'Identifier',
    },
    {
      identifierType: {
        id: 'calm-ref-no',
        label: 'Calm RefNo',
        type: 'IdentifierType',
      },
      value: 'PPCRI/A/1/2',
      type: 'Identifier',
    },
    {
      identifierType: {
        id: 'calm-altref-no',
        label: 'Calm AltRefNo',
        type: 'IdentifierType',
      },
      value: 'PP/CRI/A/1/2',
      type: 'Identifier',
    },
    {
      identifierType: {
        id: 'sierra-system-number',
        label: 'Sierra system number',
        type: 'IdentifierType',
      },
      value: 'b19495006',
      type: 'Identifier',
    },
  ],
  subjects: [],
  genres: [],
  items: [
    {
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
      ],
      type: 'Item',
    },
  ],
  production: [
    {
      label: '1952-1976',
      places: [],
      agents: [],
      dates: [
        {
          label: '1952-1976',
          type: 'Period',
        },
      ],
      type: 'ProductionEvent',
    },
  ],
  notes: [],
  images: [],
  parts: [
    {
      id: 'pbtyx2xx',
      title: 'Physics Research Students, Cavendish Laboratory',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/1',
      contributors: [],
      identifiers: [
        {
          identifierType: {
            id: 'calm-record-id',
            label: 'Calm RecordIdentifier',
            type: 'IdentifierType',
          },
          value: 'd946b657-d7db-44b6-b4f3-8790867c53f2',
          type: 'Identifier',
        },
      ],
      subjects: [],
      genres: [],
      items: [],
      production: [],
      notes: [],
      images: [],
      type: 'Work',
    },
    {
      id: 'ytffguzf',
      title: 'Group Portrait, Gordon Research Conference',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/2',
      contributors: [],
      identifiers: [
        {
          identifierType: {
            id: 'calm-record-id',
            label: 'Calm RecordIdentifier',
            type: 'IdentifierType',
          },
          value: '45c07068-352f-4486-83fb-0c88578d8248',
          type: 'Identifier',
        },
      ],
      subjects: [],
      genres: [],
      items: [],
      production: [],
      notes: [],
      images: [],
      type: 'Work',
    },
    {
      id: 'jhxw83wa',
      title: 'Group Portrait, Gordon Research Conference',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/3',
      contributors: [],
      identifiers: [
        {
          identifierType: {
            id: 'calm-record-id',
            label: 'Calm RecordIdentifier',
            type: 'IdentifierType',
          },
          value: 'bee458f3-816f-4bee-ae79-ca75432e7aeb',
          type: 'Identifier',
        },
      ],
      subjects: [],
      genres: [],
      items: [],
      production: [],
      notes: [],
      images: [],
      type: 'Work',
    },
    {
      id: 'te2x8hc7',
      title: 'Crick at The Weizmann Institute of Science, Rehovoth, Israel',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/4',
      contributors: [],
      identifiers: [
        {
          identifierType: {
            id: 'calm-record-id',
            label: 'Calm RecordIdentifier',
            type: 'IdentifierType',
          },
          value: 'b9f6b2ac-0e4f-42af-ae81-1a7810dbbbfc',
          type: 'Identifier',
        },
      ],
      subjects: [],
      genres: [],
      items: [],
      production: [],
      notes: [],
      images: [],
      type: 'Work',
    },
    {
      id: 'j9cmjvpb',
      title: 'Crick, Onsager, Dirac and Lamb',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/5',
      contributors: [],
      identifiers: [
        {
          identifierType: {
            id: 'calm-record-id',
            label: 'Calm RecordIdentifier',
            type: 'IdentifierType',
          },
          value: 'ef1974fb-b4ab-4db1-84c5-a37c86259908',
          type: 'Identifier',
        },
      ],
      subjects: [],
      genres: [],
      items: [],
      production: [],
      notes: [],
      images: [],
      type: 'Work',
    },
    {
      id: 'gqwjr82x',
      title: 'National Geographic Society Portrait',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/6',
      contributors: [],
      identifiers: [
        {
          identifierType: {
            id: 'calm-record-id',
            label: 'Calm RecordIdentifier',
            type: 'IdentifierType',
          },
          value: '2456f81f-87d1-407f-8343-fffa9c3c5ca9',
          type: 'Identifier',
        },
      ],
      subjects: [],
      genres: [],
      items: [],
      production: [],
      notes: [],
      images: [],
      type: 'Work',
    },
    {
      id: 'gh3ykjcx',
      title: 'Crick Lecturing (Composite Image)',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/7',
      contributors: [],
      identifiers: [
        {
          identifierType: {
            id: 'calm-record-id',
            label: 'Calm RecordIdentifier',
            type: 'IdentifierType',
          },
          value: 'c90af24d-05b4-4cf7-8a93-5951c1a62994',
          type: 'Identifier',
        },
      ],
      subjects: [],
      genres: [],
      items: [],
      production: [],
      notes: [],
      images: [],
      type: 'Work',
    },
    {
      id: 'q8z3a932',
      title: 'Wall Graffiti',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/8',
      contributors: [],
      identifiers: [
        {
          identifierType: {
            id: 'calm-record-id',
            label: 'Calm RecordIdentifier',
            type: 'IdentifierType',
          },
          value: 'c1f0a9ca-dc9c-4ff5-b91d-431ee47ea67f',
          type: 'Identifier',
        },
      ],
      subjects: [],
      genres: [],
      items: [],
      production: [],
      notes: [],
      images: [],
      type: 'Work',
    },
    {
      id: 'y5vqsvj4',
      title: 'Crick Lecturing',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/9',
      contributors: [],
      identifiers: [
        {
          identifierType: {
            id: 'calm-record-id',
            label: 'Calm RecordIdentifier',
            type: 'IdentifierType',
          },
          value: 'bde71dd2-8081-4cd8-954b-8c5267d0ab9b',
          type: 'Identifier',
        },
      ],
      subjects: [],
      genres: [],
      items: [],
      production: [],
      notes: [],
      images: [],
      type: 'Work',
    },
  ],
  partOf: [
    {
      id: 'pwbpp7gj',
      title: 'Miscellaneous Personal Items',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1',
      contributors: [],
      identifiers: [
        {
          identifierType: {
            id: 'calm-record-id',
            label: 'Calm RecordIdentifier',
            type: 'IdentifierType',
          },
          value: '8dedbf0f-3617-4edd-adf7-44a35526eb58',
          type: 'Identifier',
        },
      ],
      subjects: [],
      genres: [],
      items: [],
      production: [],
      notes: [],
      images: [],
      partOf: [
        {
          id: 'gnfmdk33',
          title: 'Personal Material',
          alternativeTitles: [],
          referenceNumber: 'PP/CRI/A',
          contributors: [],
          identifiers: [
            {
              identifierType: {
                id: 'calm-record-id',
                label: 'Calm RecordIdentifier',
                type: 'IdentifierType',
              },
              value: '6f53c141-652c-4079-bdfd-314ddfc87c1a',
              type: 'Identifier',
            },
          ],
          subjects: [],
          genres: [],
          items: [],
          production: [],
          notes: [],
          images: [],
          partOf: [
            {
              id: 'hz43r7re',
              title: 'Francis Crick (1916-2004): archives',
              alternativeTitles: [],
              referenceNumber: 'PP/CRI',
              contributors: [],
              identifiers: [
                {
                  identifierType: {
                    id: 'calm-record-id',
                    label: 'Calm RecordIdentifier',
                    type: 'IdentifierType',
                  },
                  value: '61170778-69e7-43fe-8e4a-a5ad4f8a1478',
                  type: 'Identifier',
                },
              ],
              subjects: [],
              genres: [],
              items: [],
              production: [],
              notes: [],
              images: [],
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
  precededBy: [
    {
      id: 'bqd39jxt',
      title: 'Fingerprints',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/1',
      contributors: [],
      identifiers: [
        {
          identifierType: {
            id: 'calm-record-id',
            label: 'Calm RecordIdentifier',
            type: 'IdentifierType',
          },
          value: '74e44855-53fd-4176-82bc-8071316bf8b5',
          type: 'Identifier',
        },
      ],
      subjects: [],
      genres: [],
      items: [],
      production: [],
      notes: [],
      images: [],
      type: 'Work',
    },
  ],
  succeededBy: [
    {
      id: 'mtb57a2v',
      title: 'Pension',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/3',
      contributors: [],
      identifiers: [
        {
          identifierType: {
            id: 'calm-record-id',
            label: 'Calm RecordIdentifier',
            type: 'IdentifierType',
          },
          value: '455febb1-d6d9-4540-b8b6-655c67303633',
          type: 'Identifier',
        },
      ],
      subjects: [],
      genres: [],
      items: [],
      production: [],
      notes: [],
      images: [],
      type: 'Work',
    },
    {
      id: 'vkvsg5k6',
      title: 'Miscellaneous Press Cuttings',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/4',
      contributors: [],
      identifiers: [
        {
          identifierType: {
            id: 'calm-record-id',
            label: 'Calm RecordIdentifier',
            type: 'IdentifierType',
          },
          value: '5983dedd-0bca-48ea-96d8-0b0f91f77b07',
          type: 'Identifier',
        },
      ],
      subjects: [],
      genres: [],
      items: [],
      production: [],
      notes: [],
      images: [],
      type: 'Work',
    },
    {
      id: 'amj3bhyc',
      title: 'Greetings Cards and Postcards',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/5',
      contributors: [],
      identifiers: [
        {
          identifierType: {
            id: 'calm-record-id',
            label: 'Calm RecordIdentifier',
            type: 'IdentifierType',
          },
          value: 'ab80ea98-80f5-46f2-97f2-de8c35108f18',
          type: 'Identifier',
        },
      ],
      subjects: [],
      genres: [],
      items: [],
      production: [],
      notes: [],
      images: [],
      type: 'Work',
    },
    {
      id: 'mpghw4ts',
      title: 'Family',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/6',
      contributors: [],
      identifiers: [
        {
          identifierType: {
            id: 'calm-record-id',
            label: 'Calm RecordIdentifier',
            type: 'IdentifierType',
          },
          value: '9ba79ecc-a6b3-4d85-afb0-92a834db3fc5',
          type: 'Identifier',
        },
      ],
      subjects: [],
      genres: [],
      items: [],
      production: [],
      notes: [],
      images: [],
      type: 'Work',
    },
  ],
  type: 'Work',
  '@context': 'https://api.wellcomecollection.org/catalogue/v2/context.json',
};

const workTwoResult = [
  {
    id: 'hz43r7re',
    title: 'Francis Crick (1916-2004): archives',
    alternativeTitles: [],
    referenceNumber: 'PP/CRI',
    type: 'Work',
  },
  {
    id: 'gnfmdk33',
    title: 'Personal Material',
    alternativeTitles: [],
    referenceNumber: 'PP/CRI/A',
    type: 'Work',
  },
  {
    id: 'pwbpp7gj',
    title: 'Miscellaneous Personal Items',
    alternativeTitles: [],
    referenceNumber: 'PP/CRI/A/1',
    type: 'Work',
  },
];

describe('getArchiveAncestorArray', () => {
  it('gets the ancestors of an archive work', () => {
    const archiveAncestorArray = getArchiveAncestorArray(workOne);

    expect(archiveAncestorArray).toStrictEqual(workOneResult);
  });
});
