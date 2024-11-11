import {
  // constructHierarchy,
  transformExhibitionGuide,
} from './exhibition-guides';

const exhibitionGuidesDoc = {
  id: 'Ytk2IREAACcA--2o',
  uid: null,
  url: null,
  type: 'exhibition-guides',
  href: 'https://wellcomecollection.cdn.prismic.io/api/v2/documents/search?ref=https%3A%2F%2Fwellcomecollection.prismic.io%2Fpreviews%2FYuO9txAAACEAjTDB%3AYt_GRREAACcAGS6y%3FwebsitePreviewId%3DWUlQOSMAACMAnEL4&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22Ytk2IREAACcA--2o%22%29+%5D%5D',
  tags: [],
  first_publication_date: null,
  last_publication_date: null,
  slugs: ['-test----exhibition-guide'],
  linked_documents: [],
  lang: 'en-gb',
  alternate_languages: [],
  data: {
    title: [
      {
        type: 'heading1',
        text: '** Test ** - Exhibition guide',
        spans: [],
      },
    ],
    'related-exhibition': {
      id: 'W300HykAACgAPp9y',
      type: 'exhibitions',
      tags: [],
      lang: 'en-gb',
      slug: 'from-atoms-to-patterns',
      first_publication_date: '2018-09-25T12:12:51+0000',
      last_publication_date: '2018-09-25T12:12:51+0000',
      data: {
        promo: [
          {
            primary: {
              caption: [
                {
                  type: 'paragraph',
                  text: 'This exhibition explored the intriguing creations of the Festival Pattern Group – a unique project at the 1951 Festival of Britain involving X-ray crystallographers, designers and manufacturers. ',
                  spans: [],
                },
              ],
              image: {
                dimensions: {
                  width: 4000,
                  height: 2250,
                },
                alt: 'Photograph of the exhibition From Atoms to Patterns at Wellcome Collection.',
                copyright:
                  'From Atoms to Patterns exhibition  | Richard Hall | Wellcome Collection | | CC-BY-NC | |',
                url: 'https://images.prismic.io/wellcomecollection/19f7c256c3a6dbc0b107cf4eb79a17c4f640cf5b_c0045969.jpg?auto=compress,format',
                '16:9': {
                  dimensions: {
                    width: 3200,
                    height: 1800,
                  },
                  alt: 'Photograph of the exhibition From Atoms to Patterns at Wellcome Collection.',
                  copyright:
                    'From Atoms to Patterns exhibition  | Richard Hall | Wellcome Collection | | CC-BY-NC | |',
                  url: 'https://images.prismic.io/wellcomecollection/d05ebc48b5fdf66c5330af2c709ff99db6ca4b62_c0045969.jpg?auto=compress,format',
                },
                '32:15': {
                  dimensions: {
                    width: 3200,
                    height: 1500,
                  },
                  alt: 'Photograph of the exhibition From Atoms to Patterns at Wellcome Collection.',
                  copyright:
                    'From Atoms to Patterns exhibition  | Richard Hall | Wellcome Collection | | CC-BY-NC | |',
                  url: 'https://images.prismic.io/wellcomecollection/0b109e7132f1c731865f4f45dd05d4f4f63b1a5e_c0045969.jpg?auto=compress,format',
                },
                square: {
                  dimensions: {
                    width: 3200,
                    height: 3200,
                  },
                  alt: 'Photograph of the exhibition From Atoms to Patterns at Wellcome Collection.',
                  copyright:
                    'From Atoms to Patterns exhibition  | Richard Hall | Wellcome Collection | | CC-BY-NC | |',
                  url: 'https://images.prismic.io/wellcomecollection/a5b66ac5f0698e239e356912d9a505d2bb7c83f7_c0045969.jpg?auto=compress,format',
                },
              },
              link: null,
            },
            items: [],
            slice_type: 'editorialImage',
            slice_label: null,
          },
        ],
        title: [
          {
            type: 'heading1',
            text: 'From Atoms to Patterns',
            spans: [],
          },
        ],
      },
      link_type: 'Document',
      isBroken: false,
    },
    components: [
      {
        number: null,
        title: [
          {
            type: 'heading1',
            text: 'Introduction and orientation',
            spans: [],
          },
        ],
        tombstone: [
          {
            type: 'paragraph',
            text: 'Ravi Ravioli, 2007, ',
            spans: [],
          },
        ],
        image: {
          '32:15': {},
          '16:9': {},
          square: {},
        },
        description: [
          {
            type: 'paragraph',
            text: 'This copy will contain the description for the Introduction and orientation.',
            spans: [],
          },
        ],
        'audio-with-description': {
          link_type: 'Media',
        },
        'audio-without-description': {
          link_type: 'Media',
        },
        'bsl-video': {},
        caption: [
          {
            type: 'paragraph',
            text: 'This would be the caption for Introduction and orientation.',
            spans: [],
          },
        ],
        transcript: [
          {
            type: 'paragraph',
            text: 'This would be the transcript for Introduction and orientation.',
            spans: [],
          },
        ],
      },
      {
        number: null,
        title: [
          {
            type: 'heading1',
            text: 'Projection and Fear',
            spans: [],
          },
        ],
        tombstone: [],
        image: {
          '32:15': {},
          '16:9': {},
          square: {},
        },
        description: [
          {
            type: 'paragraph',
            text: 'This copy will contain the description for Project and Fear.',
            spans: [],
          },
        ],
        'audio-with-description': {
          link_type: 'Media',
        },
        'audio-without-description': {
          link_type: 'Media',
        },
        'bsl-video': {},
        caption: [
          {
            type: 'paragraph',
            text: 'This would be the caption for Projection and Fear.',
            spans: [],
          },
        ],
        transcript: [
          {
            type: 'paragraph',
            text: 'This would be the transcript for Projection and Fear.',
            spans: [],
          },
        ],
      },
    ],
  },
};

