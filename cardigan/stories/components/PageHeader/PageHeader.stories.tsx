import { Meta } from '@storybook/react';
import { ComponentProps } from 'react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import {
  bookImageUrl,
  florenceWinterfloodImageUrl,
  image,
} from '@weco/cardigan/stories/data/images';
import { EmbedSlice as RawEmbedSlice } from '@weco/common/prismicio-types';
import {
  headerBackgroundLs,
  landingHeaderBackgroundLs,
} from '@weco/common/utils/backgrounds';
import { font } from '@weco/common/utils/classnames';
import HeaderBackground from '@weco/common/views/components/HeaderBackground';
import Layout, { gridSize8 } from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import ShortFilmPageHeaderReadme from '@weco/common/views/components/PageHeader/ShortFilm_README.mdx';
import PageHeaderStandfirst from '@weco/common/views/components/PageHeaderStandfirst';
import Picture from '@weco/common/views/components/Picture';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';
import theme from '@weco/common/views/themes/default';
import Body from '@weco/content/views/components/Body';
import ContentPage from '@weco/content/views/components/ContentPage';
import PartNumberIndicator from '@weco/content/views/components/PartNumberIndicator';
import PopoutImage from '@weco/content/views/components/PopoutImage';
import TextWithDot from '@weco/content/views/components/TextWithDot';

const meta: Meta<typeof PageHeader> = {
  title: 'Components/PageHeader',
  component: PageHeader,
  render: args => <PageHeader {...args} />,
  parameters: {
    chromatic: { diffThreshold: 0.2, delay: 1000 },
  },
  args: {
    breadcrumbs: { items: [] },
    title: '',
    isFree: false,
    isSlim: false,
    isContentTypeInfoBeforeMedia: false,
    highlightHeading: false,
    fullWidth: false,
    includeAccessibilityProvision: false,
    heroImageBgColor: 'white',
  },
  argTypes: {
    backgroundTexture: {
      name: 'Background texture',
      control: 'radio',
      mapping: {
        None: undefined,
        'Example 1': headerBackgroundLs,
        'Example 2': landingHeaderBackgroundLs,
      },
      options: ['None', 'Example 1', 'Example 2'],
    },
    isContentTypeInfoBeforeMedia: {
      control: 'boolean',
      name: 'Has content before the Featured media ("isContentTypeInfoBeforeMedia")',
    },
    isFree: { table: { disable: true } },
    highlightHeading: { table: { disable: true } },
    heroImageBgColor: { table: { disable: true } },
    title: { table: { disable: true } },
    labels: { table: { disable: true } },
    FeaturedMedia: { table: { disable: true } },
    Background: { table: { disable: true } },
    ContentTypeInfo: { table: { disable: true } },
    HeroPicture: { table: { disable: true } },
    breadcrumbs: { table: { disable: true } },
  },
};

export default meta;

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
    <div style={{ display: 'flex', alignItems: 'baseline' }}>
      <Space
        className={font('sans', -2)}
        $h={{ size: 'xs', properties: ['margin-right'] }}
        $v={{ size: 'xs', properties: ['margin-top'] }}
      >
        <p style={{ marginBottom: 0 }}>
          <span>By </span>
          <span className={font('sans-bold', -2)}>Naomi Paxton</span>{' '}
          <span
            className={font('sans', -2)}
            style={{ color: theme.color('neutral.600') }}
          >
            17 April 2019
          </span>
        </p>
      </Space>
    </div>
  </>
);

export const Article: Meta<typeof PageHeader> = {
  argTypes: {
    SerialPartNumber: {
      name: 'Part number indicator',
      control: 'radio',
      mapping: {
        None: undefined,
        'Part of series': (
          <PartNumberIndicator
            key="part-number-indicator"
            number={2}
            backgroundColor="accent.salmon"
            description="Part"
          />
        ),
      },
      options: ['None', 'Part of series'],
    },
    variant: { table: { disable: true } },
    backgroundTexture: { table: { disable: true } },
    isSlim: { table: { disable: true } },
    includeAccessibilityProvision: { table: { disable: true } },
    fullWidth: { table: { disable: true } },
  },
  args: {
    variant: 'basic',
    title: 'How the magician’s assistant creates the illusion',
    breadcrumbs: {
      items: [{ text: 'Stories', url: '#' }],
    },
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
    SerialPartNumber: 'None',
    isContentTypeInfoBeforeMedia: true,
  },
};

export const ShortFilm: Meta<typeof PageHeader> = {
  argTypes: {
    isSlim: { name: 'Is slim', control: 'boolean' },
    fullWidth: { name: 'Full width', control: 'boolean' },
    includeAccessibilityProvision: {
      name: 'Include accessibility provision',
      control: 'boolean',
    },
    variant: { table: { disable: true } },
    backgroundTexture: { table: { disable: true } },
    isContentTypeInfoBeforeMedia: { table: { disable: true } },
  },
  render: args => {
    return (
      <ReadmeDecorator
        Readme={ShortFilmPageHeaderReadme}
        WrappedComponent={() => (
          <ContentPage
            uid="123"
            id="123"
            isCreamy
            Header={
              <PageHeader
                {...args}
                variant="basic"
                isContentTypeInfoBeforeMedia={true}
                ContentTypeInfo={ContentTypeInfo}
                labels={{ labels: [{ text: 'Short film' }] }}
                title="Audrey's archivist"
                breadcrumbs={{
                  items: [{ text: 'Stories', url: '#' }],
                }}
              />
            }
            Body={
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
                        author_url:
                          'https://www.youtube.com/@WellcomeCollection',
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
                pageUid="test"
              />
            }
          ></ContentPage>
        )}
        args={args}
      />
    );
  },
};

