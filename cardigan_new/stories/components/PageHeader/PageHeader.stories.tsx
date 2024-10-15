import { Meta, StoryObj } from '@storybook/react';
import styled from 'styled-components';

import { ReadmeDecorator } from '@weco/cardigan_new/config/decorators';
import {
  bookImageUrl,
  florenceWinterfloodImageUrl,
  image,
} from '@weco/cardigan_new/stories/data/images';
import { EmbedSlice as RawEmbedSlice } from '@weco/common/prismicio-types';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { font } from '@weco/common/utils/classnames';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import Layout, { gridSize8 } from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import PageHeaderReadme from '@weco/common/views/components/PageHeader/README.mdx';
import ShortFilmPageHeaderReadme from '@weco/common/views/components/PageHeader/ShortFilm_README.mdx';
import PageHeaderStandfirst from '@weco/common/views/components/PageHeaderStandfirst/PageHeaderStandfirst';
import Picture from '@weco/common/views/components/Picture/Picture';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';
import Body from '@weco/content/components/Body/Body';
import BookImage from '@weco/content/components/BookImage/BookImage';
import ContentPage from '@weco/content/components/ContentPage/ContentPage';
import TextWithDot from '@weco/content/components/TextWithDot';

const meta: Meta<typeof PageHeader> = {
  title: 'Components/PageHeader',
  component: PageHeader,
  render: args => (
    <ReadmeDecorator
      WrappedComponent={PageHeader}
      args={args}
      Readme={PageHeaderReadme}
    />
  ),
  parameters: {
    chromatic: { diffThreshold: 0.2, delay: 1000 },
  },
};

export default meta;

type Story = StoryObj<typeof PageHeader>;

const Date = styled.span.attrs({ className: font('intr', 6) })`
  color: ${props => props.theme.color('neutral.600')};
`;

const breadcrumbItems = [
  {
    text: 'Stories',
    url: '#',
  },
];

const ContentTypeWrapper = styled.div`
  display: flex;
  align-items: baseline;
`;

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
    <ContentTypeWrapper>
      <Space
        className={font('intr', 6)}
        $h={{ size: 's', properties: ['margin-right'] }}
        $v={{ size: 's', properties: ['margin-top'] }}
      >
        <p style={{ marginBottom: 0 }}>
          <span>By </span>
          <span className={font('intb', 6)}>Naomi Paxton</span>{' '}
          <Date>17 April 2019</Date>
        </p>
      </Space>
    </ContentTypeWrapper>
  </>
);

const EventContentTypeInfo = () => (
  <>
    <Space
      $v={{
        size: 's',
        properties: ['margin-bottom'],
      }}
      style={{ display: 'flex', flexWrap: 'wrap' }}
    >
      Saturday 8 February 2020, 13:00 – 16:00
    </Space>
    <div style={{ display: 'flex' }}>
      <TextWithDot
        className={font('intb', 5)}
        dotColor="neutral.500"
        text="Past"
      />
    </div>
  </>
);

const ExhibitionContentTypeInfo = () => (
  <div style={{ display: 'flex' }}>
    <TextWithDot
      className={font('intb', 5)}
      dotColor="neutral.500"
      text="Closed"
    />
  </div>
);

const BookContentTypeInfo = () => (
  <p className={font('intb', 3)} style={{ marginBottom: 0 }}>
    Loneliness, Health & What Happens When We Find Connection
  </p>
);

const EventFeaturedMedia = () => (
  <PrismicImage
    image={image(florenceWinterfloodImageUrl('3200x1800'))}
    quality="low"
  />
);

export const Article: Story = {
  name: 'Article',
  args: {
    title: 'How the magician’s assistant creates the illusion',
    breadcrumbs: { items: breadcrumbItems },
    labels: { labels: [{ text: 'Article' }] },
    HeroPicture: (
      <Picture
        images={[
          image(florenceWinterfloodImageUrl('3200x1800'), 3200, 1800, {
            minWidth: '600px',
          }),
          image(florenceWinterfloodImageUrl('3200x3200'), 3200, 3200),
        ]}
        isFull={true}
      />
    ),
    ContentTypeInfo,
    isContentTypeInfoBeforeMedia: true,
  },
};

