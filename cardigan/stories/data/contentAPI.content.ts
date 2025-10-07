import {
  Addressable,
  Article,
} from '@weco/content/services/wellcome/content/types/api';

import { contentAPIImage } from './images';

export const contentAPIArticle: Article = {
  type: 'Article',
  id: 'Zz2g4BAAAB8AAs0L',
  uid: 'the-personal-cost-of-mental-illness',
  title: 'The personal cost of mental illness',
  caption:
    'Laura Grace Simpkins is tired of hearing how much her mental ill health costs the country. What about how much it costs her?',
  format: {
    type: 'ArticleFormat',
    id: 'W7TfJRAAAJ1D0eLK',
    label: 'Article',
  },
  publicationDate: '2024-12-11T10:00:07+0000',
  contributors: [
    {
      type: 'Contributor',
      contributor: {
        type: 'Person',
        id: 'YRpIOREAANdN3wpG',
        label: 'Laura Grace Simpkins',
      },
      role: {
        type: 'EditorialContributorRole',
        id: 'WcUWeCgAAFws-nGh',
        label: 'Author',
      },
    },
    {
      type: 'Contributor',
      contributor: {
        type: 'Person',
        id: 'Yw8WwhAAADhyTh92',
        label: 'Tanya Cooper',
      },
      role: {
        type: 'EditorialContributorRole',
        id: 'YEu7zhAAACMAX7IG',
        label: 'Artist',
      },
    },
  ],
  image: contentAPIImage,
};

export const contentAPIAddressableArticle: Addressable = {
  type: 'Article',
  id: 'ZdSMbREAACQA3j30',
  uid: 'the-stuck-tampon',
  title: 'The stuck tampon',
  description:
    'Dorothée King was on holiday when she experienced the awkward, uncomfortable and panicky situation all tampon users dread.',
  linkedWorks: [],
};

export const contentAPIAddressableEvent: Addressable = {
  type: 'Event',
  id: 'Zwmm1RAAACIARjdm',
  uid: 'hiv-and-aids-study-day',
  title: 'HIV and AIDS',
  description:
    'A study day on HIV, AIDS and public health campaigns for students aged 14 to 19.',
  format: 'Study day',
  times: {
    start: '2025-02-04T10:30:00.000Z',
    end: '2025-02-04T14:00:00.000Z',
  },
  contributors: 'Joe Bloggs',
  linkedWorks: [],
};

export const contentAPIAddressableExhibition: Addressable = {
  type: 'Exhibition',
  id: 'Yzv9ChEAABfUrkVp',
  uid: 'the-healing-pavilion',
  title: 'The Healing Pavilion',
  description:
    '‘The Healing Pavilion’ is a new art commission by British-Kenyan visual artist Grace Ndiritu, which radically reimagines what textiles and architecture can do in a museum burdened by colonial history.',
  format: 'Exhibition',
  dates: {
    start: '2022-11-24T00:00:00+0000',
    end: '2033-04-22T23:00:00+0000',
  },
  linkedWorks: [],
};
