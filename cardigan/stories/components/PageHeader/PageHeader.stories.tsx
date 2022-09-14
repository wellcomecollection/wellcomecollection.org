import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import PageHeaderStandfirst from '@weco/content/components/PageHeaderStandfirst/PageHeaderStandfirst';
import { font } from '@weco/common/utils/classnames';
import Picture from '@weco/common/views/components/Picture/Picture';
import Space from '@weco/common/views/components/styled/Space';
import Dot from '@weco/common/views/components/Dot/Dot';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import BookImage from '@weco/content/components/BookImage/BookImage';

const breadcrumbItems = [
  {
    text: 'Stories',
    url: '#',
  },
];

const ContentTypeInfo = (
  <>
    <PageHeaderStandfirst
      html={[
        {
          type: 'paragraph',
          text: 'Colluding with an audience that wants to believe, the magician’s assistant has her own armoury of tricks to help maintain the illusion. Performer Naomi Paxton takes us inside the ingenious world of onstage magic.',
          spans: [],
        },
      ]}
    />
    <div className="flex flex--h-baseline">
      <Space
        h={{ size: 's', properties: ['margin-right', 'margin-top'] }}
        className={font('intr', 6)}
      >
        <p className="no-margin">
          <span>By </span>
          <span className={font('intb', 6)}>Naomi Paxton</span>{' '}
          <span className={`${font('intr', 6)} font-pewter`}>
            17 April 2019
          </span>
        </p>
      </Space>
    </div>
  </>
);

const articlePictureImages = [
  {
    contentUrl:
      'https://images.prismic.io/wellcomecollection/58311b341bbcab74990e2ad0917b51162452b58f_tf_190405_3790149.jpg?auto=compress,format',
    width: 3200,
    height: 1800,
    alt: '',
    tasl: {
      title: "Naomi Paxton as the magician's assistant",
      author: 'Thomas SG Farnetti',
      sourceName: 'Wellcome Collection',
      sourceLink: null,
      license: 'CC-BY-NC',
      copyrightHolder: null,
      copyrightLink: null,
    },
    crops: {},
    minWidth: '600px',
  },
  {
    contentUrl:
      'https://images.prismic.io/wellcomecollection/17c12bebf53c50311e288f2fe8654d8400a0129a_tf_190405_3790149.jpg?auto=compress,format',
    width: 3200,
    height: 3200,
    alt: '',
    tasl: {
      title: "Naomi Paxton as the magician's assistant",
      author: 'Thomas SG Farnetti',
      sourceName: 'Wellcome Collection',
      sourceLink: null,
      license: 'CC-BY-NC',
      copyrightHolder: null,
      copyrightLink: null,
    },
    crops: {},
    minWidth: null,
  },
];

const exhibitionPictureImages = [
  {
    contentUrl:
      'https://images.prismic.io/wellcomecollection/b40da45c5b49cc5dd946dffeddbf8ce114ac0003_ep_000832_058.jpg?auto=compress,format',
    width: 3200,
    height: 1800,
    alt: 'Photograph of an exhibition gallery space, with a blue stained wood wall in the background, in front of which a young man looks at a life-size artwork of a figure resembling an astronaut. In the foreground a young woman sits on a wooden bench holding an audio speaker to her ear.',
    tasl: {
      title: 'Being Human gallery',
      author: 'Steven Pocock',
      sourceName: 'Wellcome Collection',
      sourceLink: null,
      license: 'CC-BY-NC',
      copyrightHolder: null,
      copyrightLink: null,
    },
    crops: {},
    minWidth: '600px',
  },
  {
    contentUrl:
      'https://images.prismic.io/wellcomecollection/2e7bcd148d629cd8fe670d42bac997051f4112ea_ep_000832_058.jpg?auto=compress,format',
    width: 3200,
    height: 3200,
    alt: 'Photograph of an exhibition gallery space, with a blue stained wood wall in the background, in front of which a young man looks at a life-size artwork of a figure resembling an astronaut. In the foreground a young woman sits on a wooden bench holding an audio speaker to her ear.',
    tasl: {
      title: 'Being Human gallery',
      author: 'Steven Pocock',
      sourceName: 'Wellcome Collection',
      sourceLink: null,
      license: 'CC-BY-NC',
      copyrightHolder: null,
      copyrightLink: null,
    },
    crops: {},
  },
];

