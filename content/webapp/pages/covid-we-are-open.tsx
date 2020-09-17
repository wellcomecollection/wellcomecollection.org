import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { grid, classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import CovidTOC from '@weco/common/views/components/CovidTOC/CovidTOC';

const CovidWeAreOpenPage = () => {
  return (
    <PageLayout
      title={'We’re open'}
      description={`Wellcome Collection is open`}
      url={{ pathname: `/covid-we-are-open` }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType={'website'}
      siteSection={'visit-us'}
      imageUrl={null}
      imageAltText={null}
    >
      <PageHeader
        breadcrumbs={{ items: [] }}
        labels={null}
        title={'We’re open'}
        ContentTypeInfo={null}
        Background={null}
        backgroundTexture={headerBackgroundLs}
        FeaturedMedia={null}
        HeroPicture={null}
        highlightHeading={true}
      />

      <Space v={{ size: 'xl', properties: ['margin-top'] }}>
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
              <div className="body-text spaced-text">
                <p className="font-hnm font-size-3">
                  We can’t wait to welcome you back. To make your visit as safe
                  and enjoyable as possible, we’ve made a few changes. For
                  example, you will need a ticket to enter the building.
                </p>
              </div>
            </div>
          </div>

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
                v={{ size: 'xl', properties: ['margin-top', 'margin-bottom'] }}
              >
                <CovidTOC
                  links={[
                    { text: 'Book your ticket', url: '#' },
                    { text: 'Plan your visit', url: '#' },
                    { text: 'Keeping you safe', url: '#' },
                  ]}
                />
              </Space>

              <div className="body-text spaced-text">
                <h2>Plan a safe visit</h2>

                <h3>What’s open?</h3>
                <p>
                  Being Human, Reading Room and library are open, and our café
                  is serving pre-packaged food. The shop will be smaller to give
                  space for spread out café seating.
                </p>

                <h3>Opening hours</h3>
                <p>
                  Being Human, Reading Room and library are open, and our café
                  is serving pre-packaged food. The shop will be smaller to give
                  space for spread out café seating.
                </p>

                <h3>Facilities and access</h3>
                <p>
                  You’ll find accessible step-free routes to all of our
                  exhibits, with priority use of the lifts. To help everyone
                  keep their distance, you’ll only be able to share the lift
                  with people from your household or bubble.
                </p>

                <p>
                  All our toilets are open as usual. There are accessible
                  toilets on every floor and a Changing Places toilet on the
                  ground floor, all of which are regularly cleaned and
                  disinfected.
                </p>

                <p>
                  Shared accessible resources, like magnifiers and large-print
                  guides, are still available, but our team are collecting and
                  cleaning them between each use. If you’d like to use them,
                  just ask.
                </p>

                <p>
                  There might be queues from time to time, while we check
                  tickets and make sure everyone’s got plenty of space. If
                  queuing is not accessible for you, please speak to a member of
                  staff and we can make alternative arrangements with you.
                </p>

                <p>
                  <a href="#">Find out more</a>
                </p>

                <h3>Storing your belongings</h3>
                <p>
                  We won’t be operating our cloakroom, but you will be able to
                  use lockers to store belongings. Please bring as little as
                  possible. Library users will still be able to bring laptops,
                  pencils and study materials into the library in clear plastic
                  bags.
                </p>

                <p>There is a buggy drop-off near the entrance.</p>

                <p>
                  <a href="#">Find out more</a>
                </p>

                <h3>Getting here</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam
                  eaque, accusantium consequatur dolor, est ducimus molestiae
                  aperiam, repellat maxime quibusdam esse impedit quo sit
                  ratione perferendis nostrum optio deleniti iure.
                </p>

                <h3>Tours and events</h3>
                <p>
                  Medicine Man is closed and there currently aren’t any Daily
                  guided tours of exhibitions and galleries including Access or
                  Perspective Tours.
                </p>

                <p>
                  All our events are currently online.{' '}
                  <a href="#">Find out more about what’s on</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Space>
    </PageLayout>
  );
};

export default CovidWeAreOpenPage;
