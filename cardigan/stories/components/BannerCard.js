import { storiesOf } from '@storybook/react';
import BannerCard from '../../../common/views/components/BannerCard/BannerCard';
import Readme from '../../../common/views/components/BannerCard/README.md';

const item = {
  title: 'What does it mean to be human, now?',
  type: 'seasons',
  promo: {
    caption:
      'Our new season explores the intertwined connections between the individual, societal and global health.',
    image: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection%2F92a873e4-b774-4c46-b9b3-75fda00a0ace_b0011048_artistic+interpretation+of+alzheimers_florence+winterflood.jpg?auto=compress,format&rect=0,0,1600,900&w=3200&h=1800',
      width: 3200,
      height: 1800,
      alt:
        'An artwork featuring a large painted human hand, surrounded by fragments of maps.',
      tasl: {
        title: "Alzheimer's disease",
        author: 'Florence Winterflood',
        sourceName: 'Wellcome Collection',
        sourceLink: 'CC-BY-NC',
        license: undefined,
        copyrightHolder: undefined,
        copyrightLink: undefined,
      },
      crops: {},
    },
    link: null,
  },
  promoText:
    'Our new season explores the intertwined connections between the individual, societal and global health.',
  promoImage: {
    contentUrl:
      'https://images.prismic.io/wellcomecollection%2F92a873e4-b774-4c46-b9b3-75fda00a0ace_b0011048_artistic+interpretation+of+alzheimers_florence+winterflood.jpg?auto=compress,format&rect=0,0,1600,900&w=3200&h=1800',
    width: 3200,
    height: 1800,
    alt:
      'An artwork featuring a large painted human hand, surrounded by fragments of maps.',
    tasl: {
      title: "Alzheimer's disease",
      author: 'Florence Winterflood',
      sourceName: 'Wellcome Collection',
      sourceLink: 'CC-BY-NC',
      license: undefined,
      copyrightHolder: undefined,
      copyrightLink: undefined,
    },
    crops: {},
  },
  image: {
    contentUrl:
      'https://images.prismic.io/wellcomecollection%2F92a873e4-b774-4c46-b9b3-75fda00a0ace_b0011048_artistic+interpretation+of+alzheimers_florence+winterflood.jpg?auto=compress,format',
    width: 1600,
    height: 900,
    alt:
      'An artwork featuring a large painted human hand, surrounded by fragments of maps.',
    tasl: {
      title: "Alzheimer's disease",
      author: 'Florence Winterflood',
      sourceName: 'Wellcome Collection',
      sourceLink: 'CC-BY-NC',
      license: undefined,
      copyrightHolder: undefined,
      copyrightLink: undefined,
    },
    crops: {
      '32:15': {
        contentUrl:
          'https://images.prismic.io/wellcomecollection%2F92a873e4-b774-4c46-b9b3-75fda00a0ace_b0011048_artistic+interpretation+of+alzheimers_florence+winterflood.jpg?auto=compress,format&rect=0,75,1600,750&w=3200&h=1500',
        width: 3200,
        height: 1500,
        alt:
          'An artwork featuring a large painted human hand, surrounded by fragments of maps.',
        tasl: {
          title: "Alzheimer's disease",
          author: 'Florence Winterflood',
          sourceName: 'Wellcome Collection',
          sourceLink: 'CC-BY-NC',
          license: undefined,
          copyrightHolder: undefined,
          copyrightLink: undefined,
        },
        crops: {},
      },
      '16:9': {
        contentUrl:
          'https://images.prismic.io/wellcomecollection%2F92a873e4-b774-4c46-b9b3-75fda00a0ace_b0011048_artistic+interpretation+of+alzheimers_florence+winterflood.jpg?auto=compress,format&rect=0,0,1600,900&w=3200&h=1800',
        width: 3200,
        height: 1800,
        alt:
          'An artwork featuring a large painted human hand, surrounded by fragments of maps.',
        tasl: {
          title: "Alzheimer's disease",
          author: 'Florence Winterflood',
          sourceName: 'Wellcome Collection',
          sourceLink: 'CC-BY-NC',
          license: undefined,
          copyrightHolder: undefined,
          copyrightLink: undefined,
        },
        crops: {},
      },
      square: {
        contentUrl:
          'https://images.prismic.io/wellcomecollection%2F92a873e4-b774-4c46-b9b3-75fda00a0ace_b0011048_artistic+interpretation+of+alzheimers_florence+winterflood.jpg?auto=compress,format&rect=350,0,900,900&w=3200&h=3200',
        width: 3200,
        height: 3200,
        alt:
          'An artwork featuring a large painted human hand, surrounded by fragments of maps.',
        tasl: {
          title: "Alzheimer's disease",
          author: 'Florence Winterflood',
          sourceName: 'Wellcome Collection',
          sourceLink: 'CC-BY-NC',
          license: undefined,
          copyrightHolder: undefined,
          copyrightLink: undefined,
        },
        crops: {},
      },
    },
  },
  squareImage: {
    contentUrl:
      'https://images.prismic.io/wellcomecollection%2F92a873e4-b774-4c46-b9b3-75fda00a0ace_b0011048_artistic+interpretation+of+alzheimers_florence+winterflood.jpg?auto=compress,format&rect=350,0,900,900&w=3200&h=3200',
    width: 3200,
    height: 3200,
    alt:
      'An artwork featuring a large painted human hand, surrounded by fragments of maps.',
    tasl: {
      title: "Alzheimer's disease",
      author: 'Florence Winterflood',
      sourceName: 'Wellcome Collection',
      sourceLink: 'CC-BY-NC',
      license: undefined,
      copyrightHolder: undefined,
      copyrightLink: undefined,
    },
    crops: {},
  },
  widescreenImage: {
    contentUrl:
      'https://images.prismic.io/wellcomecollection%2F92a873e4-b774-4c46-b9b3-75fda00a0ace_b0011048_artistic+interpretation+of+alzheimers_florence+winterflood.jpg?auto=compress,format&rect=0,0,1600,900&w=3200&h=1800',
    width: 3200,
    height: 1800,
    alt:
      'An artwork featuring a large painted human hand, surrounded by fragments of maps.',
    tasl: {
      title: "Alzheimer's disease",
      author: 'Florence Winterflood',
      sourceName: 'Wellcome Collection',
      sourceLink: 'CC-BY-NC',
      license: undefined,
      copyrightHolder: undefined,
      copyrightLink: undefined,
    },
    crops: {},
  },
};

const BannerCardExample = () => <BannerCard item={item} />;
const stories = storiesOf('Components', module);
stories.add('BannerCard', BannerCardExample, { readme: { sidebar: Readme } });