const EventContentTypeInfo = () => (
  <>
    <Space
      v={{
        size: 's',
        properties: ['margin-bottom'],
      }}
      className="flex flex--wrap"
    >
      Saturday 8 February 2020, 13:00 – 16:00
    </Space>
    <div className="flex">
      <div className={`${font('intb', 5)} flex flex--v-center`}>
        <Space
          as="span"
          h={{ size: 'xs', properties: ['margin-right'] }}
          className="flex flex--v-center"
        >
          <Dot color="marble" />
        </Space>
        {'Past'}
      </div>
    </div>
  </>
);

const ExhibitionContentTypeInfo = () => (
  <div className="flex">
    <div className={`${font('intb', 5)} flex flex--v-center`}>
      <Space
        as="span"
        h={{ size: 'xs', properties: ['margin-right'] }}
        className="flex flex--v-center"
      >
        <Dot color="marble" />
      </Space>
      {'Closed'}
    </div>
  </div>
);

const BookContentTypeInfo = () => (
  <p className={`no-margin ${font('intb', 3)}`}>
    Loneliness, Health & What Happens When We Find Connection
  </p>
);

const eventImage = {
  contentUrl:
    'https://images.prismic.io/wellcomecollection/3f15b8e9-bad2-4018-97ec-e50121a11d56_BTG191122154226.jpg?auto=compress,format&rect=0,0,4000,2250&w=3200&h=1800',
  width: 3200,
  height: 1800,
  alt: null,
  tasl: {
    title: 'Ezra Miles',
    author: 'Benjamin Gilbert',
    sourceName: 'Wellcome Collection',
    sourceLink: null,
    license: 'CC-BY-NC',
    copyrightHolder: null,
    copyrightLink: null,
  },
  crops: {},
};

const bookImage = {
  contentUrl:
    'https://images.prismic.io/wellcomecollection/db52c5b0-d4bf-4def-b83e-14a2d7e9b42d_Together+book+cover.jpg?auto=compress,format',
  width: 1848,
  height: 2839,
  alt: 'Book cover featuring the word ‘Together’, multicoloured and in joined-up text',
  tasl: {
    title: null,
    author: null,
    sourceName: null,
    sourceLink: null,
    license: null,
    copyrightHolder: null,
    copyrightLink: null,
  },
  crops: {},
  sizesQueries: '',
};
const EventFeaturedMedia = () => (
  <PrismicImage image={eventImage} quality="low" />
);

const Template = args => <PageHeader {...args} />;

export const article = Template.bind({});
article.args = {
  title: 'How the magician’s assistant creates the illusion',
  breadcrumbs: { items: breadcrumbItems },
  labels: { labels: [{ text: 'Article' }] },
  HeroPicture: <Picture images={articlePictureImages} isFull={true} />,
  ContentTypeInfo,
  isContentTypeInfoBeforeMedia: true,
};

export const event = Template.bind({});
event.args = {
  title: 'DNA, Diversity and Difference',
  breadcrumbs: { items: [{ text: 'Events', url: '#' }] },
  FeaturedMedia: <EventFeaturedMedia />,
  ContentTypeInfo: <EventContentTypeInfo />,
  isContentTypeInfoBeforeMedia: true,
  Background: (
    <HeaderBackground
      hasWobblyEdge={true}
      backgroundTexture={headerBackgroundLs}
    />
  ),
};

export const exhibition = Template.bind({});
exhibition.args = {
  title: 'Being Human',
  breadcrumbs: { items: [{ text: 'Exhibitions', url: '#' }] },
  labels: { labels: [{ text: 'Permanent exhibition' }] },
  HeroPicture: <Picture images={exhibitionPictureImages} isFull={true} />,
  ContentTypeInfo: <ExhibitionContentTypeInfo />,
  isContentTypeInfoBeforeMedia: true,
};

export const list = Template.bind({});
list.args = {
  title: 'Books',
  backgroundTexture: headerBackgroundLs,
  breadcrumbs: { items: [] },
  highlightHeading: true,
  ContentTypeInfo:
    'We publish adventurous and unusual books that explore health, medicine and the complexities of the human condition.',
};

export const page = Template.bind({});
page.args = {
  title: 'Venue hire terms and conditions',
  backgroundTexture: headerBackgroundLs,
  highlightHeading: true,
  breadcrumbs: { items: [{ text: 'Get involved', url: '#' }] },
};

export const book = Template.bind({});
book.args = {
  title: 'Together',
  ContentTypeInfo: <BookContentTypeInfo />,
  isContentTypeInfoBeforeMedia: true,
  breadcrumbs: { items: [{ text: 'Books', url: '#' }] },
  FeaturedMedia: (
    <BookImage
      image={bookImage}
      sizes={{
        xlarge: 1 / 2,
        large: 1 / 2,
        medium: 1 / 2,
        small: 1,
      }}
      quality="low"
    />
  ),
};
