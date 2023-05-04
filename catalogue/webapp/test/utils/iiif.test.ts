import { Manifest, Range } from '@iiif/presentation-3';
import {
  getAudio,
  getIIIFMetadata,
  getIIIFPresentationCredit,
  getClickThroughService,
  getVideo,
  getTransformedCanvases,
  getMultiVolumeLabel,
  groupStructures,
} from '../../utils/iiif/v3';
import {
  manifest,
  manifestWithAudioTitles,
  manifestWithTranscript,
  manifestWithClickThroughService,
  physicalDescriptionMetadataItem,
  manifestWithVideo,
  clickThroughService,
} from '@weco/common/__mocks__/iiif-manifest-v3';

const canvases = getTransformedCanvases(manifest as Manifest);
const structures = [
  {
    id: 'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0001',
    type: 'Range',
    label: {
      en: ['First'],
    },
    items: [
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0001.jp2',
      },
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0002.jp2',
      },
    ],
  },
  {
    id: 'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0002',
    type: 'Range',
    label: {
      en: ['First'],
    },
    items: [
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0003.jp2',
      },
    ],
  },
  {
    id: 'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0003',
    type: 'Range',
    label: {
      en: ['First'],
    },
    items: [
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0006.jp2',
      },
    ],
  },
  {
    id: 'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0004',
    type: 'Range',
    label: {
      en: ['Second'],
    },
    items: [
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0007.jp2',
      },
    ],
  },
  {
    id: 'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0005',
    type: 'Range',
    label: {
      en: ['Third'],
    },
    items: [
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0009.jp2',
      },
    ],
  },
  {
    id: 'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0006',
    type: 'Range',
    label: {
      en: ['Third'],
    },
    items: [
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0010.jp2',
      },
    ],
  },
];

const correctResult = [
  {
    id: 'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0001',
    type: 'Range',
    label: {
      en: ['First'],
    },
    items: [
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0001.jp2',
      },
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0002.jp2',
      },
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0003.jp2',
      },
    ],
  },
  {
    id: 'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0003',
    type: 'Range',
    label: {
      en: ['First'],
    },
    items: [
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0006.jp2',
      },
    ],
  },
  {
    id: 'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0004',
    type: 'Range',
    label: {
      en: ['Second'],
    },
    items: [
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0007.jp2',
      },
    ],
  },
  {
    id: 'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0005',
    type: 'Range',
    label: {
      en: ['Third'],
    },
    items: [
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0009.jp2',
      },
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0010.jp2',
      },
    ],
  },
];

describe('Group repetitive iiif structures', () => {
  it('groups iiifStructures with consecutive canvases and the same label', () => {
    const groupedStructures = groupStructures(
      canvases,
      structures as unknown as Range[]
    );

    expect(groupedStructures).toEqual(correctResult);
  });
});