type ShortFilmStory = StoryObj<typeof ContentPage>;

export const ShortFilm: ShortFilmStory = {
  name: 'Short film',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={ContentPage}
      args={args}
      Readme={ShortFilmPageHeaderReadme}
    />
  ),
  args: {
    isCreamy: true,
    Header: (
      <PageHeader
        isContentTypeInfoBeforeMedia={true}
        ContentTypeInfo={ContentTypeInfo}
        labels={{ labels: [{ text: 'Short film' }] }}
        title="Audrey's archivist"
        breadcrumbs={{
          items: [{ text: 'Stories', url: '#' }],
        }}
      />
    ),
    Body: (
      <Body
        contentType="short-film"
        untransformedBody={[
          {
            variation: 'default',
            version: 'initial',
            items: [],
            primary: {
              embed: {
                embed_url:
                  'https://www.youtube.com/embed/l0A8-DmX0Z0?feature=oembed',
                provider_name: 'YouTube',
                provider_url: 'https://www.youtube.com/',
                title: 'Archiving Audrey Amiss',
                author_name: 'Wellcome Collection',
                author_url: 'https://www.youtube.com/@WellcomeCollection',
                type: 'video',
                height: 315,
                width: 560,
                version: '1.0',
                thumbnail_height: 360,
                thumbnail_width: 480,
                thumbnail_url:
                  'https://i.ytimg.com/vi/l0A8-DmX0Z0/hqdefault.jpg',
                html: '<iframe width="200" height="113" src="https://www.youtube.com/embed/l0A8-DmX0Z0?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen title="Archiving Audrey Amiss"></iframe>',
              },
              caption: [],
              transcript: [],
            },
            id: 'embed$b78e29a9-2dcc-4633-b923-7c01475cd647',
            slice_type: 'embed',
            slice_label: null,
          } as RawEmbedSlice,
        ]}
        pageId="test"
      />
    ),
  },
};

export const Event: Story = {
  name: 'Event',
  args: {
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
  },
};

export const Exhibition: Story = {
  name: 'Exhibition',
  args: {
    title: 'Being Human',
    breadcrumbs: { items: [{ text: 'Exhibitions', url: '#' }] },
    labels: { labels: [{ text: 'Permanent exhibition' }] },
    HeroPicture: (
      <Picture
        images={[
          image(florenceWinterfloodImageUrl('3200x1800'), 3200, 1800, {
            minWidth: '600px',
          }),
          image(florenceWinterfloodImageUrl('3200x3200'), 3200, 3200),
        ]}
        isFull={true}
      />
    ),
    ContentTypeInfo: <ExhibitionContentTypeInfo />,
    isContentTypeInfoBeforeMedia: true,
  },
};

export const List: Story = {
  name: 'List',
  args: {
    title: 'Books',
    backgroundTexture: headerBackgroundLs,
    breadcrumbs: { items: [] },
    highlightHeading: true,
    ContentTypeInfo:
      'We publish adventurous and unusual books that explore health, medicine and the complexities of the human condition.',
  },
};

export const Page: Story = {
  args: {
    title: 'Venue hire terms and conditions',
    backgroundTexture: headerBackgroundLs,
    highlightHeading: true,
    breadcrumbs: { items: [{ text: 'Get involved', url: '#' }] },
  },
};

export const Book: Story = {
  args: {
    title: 'Together',
    ContentTypeInfo: <BookContentTypeInfo />,
    isContentTypeInfoBeforeMedia: true,
    breadcrumbs: { items: [{ text: 'Books', url: '#' }] },
    FeaturedMedia: (
      <Space $v={{ size: 'xl', properties: ['margin-top', 'padding-top'] }}>
        <Layout gridSizes={gridSize8()}>
          <BookImage
            image={image(bookImageUrl, 1659, 1800)}
            sizes={{ xlarge: 1 / 3, large: 1 / 3, medium: 1 / 3, small: 1 }}
            quality="low"
          />
        </Layout>
      </Space>
    ),
  },
};
