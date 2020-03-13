const works = {
  '@context': 'https://api.wellcomecollection.org/catalogue/v2/context.json',
  type: 'ResultList',
  pageSize: 10,
  totalPages: 644,
  totalResults: 6432,
  results: [
    {
      id: 'b57yux3e',
      title: 'Test type apparatus for the detection of malingerers, France',
      alternativeTitles: [],
      description:
        'It is uncertain how this apparatus was used. It was made by a Mr Bouchart in France and consists of a black box with an eyepiece and lens at one end. It is described as a ‘test type apparatus’ for detecting malingerers and the French used it during the First World War. A ‘malingerer’ describes an individual who is work-shy or exaggerates medical symptoms for personal gain. This apparatus was probably intended to detect army recruits avoiding military duties through feigning blindness or lesser sight problems (‘ocular malingering’). \n\nDetecting malingering was vigorously pursued by the authorities on all sides of the conflict. Men we would now diagnose with post-traumatic stress disorder (PTSD) were often accused of it. They were sometimes harshly punished.\n\nmaker: Unknown maker\n\nPlace made: France',
      workType: {
        id: 'q',
        label: 'Digital Images',
        type: 'WorkType',
      },
      contributors: [
        {
          agent: {
            label: 'Science Museum, London',
            type: 'Agent',
          },
          roles: [],
          type: 'Contributor',
        },
      ],
      identifiers: [
        {
          identifierType: {
            id: 'miro-image-number',
            label: 'Miro image number',
            type: 'IdentifierType',
          },
          value: 'L0065279',
          type: 'Identifier',
        },
        {
          identifierType: {
            id: 'miro-library-reference',
            label: 'Miro library reference',
            type: 'IdentifierType',
          },
          value: 'Science Museum A606431',
          type: 'Identifier',
        },
      ],
      subjects: [
        {
          label: 'Psychological test',
          concepts: [
            {
              label: 'Psychological test',
              type: 'Concept',
            },
          ],
          type: 'Subject',
        },
      ],
      thumbnail: {
        locationType: {
          id: 'thumbnail-image',
          label: 'Thumbnail Image',
          type: 'LocationType',
        },
        url:
          'https://iiif.wellcomecollection.org/image/L0065279.jpg/full/300,/0/default.jpg',
        license: {
          id: 'cc-by',
          label: 'Attribution 4.0 International (CC BY 4.0)',
          url: 'http://creativecommons.org/licenses/by/4.0/',
          type: 'License',
        },
        accessConditions: [],
        type: 'DigitalLocation',
      },
      production: [],
      type: 'Work',
    },
  ],
  aggregations: {
    workType: {
      buckets: [],
    },
  },
  nextPage:
    'https://api.wellcomecollection.org/catalogue/v2/works?include=identifiers,production,contributors,subjects&query=test&page=2',
};

export default works;
