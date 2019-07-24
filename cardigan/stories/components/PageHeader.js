import { storiesOf } from '@storybook/react';
import { classNames, font } from '../../../common/utils/classnames';
import PageHeader from '../../../common/views/components/PageHeader/PageHeader';
import PageHeaderStandfirst from '../../../common/views/components/PageHeaderStandfirst/PageHeaderStandfirst';
import Picture from '../../../common/views/components/Picture/Picture';
import Readme from '../../../common/views/components/PageHeader/README.md';

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
      <p
        className={classNames({
          'margin-right-6': true,
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
      </p>
    </div>
  </>
);

const pictureImages = [
  {
    contentUrl:
      'https://wellcomecollection.cdn.prismic.io/wellcomecollection/58311b341bbcab74990e2ad0917b51162452b58f_tf_190405_3790149.jpg',
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
      'https://wellcomecollection.cdn.prismic.io/wellcomecollection/17c12bebf53c50311e288f2fe8654d8400a0129a_tf_190405_3790149.jpg',
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

const PageHeaderExample = () => {
  return (
    <PageHeader
      title={'How the magician’s assistant creates the illusion'}
      breadcrumbs={{ items: breadcrumbItems }}
      labels={{ labels: [{ url: null, text: 'Essay' }] }}
      FeaturedMedia={<Picture images={pictureImages} />}
      ContentTypeInfo={ContentTypeInfo}
    />
  );
};

const stories = storiesOf('Components', module);

stories.add('PageHeader', PageHeaderExample, { readme: { sidebar: Readme } });
