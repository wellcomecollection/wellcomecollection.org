const pdfManifest = {
  '@context': [
    'http://iiif.io/api/presentation/2/context.json',
    'http://wellcomelibrary.org/ld/ixif/0/context.json',
  ],
  '@id': 'https://wellcomelibrary.org/iiif/b2982347x/manifest',
  '@type': 'sc:Manifest',
  label: 'Global Health Strategy 2014 to 2019',
  metadata: [
    {
      label: 'Title',
      value: 'Global Health Strategy 2014 to 2019',
    },
    {
      label: 'Author(s)',
      value: 'Public Health England',
    },
    {
      label: 'Publication date',
      value: '2014.',
    },
    {
      label: 'Summary',
      value:
        "This document sets out PHE's approach to global health for the next 5 years, and provides a framework for its international engagement.",
    },
    {
      label: 'Attribution',
      value: 'Wellcome Collection<br/>License: OGL',
    },
    {
      label: '',
      value:
        "<a href='https://search.wellcomelibrary.org/iii/encore/record/C__Rb2982347'>View full catalogue record</a>",
    },
    {
      label: 'Full conditions of use',
      value:
        'You have permission to make copies of this work under an <a target="_top" href="http://www.nationalarchives.gov.uk/doc/open-government-licence/version/2/">Open Government license</a>.<br/><br/>This licence permits unrestricted use, distribution, and reproduction in any medium, provided the original author and source are credited. <br/><br/>Image source should be attributed as specified in the full catalogue record. If no source is given the image should be attributed to Wellcome Library.',
    },
  ],
  license:
    'http://www.nationalarchives.gov.uk/doc/open-government-licence/version/2/',
  logo: 'https://wellcomelibrary.org/assets/img/squarelogo64.png',
  related: {
    '@id': 'https://wellcomelibrary.org/item/b2982347x',
    format: 'text/html',
  },
  seeAlso: [
    {
      '@id': 'https://wellcomelibrary.org/data/b2982347x.json',
      format: 'application/json',
      profile: 'http://wellcomelibrary.org/profiles/res',
    },
    {
      '@id': 'https://wellcomelibrary.org/resource/schemaorg/b2982347x',
      format: 'application/ld+json',
      profile: 'http://iiif.io/community/profiles/discovery/schema',
    },
    {
      '@id': 'https://wellcomelibrary.org/resource/dublincore/b2982347x',
      format: 'application/ld+json',
      profile: 'http://iiif.io/community/profiles/discovery/dc',
    },
  ],
  service: [
    {
      '@context': 'http://universalviewer.io/context.json',
      '@id': 'https://wellcomelibrary.org/iiif/uiHints/b2982347x',
      profile: 'http://universalviewer.io/ui-extensions-profile',
      disableUI: ['embed'],
    },
    {
      '@context': 'http://universalviewer.io/context.json',
      '@id': 'http://wellcomelibrary.org/service/trackingLabels/b2982347x',
      profile: 'http://universalviewer.io/tracking-extensions-profile',
      trackingLabel:
        'Format: monograph, Institution: n/a, Identifier: b2982347x, Digicode: digpbd, Collection code: n/a',
    },
  ],
  mediaSequences: [
    {
      '@id': 'https://wellcomelibrary.org/iiif/b2982347x/xsequence/s0',
      '@type': 'ixif:MediaSequence',
      label: 'XSequence 0',
      elements: [
        {
          '@id':
            'https://dlcs.io/file/wellcome/1/886ad616-5d3d-4ad7-af3d-b86afcea49d4',
          '@type': 'foaf:Document',
          format: 'application/pdf',
          label: 'Global Health Strategy 2014 to 2019',
          metadata: [
            {
              label: 'pages',
              value: '0',
            },
          ],
          thumbnail:
            'https://wellcomelibrary.org/pdfthumbs/b2982347x/0/886ad616-5d3d-4ad7-af3d-b86afcea49d4.jpg',
        },
      ],
    },
  ],
  sequences: [
    {
      '@id': 'https://wellcomelibrary.org/iiif/ixif-message/sequence/seq',
      '@type': 'sc:Sequence',
      label:
        'Unsupported extension. This manifest is being used as a wrapper for non-IIIF content (e.g., audio, video) and is unfortunately incompatible with IIIF viewers.',
      compatibilityHint: 'displayIfContentUnsupported',
      canvases: [
        {
          '@id': 'https://wellcomelibrary.org/iiif/ixif-message/canvas/c1',
          '@type': 'sc:Canvas',
          label: 'Placeholder image',
          thumbnail: 'https://wellcomelibrary.orgplaceholder.jpg',
          height: 600,
          width: 600,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/ixif-message/imageanno/placeholder',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://wellcomelibrary.org/iiif/ixif-message-0/res/placeholder',
                '@type': 'dctypes:Image',
                height: 600,
                width: 600,
              },
              on: 'https://wellcomelibrary.org/iiif/ixif-message/canvas/c1',
            },
          ],
        },
      ],
    },
  ],
};

export default pdfManifest;
