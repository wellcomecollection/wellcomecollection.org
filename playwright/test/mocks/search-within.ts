export const apiResponse = {
  '@context': 'http://iiif.io/api/search/1/context.json',
  '@id': 'https://iiif.wellcomecollection.org/search/v0/b29338062?q=darwin',
  '@type': 'sc:AnnotationList',
  within: {
    '@type': 'sc:Layer',
    total: 1,
  },
  resources: [
    {
      '@id':
        'https://iiif.wellcomecollection.org/annotations/b29338062/b29338062_0005.jp2/h0r505,1666,282,45',
      '@type': 'oa:Annotation',
      motivation: 'sc:painting',
      resource: {
        '@type': 'cnt:ContentAsText',
        chars: 'DARWIN',
      },
      on: 'https://iiif.wellcomecollection.org/presentation/b29338062/canvases/b29338062_0005.jp2#xywh=505,1666,282,45',
    },
  ],
  hits: [
    {
      '@type': 'search:Hit',
      annotations: [
        'https://iiif.wellcomecollection.org/annotations/b29338062/b29338062_0005.jp2/h0r505,1666,282,45',
      ],
      match: 'DARWIN',
      before:
        'ed by the Internet Archive in 2017 with funding from Wellcome Library J \\ \\ V https://archive.org/details/b29338062 REPORT, &c. ON CHOLERA MORBUS, BY ',
      after:
        ' CHAWNER, M.D* NEWARK: PRINTED AND PUBLISHED BY S. AND C. RIDGE. SOLD BY SIMPKIN & MARSHALL, LONDON ; AND ALL OTHER BOOKSELLERS. MDCCCXXXII. fiJSTCfft',
    },
  ],
};