describe('getVideo', () => {
  it('gets a video with a single "Video" in the body', () => {
    // This is based on https://iiif-test.wellcomecollection.org/presentation/b16641097
    // as retrieved 3 May 2023
    const manifest = {
      '@context': 'http://iiif.io/api/presentation/3/context.json',
      id: 'https://iiif-test.wellcomecollection.org/presentation/b16641097',
      type: 'Manifest',
      placeholderCanvas: {
        id: 'https://iiif-test.wellcomecollection.org/presentation/b16641097/canvases/poster-b16641097_0055-0000-3655-0000-0-0000-0000-0.mpg',
        type: 'Canvas',
        label: {
          en: ['Poster Image Canvas'],
        },
        width: 600,
        height: 400,
        items: [
          {
            id: 'https://iiif-test.wellcomecollection.org/presentation/b16641097/canvases/poster-b16641097_0055-0000-3655-0000-0-0000-0000-0.mpg/painting',
            type: 'AnnotationPage',
            items: [
              {
                id: 'https://iiif-test.wellcomecollection.org/presentation/b16641097/canvases/poster-b16641097_0055-0000-3655-0000-0-0000-0000-0.mpg/painting/anno',
                type: 'Annotation',
                motivation: 'painting',
                body: {
                  id: 'https://iiif-test.wellcomecollection.org/thumb/b16641097',
                  type: 'Image',
                  label: {
                    en: ['Poster Image'],
                  },
                  format: 'image/jpeg',
                },
                target:
                  'https://iiif-test.wellcomecollection.org/presentation/b16641097/canvases/poster-b16641097_0055-0000-3655-0000-0-0000-0000-0.mpg/painting',
              },
            ],
          },
        ],
      },
      items: [
        {
          id: 'https://iiif-test.wellcomecollection.org/presentation/b16641097/canvases/b16641097_0055-0000-3655-0000-0-0000-0000-0.mpg',
          type: 'Canvas',
          label: {
            none: ['-'],
          },
          width: 999,
          height: 999,
          duration: 1061,
          rendering: [
            {
              width: 720,
              height: 720,
              duration: 1061,
              id: 'https://iiif-test.wellcomecollection.org/av/b16641097_0055-0000-3655-0000-0-0000-0000-0.mpg/full/full/max/max/0/default.mp4',
              type: 'Video',
              label: {
                en: ['Video file, size: 720 x 720'],
              },
              format: 'video/mp4',
            },
          ],
          items: [
            {
              id: 'https://iiif-test.wellcomecollection.org/presentation/b16641097/canvases/b16641097_0055-0000-3655-0000-0-0000-0000-0.mpg/painting',
              type: 'AnnotationPage',
              items: [
                {
                  id: 'https://iiif-test.wellcomecollection.org/presentation/b16641097/canvases/b16641097_0055-0000-3655-0000-0-0000-0000-0.mpg/painting/anno',
                  type: 'Annotation',
                  motivation: 'painting',
                  body: {
                    width: 720,
                    height: 720,
                    duration: 1061,
                    id: 'https://iiif-test.wellcomecollection.org/av/b16641097_0055-0000-3655-0000-0-0000-0000-0.mpg/full/full/max/max/0/default.mp4',
                    type: 'Video',
                    label: {
                      en: ['Video file, size: 720 x 720'],
                    },
                    format: 'video/mp4',
                  },
                  target:
                    'https://iiif-test.wellcomecollection.org/presentation/b16641097/canvases/b16641097_0055-0000-3655-0000-0-0000-0000-0.mpg',
                },
              ],
            },
          ],
        },
      ],
    };

    const video = getVideo(manifest as any);

    expect(video).toStrictEqual({
      width: 720,
      height: 720,
      duration: 1061,
      id: 'https://iiif-test.wellcomecollection.org/av/b16641097_0055-0000-3655-0000-0-0000-0000-0.mpg/full/full/max/max/0/default.mp4',
      type: 'Video',
      label: {
        en: ['Video file, size: 720 x 720'],
      },
      format: 'video/mp4',
      thumbnail: 'https://iiif-test.wellcomecollection.org/thumb/b16641097',
      annotations: undefined,
    });
  });

  it('gets a video with multiple items as a "Choice" in the body', () => {
    // This is based on https://iiif-test.wellcomecollection.org/presentation/v3/b3223756x
    // as retrieved 4 May 2023
    const manifest = {
      '@context': 'http://iiif.io/api/presentation/3/context.json',
      id: 'https://iiif-test.wellcomecollection.org/presentation/b3223756x',
      type: 'Manifest',
      placeholderCanvas: {
        id: 'https://iiif-test.wellcomecollection.org/presentation/b3223756x/canvases/poster-b3223756x_0002.mp4',
        type: 'Canvas',
        label: {
          en: ['Poster Image Canvas'],
        },
        width: 600,
        height: 400,
        items: [
          {
            id: 'https://iiif-test.wellcomecollection.org/presentation/b3223756x/canvases/poster-b3223756x_0002.mp4/painting',
            type: 'AnnotationPage',
            items: [
              {
                id: 'https://iiif-test.wellcomecollection.org/presentation/b3223756x/canvases/poster-b3223756x_0002.mp4/painting/anno',
                type: 'Annotation',
                motivation: 'painting',
                body: {
                  id: 'https://iiif-test.wellcomecollection.org/thumb/b3223756x',
                  type: 'Image',
                  label: {
                    en: ['Poster Image'],
                  },
                  format: 'image/jpeg',
                },
                target:
                  'https://iiif-test.wellcomecollection.org/presentation/b3223756x/canvases/poster-b3223756x_0002.mp4/painting',
              },
            ],
          },
        ],
      },
      items: [
        {
          id: 'https://iiif-test.wellcomecollection.org/presentation/b3223756x/canvases/b3223756x_0002.mp4',
          type: 'Canvas',
          label: {
            none: ['-'],
          },
          width: 2048,
          height: 1536,
          duration: 239.875,
          rendering: [
            {
              width: 960,
              height: 720,
              duration: 239.875,
              id: 'https://iiif-test.wellcomecollection.org/av/b3223756x_0002.mp4/full/full/max/max/0/default.mp4',
              type: 'Video',
              label: {
                en: ['Video file, size: 960 x 720'],
              },
              format: 'video/mp4',
            },
            {
              width: 2048,
              height: 1536,
              duration: 239.875,
              id: 'https://iiif-test.wellcomecollection.org/file/b3223756x_0002.mp4',
              type: 'Video',
              label: {
                en: ['Video file, size: 2048 x 1536'],
              },
              format: 'video/mp4',
            },
          ],
          items: [
            {
              id: 'https://iiif-test.wellcomecollection.org/presentation/b3223756x/canvases/b3223756x_0002.mp4/painting',
              type: 'AnnotationPage',
              items: [
                {
                  id: 'https://iiif-test.wellcomecollection.org/presentation/b3223756x/canvases/b3223756x_0002.mp4/painting/anno',
                  type: 'Annotation',
                  motivation: 'painting',
                  body: {
                    type: 'Choice',
                    items: [
                      {
                        width: 960,
                        height: 720,
                        duration: 239.875,
                        id: 'https://iiif-test.wellcomecollection.org/av/b3223756x_0002.mp4/full/full/max/max/0/default.mp4',
                        type: 'Video',
                        label: {
                          en: ['Video file, size: 960 x 720'],
                        },
                        format: 'video/mp4',
                      },
                      {
                        width: 2048,
                        height: 1536,
                        duration: 239.875,
                        id: 'https://iiif-test.wellcomecollection.org/file/b3223756x_0002.mp4',
                        type: 'Video',
                        label: {
                          en: ['Video file, size: 2048 x 1536'],
                        },
                        format: 'video/mp4',
                      },
                    ],
                  },
                  target:
                    'https://iiif-test.wellcomecollection.org/presentation/b3223756x/canvases/b3223756x_0002.mp4',
                },
              ],
            },
          ],
        },
      ],
    };

    const video = getVideo(manifest as any);

    expect(video).toStrictEqual({
      width: 960,
      height: 720,
      duration: 239.875,
      id: 'https://iiif-test.wellcomecollection.org/av/b3223756x_0002.mp4/full/full/max/max/0/default.mp4',
      type: 'Video',
      label: {
        en: ['Video file, size: 960 x 720'],
      },
      format: 'video/mp4',
      thumbnail: 'https://iiif-test.wellcomecollection.org/thumb/b3223756x',
      annotations: undefined,
    });
  });

  it('returns a Video type from a manifest', () => {
    const video = {
      width: 720,
      height: 576,
      duration: 5623.704,
      id: 'https://iiif.wellcomecollection.org/av/b29214397_0001.mpg/full/full/max/max/0/default.mp4',
      type: 'Video',
      label: {
        en: ['MP4'],
      },
      format: 'video/mp4',
      service: [
        {
          '@id': 'https://iiif.wellcomecollection.org/auth/clickthrough',
          '@type': 'AuthCookieService1',
        },
      ],
      thumbnail: 'https://iiif.wellcomecollection.org/thumb/b29214397',
    };
    const videoFromManifest = getVideo(manifestWithVideo as Manifest);

    expect(video).toEqual(videoFromManifest);
  });
});

