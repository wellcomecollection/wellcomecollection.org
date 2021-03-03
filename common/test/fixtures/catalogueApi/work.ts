import { Work } from '../../../model/catalogue';

export const workFixture: Work = {
  id: 'cnkv77md',
  title:
    'The sun rising with a yellow condom instead of the sun; representing protection against AIDS. Colour lithograph after M. Kolvenbach and G. Meyer, 199-.',
  alternativeTitles: [],
  physicalDescription:
    '1 print : lithograph, printed in colour ; sheet 59.5 x 42 cm',
  workType: {
    id: 'k',
    label: 'Pictures',
    type: 'Format',
  },
  lettering:
    "Guten Tag. Mach's mit. Bundeszentrale für gesundheitliche Aufklärung, 51101 Köln. Konzept + Gestaltung: Marcel Kolvenbach + Guido Meyer",
  contributors: [
    {
      agent: {
        id: 'wxu569ke',
        identifiers: [
          {
            identifierType: {
              id: 'lc-names',
              label: 'Library of Congress Name authority records',
              type: 'IdentifierType',
            },
            value: 'n82019867',
            type: 'Identifier',
          },
        ],
        label: 'Bundeszentrale für Gesundheitliche Aufklärung (Germany)',
        type: 'Organisation',
      },
      roles: [],
      type: 'Contributor',
    },
    {
      agent: {
        label: 'Kolvenbach, Marcel, 1969-',
        type: 'Person',
      },
      roles: [],
      type: 'Contributor',
    },
    {
      agent: {
        label: 'Meyer, Guido.',
        type: 'Person',
      },
      roles: [],
      type: 'Contributor',
    },
  ],
  identifiers: [
    {
      identifierType: {
        id: 'sierra-system-number',
        label: 'Sierra system number',
        type: 'IdentifierType',
      },
      value: 'b16656180',
      type: 'Identifier',
    },
    {
      identifierType: {
        id: 'sierra-identifier',
        label: 'Sierra identifier',
        type: 'IdentifierType',
      },
      value: '1665618',
      type: 'Identifier',
    },
    {
      identifierType: {
        id: 'miro-image-number',
        label: 'Miro image number',
        type: 'IdentifierType',
      },
      value: 'L0053261',
      type: 'Identifier',
    },
  ],
  subjects: [
    {
      id: 'cbv723dj',
      identifiers: [
        {
          identifierType: {
            id: 'lc-subjects',
            label: 'Library of Congress Subject Headings (LCSH)',
            type: 'IdentifierType',
          },
          value: 'sh85002541',
          type: 'Identifier',
        },
      ],
      label: 'AIDS (Disease)',
      concepts: [
        {
          label: 'AIDS (Disease)',
          type: 'Concept',
        },
      ],
      type: 'Subject',
    },
    {
      id: 'tuy93y8d',
      identifiers: [
        {
          identifierType: {
            id: 'lc-subjects',
            label: 'Library of Congress Subject Headings (LCSH)',
            type: 'IdentifierType',
          },
          value: 'sh85030795',
          type: 'Identifier',
        },
      ],
      label: 'Condoms.',
      concepts: [
        {
          label: 'Condoms.',
          type: 'Concept',
        },
      ],
      type: 'Subject',
    },
    {
      id: 'tkptghw7',
      identifiers: [
        {
          identifierType: {
            id: 'lc-subjects',
            label: 'Library of Congress Subject Headings (LCSH)',
            type: 'IdentifierType',
          },
          value: 'sh85130462',
          type: 'Identifier',
        },
      ],
      label: 'Sun.',
      concepts: [
        {
          label: 'Sun.',
          type: 'Place',
        },
      ],
      type: 'Subject',
    },
    {
      id: 'nj8cp3jh',
      identifiers: [
        {
          identifierType: {
            id: 'lc-subjects',
            label: 'Library of Congress Subject Headings (LCSH)',
            type: 'IdentifierType',
          },
          value: 'n80125931',
          type: 'Identifier',
        },
      ],
      label: 'Germany.',
      concepts: [
        {
          label: 'Germany.',
          type: 'Place',
        },
      ],
      type: 'Subject',
    },
  ],
  genres: [
    {
      label: 'Posters.',
      concepts: [
        {
          label: 'Posters.',
          type: 'Concept',
        },
      ],
      type: 'Genre',
    },
    {
      label: 'Lithographs.',
      concepts: [
        {
          label: 'Lithographs.',
          type: 'Concept',
        },
      ],
      type: 'Genre',
    },
  ],
  thumbnail: {
    locationType: {
      id: 'thumbnail-image',
      label: 'Thumbnail Image',
      type: 'LocationType',
    },
    url:
      'https://iiif.wellcomecollection.org/image/L0053261.jpg/full/300,/0/default.jpg',
    license: {
      id: 'cc-by-nc',
      label: 'Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)',
      url: 'https://creativecommons.org/licenses/by-nc/4.0/',
      type: 'License',
    },
    accessConditions: [],
    type: 'DigitalLocation',
  },
  items: [
    {
      id: 'ys3ern6x',
      identifiers: [
        {
          identifierType: {
            id: 'sierra-system-number',
            label: 'Sierra system number',
            type: 'IdentifierType',
          },
          value: 'i16010176',
          type: 'Identifier',
        },
        {
          identifierType: {
            id: 'sierra-identifier',
            label: 'Sierra identifier',
            type: 'IdentifierType',
          },
          value: '1601017',
          type: 'Identifier',
        },
      ],
      locations: [
        {
          locationType: {
            id: 'sicon',
            label: 'Closed stores Iconographic',
            type: 'LocationType',
          },
          label: 'Closed stores Iconographic',
          accessConditions: [],
          type: 'PhysicalLocation',
        },
        {
          locationType: {
            id: 'iiif-presentation',
            label: 'IIIF Presentation API',
            type: 'LocationType',
          },
          url: 'https://wellcomelibrary.org/iiif/b16656180/manifest',
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
        {
          locationType: {
            id: 'iiif-image',
            label: 'IIIF Image API',
            type: 'LocationType',
          },
          url:
            'https://iiif.wellcomecollection.org/image/L0053261.jpg/info.json',
          credit: 'Wellcome Collection',
          license: {
            id: 'cc-by-nc',
            label: 'Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)',
            url: 'https://creativecommons.org/licenses/by-nc/4.0/',
            type: 'License',
          },
          accessConditions: [],
          type: 'DigitalLocation',
        },
      ],
      type: 'Item',
    },
  ],
  availableOnline: true,
  availabilities: [
    {
      id: 'in-library',
      label: 'In the library',
      type: 'Availability',
    },
    {
      id: 'online',
      label: 'Online',
      type: 'Availability',
    },
  ],
  production: [
    {
      label:
        'Köln (51101 Köln) : Bundeszentrale für Gesundheitliche Aufklärung, [between 1990 and 1999?]',
      places: [
        {
          label: 'Köln (51101 Köln)',
          type: 'Place',
        },
      ],
      agents: [
        {
          label: 'Bundeszentrale für Gesundheitliche Aufklärung',
          type: 'Agent',
        },
      ],
      dates: [
        {
          label: '[between 1990 and 1999?]',
          type: 'Period',
        },
      ],
      type: 'ProductionEvent',
    },
  ],
  languages: [
    {
      id: 'eng',
      label: 'English',
      type: 'Language',
    },
    {
      id: 'ger',
      label: 'German',
      type: 'Language',
    },
  ],
  notes: [
    {
      contents: ['Wellcome Library no. 665618i'],
      noteType: {
        id: 'cite-as-note',
        label: 'Cite-as note',
        type: 'NoteType',
      },
      type: 'Note',
    },
  ],
  images: [
    {
      id: 'y6v52b5g',
      type: 'Image',
    },
    {
      id: 'q5f9yccs',
      type: 'Image',
    },
  ],
  parts: [],
  partOf: [],
  precededBy: [],
  succeededBy: [],
  type: 'Work',
  '@context': 'https://api.wellcomecollection.org/catalogue/v2/context.json',
};

export const workWithPartOf: Work = {
  id: 'pbtyx2xx',
  title: 'Physics Research Students, Cavendish Laboratory',
  alternativeTitles: [],
  referenceNumber: 'PP/CRI/A/1/2/1',
  description:
    '<p>Group portrait of Physics Research Students, Cavendish Laboratory, Cambridge (June, 1952), with a key to individual students, including James Watson and Crick  (first row standing, sixth and seventh from the left, respectively).\n\n</p><p>The file includes a photographic facsimile.</p>',
  physicalDescription:
    '1 file Photograph (b/w, 111/2" x 9"): group portrait of Physics Research Students, Cavendish Laboratory (June, 1952).  Also, photographic facsimile of the same.',
  workType: { id: 'h', label: 'Archives and manuscripts', type: 'Format' },
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
      identifierType: { id: 'mets', label: 'METS', type: 'IdentifierType' },
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
              status: { id: 'open', label: 'Open', type: 'AccessStatus' },
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
              status: { id: 'open', label: 'Open', type: 'AccessStatus' },
              type: 'AccessCondition',
            },
          ],
          type: 'DigitalLocation',
        },
      ],
      type: 'Item',
    },
  ],
  availableOnline: true,
  availabilities: [
    {
      id: 'in-library',
      label: 'In the library',
      type: 'Availability',
    },
    {
      id: 'online',
      label: 'Online',
      type: 'Availability',
    },
  ],
  production: [
    {
      label: '1952',
      places: [],
      agents: [],
      dates: [{ label: '1952', type: 'Period' }],
      type: 'ProductionEvent',
    },
  ],
  notes: [],
  languages: [],
  images: [],
  parts: [],
  partOf: [
    {
      id: 't9d9yrsx',
      title: 'Miscellaneous Photographs',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2',
      availableOnline: false,
      availabilities: [],
      partOf: [
        {
          id: 'pwbpp7gj',
          title: 'Miscellaneous Personal Items',
          alternativeTitles: [],
          referenceNumber: 'PP/CRI/A/1',
          availableOnline: false,
          availabilities: [],
          partOf: [
            {
              id: 'gnfmdk33',
              title: 'Personal Material',
              alternativeTitles: [],
              referenceNumber: 'PP/CRI/A',
              availableOnline: false,
              availabilities: [],
              partOf: [
                {
                  id: 'hz43r7re',
                  title: 'Francis Crick (1916-2004): archives',
                  alternativeTitles: [],
                  referenceNumber: 'PP/CRI',
                  availableOnline: false,
                  availabilities: [],
                  partOf: [],
                  totalParts: 14,
                  totalDescendentParts: 2678,
                  type: 'Collection',
                },
              ],
              totalParts: 4,
              totalDescendentParts: 50,
              type: 'Section',
            },
          ],
          totalParts: 6,
          totalDescendentParts: 17,
          type: 'Section',
        },
      ],
      totalParts: 9,
      totalDescendentParts: 9,
      type: 'Series',
    },
  ],
  precededBy: [],
  succeededBy: [
    {
      id: 'ytffguzf',
      title: 'Group Portrait, Gordon Research Conference',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/2',
      availableOnline: false,
      availabilities: [],
      totalParts: 0,
      totalDescendentParts: 0,
      type: 'Work',
    },
    {
      id: 'jhxw83wa',
      title: 'Group Portrait, Gordon Research Conference',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/3',
      availableOnline: false,
      availabilities: [],
      totalParts: 0,
      totalDescendentParts: 0,
      type: 'Work',
    },
    {
      id: 'te2x8hc7',
      title: 'Crick at The Weizmann Institute of Science, Rehovoth, Israel',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/4',
      availableOnline: false,
      availabilities: [],
      totalParts: 0,
      totalDescendentParts: 0,
      type: 'Work',
    },
    {
      id: 'j9cmjvpb',
      title: 'Crick, Onsager, Dirac and Lamb',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/5',
      availableOnline: false,
      availabilities: [],
      totalParts: 0,
      totalDescendentParts: 0,
      type: 'Work',
    },
    {
      id: 'gqwjr82x',
      title: 'National Geographic Society Portrait',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/6',
      availableOnline: false,
      availabilities: [],
      totalParts: 0,
      totalDescendentParts: 0,
      type: 'Work',
    },
    {
      id: 'gh3ykjcx',
      title: 'Crick Lecturing (Composite Image)',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/7',
      availableOnline: false,
      availabilities: [],
      totalParts: 0,
      totalDescendentParts: 0,
      type: 'Work',
    },
    {
      id: 'q8z3a932',
      title: 'Wall Graffiti',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/8',
      availableOnline: false,
      availabilities: [],
      totalParts: 0,
      totalDescendentParts: 0,
      type: 'Work',
    },
    {
      id: 'y5vqsvj4',
      title: 'Crick Lecturing',
      alternativeTitles: [],
      referenceNumber: 'PP/CRI/A/1/2/9',
      availableOnline: false,
      availabilities: [],
      totalParts: 0,
      totalDescendentParts: 0,
      type: 'Work',
    },
  ],
  type: 'Work',
  '@context': 'https://api.wellcomecollection.org/catalogue/v2/context.json',
};