describe('transformExhibitionGuide', () => {
  it('sets a description on the exhibition guide from the related exhibition', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exhibition = transformExhibitionGuide(exhibitionGuidesDoc as any);

    expect(exhibition.relatedExhibition?.description).toBe(
      'This exhibition explored the intriguing creations of the Festival Pattern Group – a unique project at the 1951 Festival of Britain involving X-ray crystallographers, designers and manufacturers.'
    );
  });

  it('returns a set of components', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exhibition = transformExhibitionGuide(exhibitionGuidesDoc as any);
    expect(exhibition.components.length).toBe(2);
  });
});

// const componentsWithPartOf = [
//   {
//     title: 'Section One',
//     partOf: undefined,
//   },
//   { title: 'Stop One', partOf: 'Section One' },
//
//   { title: 'Stop Two', partOf: 'Section One' },
//   {
//     title: 'Sub Section One',
//     partOf: 'Section One',
//   },
//   { title: 'Stop Three', partOf: 'Sub Section One' },
//   { title: 'Stop Four', partOf: 'Sub Section One' },
//   {
//     title: 'Sub Sub Section One',
//     partOf: 'Sub Section One',
//   },
//   { title: 'Stop Five', partOf: 'Sub Sub Section One' },
//   { title: 'Stop Six', partOf: 'Sub Sub Section One' },
//   {
//     title: 'Sub Section Two',
//     partOf: 'Section One',
//   },
//   { title: 'Stop Seven', partOf: 'Sub Section Two' },
//   { title: 'Stop Eight', partOf: 'Section One' },
// ];
//
// const componentsWithoutPartOf = [
//   {
//     title: 'Section One',
//   },
//   { title: 'Stop One' },
//
//   { title: 'Stop Two' },
//   {
//     title: 'Sub Section One',
//   },
//   { title: 'Stop Three' },
//   { title: 'Stop Four' },
//   {
//     title: 'Sub Sub Section One',
//   },
//   { title: 'Stop Five' },
//   { title: 'Stop Six' },
//   {
//     title: 'Sub Section Two',
//   },
//   { title: 'Stop Seven' },
//   { title: 'Stop Eight' },
// ];
//
// // TODO add some more tests with different data scenarios
// describe('constructHierarchy', () => {
//   it('returns a hierachy of components, based on their partOf and title properties', () => {
//     expect(constructHierarchy(componentsWithPartOf)).toEqual([
//       {
//         title: 'Section One',
//         parts: [
//           { title: 'Stop One' },
//           { title: 'Stop Two' },
//           {
//             title: 'Sub Section One',
//             parts: [
//               { title: 'Stop Three' },
//               { title: 'Stop Four' },
//               {
//                 title: 'Sub Sub Section One',
//                 parts: [{ title: 'Stop Five' }, { title: 'Stop Six' }],
//               },
//             ],
//           },
//           {
//             title: 'Sub Section Two',
//             parts: [{ title: 'Stop Seven' }],
//           },
//           { title: 'Stop Eight' },
//         ],
//       },
//     ]);
//   });
//
//   // TODO If nothing has a partOf, at present there is no nesting, is this the expected behaviour or should we make it so that everything is nested under first component? - that might make life easier for the editors, if an exhibition has a pretty flat structure
//   it('returns a flat list, if no components have partOf data', () => {
//     expect(constructHierarchy(componentsWithoutPartOf)).toEqual([
//       {
//         title: 'Section One',
//       },
//       {
//         title: 'Stop One',
//       },
//       {
//         title: 'Stop Two',
//       },
//       {
//         title: 'Sub Section One',
//       },
//       {
//         title: 'Stop Three',
//       },
//       {
//         title: 'Stop Four',
//       },
//       {
//         title: 'Sub Sub Section One',
//       },
//       {
//         title: 'Stop Five',
//       },
//       {
//         title: 'Stop Six',
//       },
//       {
//         title: 'Sub Section Two',
//       },
//       {
//         title: 'Stop Seven',
//       },
//       {
//         title: 'Stop Eight',
//       },
//     ]);
//   });
//
//   // TODO if partOfs are out of order, the order within each level is based on the order of the original component list
// });
