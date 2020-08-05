import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs/react';
import { classNames, font } from '../../../common/utils/classnames';
import PageHeader from '../../../common/views/components/PageHeader/PageHeader';
import PageHeaderStandfirst from '../../../common/views/components/PageHeaderStandfirst/PageHeaderStandfirst';
import Picture from '../../../common/views/components/Picture/Picture';
import Readme from '../../../common/views/components/PageHeader/README.md';
import Space from '@weco/common/views/components/styled/Space';
import Dot from '@weco/common/views/components/Dot/Dot';
import { UiImage } from '@weco/common/views/components/Images/Images';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';

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
          text:
            'Colluding with an audience that wants to believe, the magician’s assistant has her own armoury of tricks to help maintain the illusion. Performer Naomi Paxton takes us inside the ingenious world of onstage magic.',
          spans: [],
        },
      ]}
    />
    <div
      className={classNames({
        flex: true,
        'flex--h-baseline': true,
      })}
    >
      <Space
        as="p"
        h={{ size: 's', properties: ['margin-right'] }}
        className={classNames({
          [font('hnl', 5)]: true,
        })}
      >
        <span>By </span>
        <span
          className={classNames({
            [font('hnm', 5)]: true,
          })}
        >
          Naomi Paxton
        </span>{' '}
        <span
          className={classNames({
            [font('hnl', 5)]: true,
            'font-pewter': true,
          })}
        >
          17 April 2019
        </span>
      </Space>
    </div>
  </>
);

const pictureImages = [
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

const EventContentTypeInfo = () => (
  <>
    <Space
      v={{
        size: 's',
        properties: ['margin-bottom'],
      }}
      className={classNames({
        'flex flex--wrap': true,
      })}
    >
      Saturday 8 February 2020, 13:00—16:00
    </Space>
    <div className="flex">
      <div className={`${font('hnm', 5)} flex flex--v-center`}>
        <Space
          as="span"
          h={{ size: 'xs', properties: ['margin-right'] }}
          className={`flex flex--v-center`}
        >
          <Dot color={'marble'} />
        </Space>
        {'Past'}
      </div>
    </div>
  </>
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

const EventFeaturedMedia = () => <UiImage {...eventImage} />;

const PageHeaderExample = () => {
  const pageType = select(
    'Page type',
    ['article', 'event', 'exhibition', 'list', 'content'],
    'article'
  );
  switch (pageType) {
    case 'article':
      return (
        <PageHeader
          title={'How the magician’s assistant creates the illusion'}
          breadcrumbs={{ items: breadcrumbItems }}
          labels={{ labels: [{ url: null, text: 'Essay' }] }}
          HeroPicture={<Picture images={pictureImages} isFull={true} />}
          ContentTypeInfo={ContentTypeInfo}
          isContentTypeInfoBeforeMedia={true}
        />
      );
    case 'event':
      return (
        <PageHeader
          title={'DNA, Diversity and Difference'}
          breadcrumbs={{ items: [{ text: 'Events', url: '#' }] }}
          FeaturedMedia={<EventFeaturedMedia />}
          ContentTypeInfo={<EventContentTypeInfo />}
          isContentTypeInfoBeforeMedia={true}
          Background={
            <HeaderBackground
              hasWobblyEdge={true}
              backgroundTexture={headerBackgroundLs}
            />
          }
        />
      );
    case 'exhibition':
      return <p>exhibition</p>;
    case 'list':
      return <p>list</p>;
    case 'content':
      return <p>content</p>;
    default:
      return <p>default</p>;
  }
};

const stories = storiesOf('Components', module);

stories.add('PageHeader', PageHeaderExample, { readme: { sidebar: Readme } });
