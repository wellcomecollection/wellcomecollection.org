import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import { ContentAPILinkedWork } from '@weco/content/views/pages/stories/story/tempMockData';

export const workBasic: WorkBasic = {
  id: 'c55smg5w',
  title:
    'Ein Fall von Haemangioendothelioma perivasculare nasi ... / vorgelegt von Wilhelm Mannel.',
  thumbnail: {
    url: 'https://iiif.wellcomecollection.org/thumbs/b30609446_0001.jp2/full/!200,200/0/default.jpg',
    license: {
      id: 'inc',
      label: 'In copyright',
      url: 'http://rightsstatements.org/vocab/InC/1.0/',
      type: 'License',
    },
    accessConditions: [],
    locationType: {
      id: 'thumbnail-image',
      label: 'Thumbnail image',
      type: 'LocationType',
    },
    type: 'DigitalLocation',
  },
  productionDates: ['1906'],
  cardLabels: [{ text: 'Books' }, { text: 'Online', labelColor: 'white' }],
  primaryContributorLabel: 'Mannel, Wilhelm, 1870-1935.',
  referenceNumber: 'B30609446',
  notes: [],
  languageId: 'ger',
  archiveLabels: { reference: 'B30609446' },
};

export const contentAPILinkedWork: ContentAPILinkedWork = {
  id: 'a2239muq',
  title: 'Ueber den Krebs der Nasenhöhle ... / vorgelegt von Hermann Wolter.',
  type: 'Work',
  thumbnailUrl:
    'https://iiif.wellcomecollection.org/thumbs/b30598977_0001.jp2/full/!200,200/0/default.jpg',
  date: '1900',
  mainContributor: 'Wolter, Hermann (Wilhelm Victor Hermann), 1868-',
  labels: [{ text: 'Books' }, { text: 'Online' }],
};
