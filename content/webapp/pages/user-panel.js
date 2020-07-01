// @flow
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { grid } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import Picture from '@weco/common/views/components/Picture/Picture';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';

export const pictureImages = [
  {
    contentUrl:
      'https://images.prismic.io/wellcomecollection/cd75bce1-6035-4430-85be-bc3b461851c7_user_panel.jpg?auto=compress,format',
    width: 3200,
    height: 1800,
    alt: '',
    tasl: {
      title: 'User research',
      author: 'David McCormick',
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
      description={'Sign up for news and information from Wellcome Collection'}
      hideNewsletterPromo={false}
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
                    Is wellcomecollection.org working for you?
                  </p>
                  <p>
                    {`Are you able to find the information you are looking for?
                    Help improve our website, in-venue technology, and other
                    services by answering questions like these as part of our
                    user panel.`}
                  </p>
                  <h2>Who can take part?</h2>
                  <p>
                    {`We're looking for people who visit our exhibitions, read our
                    stories, attend our events and use our library and
                    collections - anyone who's interested in helping improve
                    Wellcome Collection's services for everyone.`}
                  </p>
                  <p>
                    {`We're on a mission to improve access for all, so if you
                    experience barriers to our services we'd especially love to
                    talk to you.`}
                  </p>
                  <p>
                    {`You can participate from anywhere in the world, using your
                    own devices and equipment. If you use assistive technology
                    in your daily life, we'd love to talk to you about how we
                    can improve our digital offer for everyone.`}
                  </p>
                </Space>
                <Space v={{ size: 'xl', properties: ['margin-bottom'] }}>
                  <ButtonSolidLink
                    text={'Sign up now'}
                    link={'https://wellcomecollection.org.uk'}
                  />
                </Space>
                <div className="body-text spaced-text">
                  <h2>How does it work?</h2>
                  <p>
                    {`You will be invited to take part in online and in-person
                    interviews, usability tests, surveys and more. There is no
                    obligation to participate in every activity, we will check
                    with you first via email if you would like to opt in. For
                    some more time-intensive activities you will be remunerated.`}
                  </p>
                  <p>
                    We will only be using your data to contact you about
                    research participation. See our{' '}
                    <a href="https://wellcome.ac.uk/about-us/governance/privacy-and-terms">
                      privacy policy
                    </a>{' '}
                    for more information.
                  </p>
                  <p>{`You will be able to leave the panel at any time.`}</p>
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