describe('getClickThroughService', () => {
  it('returns an clickThroughService from a Manifest', () => {
    const clickThroughServiceFromManifest = getClickThroughService(
      manifestWithClickThroughService as Manifest
    );

    expect(clickThroughServiceFromManifest).toEqual(clickThroughService);
  });
});

describe('getMultiVolumeLabel', () => {
  it('returns the appropriate label from an array', () => {
    const label1 = getMultiVolumeLabel(
      { en: ['Practica seu Lilium medicinae', 'Copy 1'] },
      'Practica seu Lilium medicinae'
    );
    const label2 = getMultiVolumeLabel(
      { en: ['Volume 1', 'The diary of Samuel Pepys'] },
      'The diary of Samuel Pepys'
    );

    expect(label1).toEqual('Copy 1');
    expect(label2).toEqual('Volume 1');
  });
});

describe('IIIF V3', () => {
  it('parses audio files and titles from a manifest', () => {
    const { sounds } = getAudio(manifestWithAudioTitles as Manifest) || {};
    expect(sounds?.length).toBe(4);
    expect(sounds?.[0].sound.id).toBe(
      'https://iiif.wellcomecollection.org/av/b3250200x_0001.wav/full/max/default.mp3'
    );
    expect(sounds?.[0].title).toBe('Tape 1, Side 1');
    expect(sounds?.[3].title).toBe('Tape 2, Side 2');
  });

  it('parses an associated audio transcript from a manifest', () => {
    const { transcript } = getAudio(manifestWithTranscript as Manifest) || {};
    expect(transcript?.id).toBe(
      'https://iiif.wellcomecollection.org/file/b2248887x_0001.pdf'
    );
  });
});

describe('getIIIFMetadata', () => {
  it('returns the correct MetadataItem from a manifest', () => {
    const metadataItem = getIIIFMetadata(
      manifestWithTranscript as Manifest,
      'Physical description'
    );
    expect(physicalDescriptionMetadataItem).toEqual(metadataItem);
  });
});

describe('getIIIFPresentationCredit', () => {
  it('returns the relevant attribution and usage information', () => {
    const credit = getIIIFPresentationCredit(
      manifestWithTranscript as Manifest
    );
    expect(credit).toEqual('Wellcome Collection');
  });
});
