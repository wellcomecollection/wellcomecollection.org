// @flow
import PageLayout from '@weco/common/views/components/PageLayoutDeprecated/PageLayoutDeprecated';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { grid } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
// $FlowFixMe (tsx)
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import Picture from '@weco/common/views/components/Picture/Picture';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';

export const pictureImages = [
  {
    contentUrl:
      'https://images.prismic.io/wellcomecollection/11c076fb-f834-4f15-a565-6ac5154b4a4a_user_research.jpg?auto=compress,format',
    width: 3200,
    height: 1800,
    alt: '',
    tasl: {
      title: 'User research',
      author: 'Photo: Thomas SG Farnetti',
      sourceName: null,
      sourceLink: null,
      license: 'CC-BY-NC',
      copyrightHolder: null,
      copyrightLink: null,
    },
    crops: {},
    minWidth: '0',
  },
];

const UserPanelPage = () => {
  return (
    <PageLayout
      title={'Join our user panel'}
      description={`Get involved in shaping better website and gallery experiences for everyone. We’re looking for people to take part in online and in-person interviews, usability tests, surveys and more`}
      hideNewsletterPromo={true}
      url={{ pathname: `/user-panel` }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType={'website'}
      siteSection={'what-we-do'}
      imageUrl={null}
      imageAltText={null}
    >
      <PageHeader
        breadcrumbs={{ items: [] }}
        labels={null}
        title={'Join our user panel'}
        ContentTypeInfo={null}
        Background={
          <HeaderBackground
            hasWobblyEdge={true}
            backgroundTexture={
              'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2Fad6bc55e-5b1a-4378-9917-1653de368548_turquoise_ls.svg'
            }
          />
        }
        backgroundTexture={null}
        FeaturedMedia={<Picture isFull={true} images={pictureImages} />}
        HeroPicture={null}
        highlightHeading={true}
      />

      <Space v={{ size: 'xl', properties: ['margin-top'] }}>
        <Space
          v={{
            size: 'xl',
            properties: ['padding-bottom'],
          }}
          className={`row`}
        >
          <div className="container">
            <div className="grid">
              <div
                className={grid({
                  s: 12,
                  m: 10,
                  shiftM: 1,
                  l: 8,
                  shiftL: 2,
                  xl: 8,
                  shiftXL: 2,
                })}
              >
                <Space
                  className="body-text spaced-text"
                  v={{ size: 'l', properties: ['margin-bottom'] }}
                >
                  <p className="font-hnm font-size-3">
                    Is wellcomecollection.org working for you? Can you find the
                    information you’re looking for? Help improve our website,
                    in-venue technology and other services by answering
                    questions like these as part of our user panel.
                  </p>

                  <h2>Who can take part?</h2>
                  <p>
                    We’re looking for people who visit our exhibitions, read our
                    stories, attend our events and use our Library and
                    collections – anyone who’s interested in helping us improve
                    our services.
                  </p>
                  <p>
                    We are committed to inclusion, to improving access for all,
                    and to listening to everyone’s voice. If you are D/deaf,
                    disabled, neurodivergent, Black, Asian and/or non-white we
                    would like to understand where you experience barriers to
                    our services. We actively encourage you to take part in our
                    research, to help us provide services that work for all
                    communities.
                  </p>
                  <p>
                    You can participate from anywhere in the world, using your
                    own devices and equipment. If you use assistive technology
                    in your daily life, we’d love you to tell us how we can
                    improve our digital offer for everyone.
                  </p>
                </Space>
                <Space v={{ size: 'xl', properties: ['margin-bottom'] }}>
                  <ButtonSolidLink
                    text={'Sign up now'}
                    link={'https://airtable.com/shrGZSipOO4Yz57TT'}
                  />
                </Space>
                <div className="body-text spaced-text">
                  <h2>How does it work?</h2>
                  <p>
                    You’ll be invited to take part in online and in-person
                    interviews, usability tests, surveys and more. There is no
                    obligation to participate in every activity: we will check
                    with you first via email if you would like to opt in. For
                    some more time-intensive activities you will be remunerated.
                  </p>
                  <p>
                    We will only be using your data to contact you about
                    research participation. We use a third party provider,{' '}
                    <a href="https://airtable.com/privacy">airtable</a>, to
                    manage our user panel. For information about how we handle
                    your data, see our{' '}
                    <a href="https://wellcome.ac.uk/about-us/governance/privacy-and-terms">
                      privacy policy
                    </a>{' '}
                    .
                  </p>
                  <p>You will be able to leave the panel at any time.</p>
                </div>
              </div>
            </div>
          </div>
        </Space>
      </Space>
    </PageLayout>
  );
};

export default UserPanelPage;
