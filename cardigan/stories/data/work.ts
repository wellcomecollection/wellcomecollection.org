import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import { ContentApiLinkedWork } from '@weco/content/services/wellcome/content/types/api';

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
  workTypeId: 'a',
  productionDates: ['1906'],
  cardLabels: [{ text: 'Books' }, { text: 'Online', labelColor: 'white' }],
  primaryContributorLabel: 'Mannel, Wilhelm, 1870-1935.',
  physicalDescription: '3 boxes',
  referenceNumber: 'B30609446',
  isRootCollection: false,
  notes: [],
  languageId: 'ger',
  archiveLabels: { reference: 'B30609446' },
};

export const contentAPILinkedWork: ContentApiLinkedWork = {
  id: 'a2239muq',
  title: 'Ueber den Krebs der Nasenhöhle ... / vorgelegt von Hermann Wolter.',
  type: 'Work',
  workType: 'Books',
  thumbnailUrl:
    'https://iiif.wellcomecollection.org/thumbs/b30598977_0001.jp2/full/!200,200/0/default.jpg',
  date: '1900',
  mainContributor: 'Wolter, Hermann (Wilhelm Victor Hermann), 1868-',
};

export const archiveCollectionWork: WorkBasic = {
  id: 'a2242545',
  title:
    'Draft manuscript notes for a seminar at the Institute de Biologie Moleculaire, Universite Paris',
  workTypeId: 'h',
  referenceNumber: 'UGC 198/8/5/8',
  productionDates: ['19 Apr 1977'],
  archiveLabels: {
    reference: 'UGC 198/8/5/8',
    partOf:
      'Papers of Guido Pellegrino Arrigo Pontecorvo, geneticist, Professor of Genetics, University of Glasgow, Scotland',
  },
  cardLabels: [
    {
      text: 'Archives and manuscripts',
    },
    {
      text: 'Online',
      labelColor: 'white',
    },
  ],
  isRootCollection: true,
  physicalDescription: '3 boxes',
  languageId: undefined,
  notes: [],
  thumbnail: undefined,
  primaryContributorLabel: undefined,
};