export const Event: Meta<typeof PageHeader> = {
  argTypes: {
    variant: { table: { disable: true } },
    SerialPartNumber: { table: { disable: true } },
    backgroundTexture: { table: { disable: true } },
    isSlim: { table: { disable: true } },
    includeAccessibilityProvision: { table: { disable: true } },
    fullWidth: { table: { disable: true } },
  },
  args: {
    variant: 'basic',
    title: 'DNA, Diversity and Difference',
    breadcrumbs: { items: [{ text: 'Events', url: '#' }] },
    FeaturedMedia: (
      <PrismicImage
        image={image(florenceWinterfloodImageUrl('3200x1800'))}
        quality="low"
      />
    ),
    ContentTypeInfo: (
      <>
        <Space
          $v={{ size: 'xs', properties: ['margin-bottom'] }}
          style={{ display: 'flex', flexWrap: 'wrap' }}
        >
          Saturday 8 February 2020, 13:00 – 16:00
        </Space>
        <div style={{ display: 'flex' }}>
          <TextWithDot
            className={font('sans-bold', -1)}
            dotColor="neutral.500"
            text="Past"
          />
        </div>
      </>
    ),
    isContentTypeInfoBeforeMedia: true,
    Background: (
      <HeaderBackground
        hasWobblyEdge={true}
        backgroundTexture={headerBackgroundLs}
      />
    ),
  },
};

export const Exhibition: Meta<typeof PageHeader> = {
  argTypes: {
    includeAccessibilityProvision: {
      name: 'Include accessibility provision',
      control: 'boolean',
    },
    variant: { table: { disable: true } },
    fullWidth: { table: { disable: true } },
    SerialPartNumber: { table: { disable: true } },
    backgroundTexture: { table: { disable: true } },
    isContentTypeInfoBeforeMedia: { table: { disable: true } },
    isSlim: { table: { disable: true } },
  },
  args: {
    variant: 'basic',
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
    ContentTypeInfo: (
      <div style={{ display: 'flex' }}>
        <TextWithDot
          className={font('sans-bold', -1)}
          dotColor="neutral.500"
          text="Closed"
        />
      </div>
    ),
    isContentTypeInfoBeforeMedia: true,
    isFree: true,
    includeAccessibilityProvision: true,
    fullWidth: true,
  },
};

export const List: Meta<typeof PageHeader> = {
  argTypes: {
    variant: { table: { disable: true } },
    isSlim: { table: { disable: true } },
    SerialPartNumber: { table: { disable: true } },
    includeAccessibilityProvision: { table: { disable: true } },
    fullWidth: { table: { disable: true } },
  },
  args: {
    variant: 'basic',
    title: 'Books',
    backgroundTexture: headerBackgroundLs,
    breadcrumbs: { items: [] },
    highlightHeading: true,
    ContentTypeInfo:
      'We publish adventurous and unusual books that explore health, medicine and the complexities of the human condition.',
  },
};

type PageStory = ComponentProps<typeof PageHeader> & {
  introTextCopy?: string;
};

export const Page: Meta<PageStory> = {
  argTypes: {
    variant: {
      name: 'Variant',
      options: ['basic', 'landing'],
      control: 'select',
    },
    backgroundTexture: {
      name: 'Background texture',
      if: { arg: 'variant', eq: 'basic' },
    },
    isSlim: {
      name: 'Is slim',
      control: 'boolean',
      if: { arg: 'variant', eq: 'basic' },
    },
    introTextCopy: {
      control: 'text',
      if: { arg: 'variant', eq: 'landing' },
    },
    introText: { table: { disable: true } },
    SerialPartNumber: { table: { disable: true } },
    isContentTypeInfoBeforeMedia: { table: { disable: true } },
    includeAccessibilityProvision: { table: { disable: true } },
    fullWidth: { table: { disable: true } },
  },
  args: {
    variant: 'basic',
    title: 'Venue hire terms and conditions',
    backgroundTexture: headerBackgroundLs,
    highlightHeading: true,
    breadcrumbs: { items: [{ text: 'Get involved', url: '#' }] },
    introTextCopy: 'This is the intro text for the landing page.',
  },
  render: args => {
    const { variant } = args;

    if (variant === 'landing') {
      args.introText = [
        {
          type: 'paragraph',
          text:
            args.introTextCopy ||
            'This is the intro text for the landing page.',
          spans: [],
        },
      ];
    }

    return <PageHeader {...args} />;
  },
};

export const Book: Meta<typeof PageHeader> = {
  argTypes: {
    variant: { table: { disable: true } },
    SerialPartNumber: { table: { disable: true } },
    backgroundTexture: { table: { disable: true } },
    isSlim: { table: { disable: true } },
    includeAccessibilityProvision: { table: { disable: true } },
    fullWidth: { table: { disable: true } },
  },
  args: {
    variant: 'basic',
    title: 'Together',
    ContentTypeInfo: (
      <p className={font('sans-bold', 1)} style={{ marginBottom: 0 }}>
        Loneliness, Health & What Happens When We Find Connection
      </p>
    ),
    isContentTypeInfoBeforeMedia: true,
    breadcrumbs: { items: [{ text: 'Books', url: '#' }] },
    FeaturedMedia: (
      <Space $v={{ size: 'xl', properties: ['margin-top', 'padding-top'] }}>
        <Layout gridSizes={gridSize8()}>
          <PopoutImage
            image={image(bookImageUrl, 1659, 1800)}
            sizes={{ xlarge: 1 / 3, large: 1 / 3, medium: 1 / 3, small: 1 }}
            quality="low"
          />
        </Layout>
      </Space>
    ),
  },
};
