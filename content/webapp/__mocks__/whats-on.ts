import { Exhibition } from '@weco/content/types/exhibitions';
import { Props as WhatsOnProps } from '@weco/content/views/whats-on';

const beingHuman: Exhibition = {
  id: 'XNFfsxAAANwqbNWD',
  uid: 'being-human',
  title: 'Being Human',
  untransformedBody: [],
  promo: {
    image: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/3eb4b341-6471-4610-9f12-c97f5c7be0bc_SDP_20201005_0278-81.jpg?auto=compress,format&rect=0,0,2955,1662&w=3200&h=1800',
      width: 3200,
      height: 1800,
      alt: 'Photograph of a museum gallery space with display cases and exhibits. In the foreground is a woman wearing a face covering and a pair of yellow over the ear headphones. She is in the process of plugging the headphones into the socket of an audio exhibit. To the right of her is another woman also wearing a face covering who is looking up at a transparent model of human being. In the far distance is a man, also wearing a face covering who is exploring the exhibiton.',
      tasl: {
        title: 'Being Human gallery',
        author: 'Steven Pocock',
        sourceName: 'Wellcome Collection',
        license: 'CC-BY-NC',
      },
    },
  },
  image: {
    contentUrl:
      'https://images.prismic.io/wellcomecollection/3eb4b341-6471-4610-9f12-c97f5c7be0bc_SDP_20201005_0278-81.jpg?auto=compress,format',
    width: 2955,
    height: 1662,
    alt: 'Photograph of a museum gallery space with display cases and exhibits. In the foreground is a woman wearing a face covering and a pair of yellow over the ear headphones. She is in the process of plugging the headphones into the socket of an audio exhibit. To the right of her is another woman also wearing a face covering who is looking up at a transparent model of human being. In the far distance is a man, also wearing a face covering who is exploring the exhibiton.',
    tasl: {
      title: 'Being Human gallery',
      author: 'Steven Pocock',
      sourceName: 'Wellcome Collection',
      license: 'CC-BY-NC',
    },
    simpleCrops: {
      '32:15': {
        contentUrl:
          'https://images.prismic.io/wellcomecollection/3eb4b341-6471-4610-9f12-c97f5c7be0bc_SDP_20201005_0278-81.jpg?auto=compress,format&rect=0,10,2955,1385&w=3200&h=1500',
        width: 3200,
        height: 1500,
      },
      '16:9': {
        contentUrl:
          'https://images.prismic.io/wellcomecollection/3eb4b341-6471-4610-9f12-c97f5c7be0bc_SDP_20201005_0278-81.jpg?auto=compress,format&rect=0,0,2955,1662&w=3200&h=1800',
        width: 3200,
        height: 1800,
      },
      square: {
        contentUrl:
          'https://images.prismic.io/wellcomecollection/3eb4b341-6471-4610-9f12-c97f5c7be0bc_SDP_20201005_0278-81.jpg?auto=compress,format&rect=1185,0,1662,1662&w=3200&h=3200',
        width: 3200,
        height: 3200,
      },
    },
  },
  metadataDescription: '',
  labels: [{ text: 'Permanent exhibition' }],
  type: 'exhibitions',
  shortTitle: 'Being Human',
  format: {
    id: 'Wvw6wSAAAAuy63fP',
    title: 'Permanent',
  },
  start: new Date(2019, 9, 4, 23, 0, 0),
  end: new Date(2090, 1, 1, 0, 0, 0),
  isPermanent: true,
  statusOverride: 'Closed',
  place: {
    id: 'Wn1gdSoAACgAH_-x',
    title: 'Being Human gallery',
    untransformedBody: [],
    labels: [],
    level: 1,
    information: [
      {
        type: 'paragraph',
        text: 'We’ll be in the ‘Being Human’ gallery, which you can find by taking the stairs or the lift to level 1.',
        spans: [],
      },
    ],
  },
  relatedIds: ['XYt51BAAACIAYa4e', 'XYofFREAACQAp-Vl'],
  accessResourcesPdfs: [],
  exhibits: [],
  seasons: [],
  contributors: [],
};

export const whatsOn: ({
  hasExhibitions,
}: {
  hasExhibitions: boolean;
}) => WhatsOnProps = ({ hasExhibitions }) => ({
  pageId: 'XNFfsxAAANwqbNWD',
  period: 'current-and-coming-up',
  exhibitions: hasExhibitions ? [beingHuman] : [],
  events: [],
  availableOnlineEvents: [],
  dateRange: { start: new Date(2020, 11, 5) },
  jsonLd: [],
  featuredText: undefined,
  tryTheseToo: [],
});
