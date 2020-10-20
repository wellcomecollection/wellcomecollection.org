import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { grid } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import CovidTOC from '@weco/common/views/components/CovidTOC/CovidTOC';
import CovidSafetyMeasure from '@weco/common/views/components/CovidSafetyMeasure/CovidSafetyMeasure';
import CovidInfoBox from '@weco/common/views/components/CovidInfoBox/CovidInfoBox';
import Divider from '@weco/common/views/components/Divider/Divider';
import { UiImage } from '@weco/common/views/components/Images/Images';
import {
  WeAreGoodToGo,
  CovidIconsEnum,
} from '@weco/common/views/components/CovidIcons/CovidIcons';
import ButtonOutlinedLink from '@weco/common/views/components/ButtonOutlinedLink/ButtonOutlinedLink';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';

const CovidWelcomeBackPage = () => {
  return (
    <PageLayout
      title={'Welcome back'}
      description={`We are open again from 7 October. You will need a free ticket to enter our building, and we have made some changes for your protection.`}
      url={{ pathname: `/covid-welcome-back` }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType={'website'}
      siteSection={'visit-us'}
      imageUrl={
        'https://images.prismic.io/wellcomecollection/c6602161-a15d-4af1-b502-bc11ac23a752_SDP_20201005_0278-177.jpg?auto=compress,format'
      }
      imageAltText={null}
    >
      <PageHeader
        breadcrumbs={{ items: [] }}
        labels={null}
        title={'Welcome back'}
        ContentTypeInfo={null}
        Background={
          <HeaderBackground
            hasWobblyEdge={true}
            backgroundTexture={headerBackgroundLs}
          />
        }
        backgroundTexture={null}
        FeaturedMedia={
          <UiImage
            {...{
              contentUrl:
                'https://images.prismic.io/wellcomecollection/c6602161-a15d-4af1-b502-bc11ac23a752_SDP_20201005_0278-177.jpg?auto=compress,format',
              width: 3200,
              height: 1800,
              alt: null,
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
            }}
          />
        }
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
                  We can’t wait to welcome you back from 7 October. To make your
                  visit as safe and enjoyable as possible, we’ve made a few
                  changes. You will need a ticket to enter the building.
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
                    { text: 'Book your ticket', url: '#book-your-ticket' },
                    { text: 'Plan your visit', url: '#plan-your-visit' },
                    { text: 'Keeping you safe', url: '#keeping-you-safe' },
                  ]}
                />
              </Space>

              <div className="body-text spaced-text">
                <CovidInfoBox title={'Book your ticket'} id="book-your-ticket">
                  <ul className="no-margin">
                    <li>
                      It’s still free to visit our museum and library. You’ll
                      just need to choose a time slot and book a ticket before
                      you arrive.
                    </li>
                    <li>
                      You can explore the museum for as long as you’d like, but
                      library sessions are now limited to either a morning or an
                      afternoon. Library tickets include museum entry too.
                    </li>
                  </ul>
                  <ButtonOutlinedLink
                    icon="arrow"
                    text="Book your ticket"
                    link="/covid-book-your-ticket"
                  />
                </CovidInfoBox>

                <Space
                  v={{
                    size: 'xl',
                    properties: ['margin-top', 'margin-bottom'],
                  }}
                >
                  <Divider extraClasses="divider--keyline divider--pumice" />
                </Space>

                <h2 id="plan-your-visit">Plan your visit</h2>

                <h3>What’s open?</h3>
                <ul>
                  <li>
                    ‘<a href="/exhibitions/XNFfsxAAANwqbNWD">Being Human</a>’
                    permanent gallery, the Reading Room, café, and library are
                    open from 7 October.
                  </li>
                  <li>
                    ‘<a href="/exhibitions/Weoe4SQAAKJwjcDC">Medicine Man</a>’
                    will be open from 10 November.
                  </li>
                  <li>
                    Installations ‘
                    <a href="/exhibitions/X2R1VRMAAExK3dBJ">
                      Standardized Patient
                    </a>
                    ’ and ‘<a href="/exhibitions/X2s3IBMAAHbq_CtG">The Den</a>’
                    will be open from 10 November.
                  </li>
                </ul>

                <h3>Opening hours</h3>
                <p>
                  Wellcome Collection is open Tuesday–Sunday, 10.00–17.00, and
                  until 19.00 on Thursdays.
                </p>

                <h3>Facilities and access</h3>
                <ul>
                  <li>All our toilets are open as usual.</li>
                  <li>
                    There are accessible toilets on every floor and a Changing
                    Places toilet on the ground floor.
                  </li>
                  <li>
                    You’ll find accessible step-free routes to all of our
                    exhibits, with priority use of the lifts.
                  </li>
                  <li>
                    Shared accessible resources, like magnifiers and large-print
                    guides, are still available, but our team are collecting and
                    cleaning them between each use. If you’d like to use them,
                    just ask.
                  </li>
                  <li>
                    There might be queues from time to time. If queuing is not
                    accessible for you, please speak to a member of staff and we
                    can make alternative arrangements with you.
                  </li>
                </ul>
                <p>
                  <a href="https://wellcomecollection.org/access">
                    Find out more about accessibility
                  </a>
                </p>

                <h3>Storing your belongings</h3>
                <ul>
                  <li>
                    Items larger than standard airline carry-on luggage cannot
                    be brought into the galleries.
                  </li>
                  <li>
                    You can use the lockers on level 0 to store belongings.
                  </li>
                  <li>
                    Some of the lockers are large enough for fold-up bicycles;
                    however, we won’t be able to store luggage.
                  </li>
                  <li>
                    Library users will still be able to bring laptops, pencils
                    and study materials into the library in clear plastic bags.
                  </li>
                  <li>
                    There is a buggy drop-off inside the building on arrival.
                  </li>
                </ul>
                <p>
                  <a href="https://wellcomecollection.org/pages/Wuw19yIAAK1Z3Sm0">
                    Find out more about our bringing and storing items
                  </a>
                </p>

                <h3>Getting here</h3>
                <p>
                  <strong>Please plan your journey in advance</strong>,
                  especially if you’re using public transport. Find out the best
                  way to get to us by Tube or train with{' '}
                  <a href="https://tfl.gov.uk/plan-a-journey/">
                    Transport for London’s Journey Planner.
                  </a>
                </p>

                <h3>Tours and events</h3>
                <p>
                  There currently aren’t any daily guided tours of exhibitions
                  and galleries including Access or Perspective Tours.
                </p>
                <p>
                  All our events are currently online.{' '}
                  <a href="https://wellcomecollection.org/whats-on">
                    Find out more about what’s on
                  </a>
                  .
                </p>

                <Space
                  v={{
                    size: 'xl',
                    properties: ['margin-top', 'margin-bottom'],
                  }}
                >
                  <Divider extraClasses="divider--keyline divider--pumice" />
                </Space>

                <h2 id="keeping-you-safe">Keeping you safe</h2>
                <p>
                  We’ve made a few changes to ensure you have a safe and
                  enjoyable visit.{' '}
                </p>

                <h3>What you need to do</h3>

                <CovidSafetyMeasure
                  title={'Only book for your household or bubble'}
                  description={
                    <span>
                      Please only book to attend or enter the building with people from your household or support bubble.
                    </span>
                  }
                  icon={CovidIconsEnum.houseHold}
                />

                <CovidSafetyMeasure
                  title={'Clean your hands regularly'}
                  description={
                    <span>
                      As well as our usual hand-washing facilities, you’ll find
                      hand sanitiser dispensers throughout the museum and
                      library.
                    </span>
                  }
                  icon={CovidIconsEnum.washYourHands}
                />

                <CovidSafetyMeasure
                  title={'Wear a face covering'}
                  description={
                    <span>
                      Keep your nose and mouth covered, unless you’re{' '}
                      <a href="https://www.gov.uk/government/publications/face-coverings-when-to-wear-one-and-how-to-make-your-own#when-you-do-not-need-to-wear-a-face-covering">
                        exempt
                      </a>
                      .
                    </span>
                  }
                  icon={CovidIconsEnum.wearAMask}
                />

                <CovidSafetyMeasure
                  title={'Keep your distance'}
                  description={
                    <span>
                      Please stay two metres away from people not in your
                      household or bubble.
                    </span>
                  }
                  icon={CovidIconsEnum.keepYourDistance}
                />

                <CovidSafetyMeasure
                  title={'Stay at home if you have Covid-19 symptoms'}
                  description={
                    <span>
                      If you have a temperature or any other{' '}
                      <a href="https://www.nhs.uk/conditions/coronavirus-covid-19/symptoms/">
                        Covid-19 symptoms
                      </a>
                      , please stay at home.
                    </span>
                  }
                  icon={CovidIconsEnum.stayAtHome}
                />

                <h3>How we’re keeping you safe</h3>
                <ul>
                  <li>
                    Limiting the number of visitors each day with a free
                    ticketing system.{' '}
                    <a href="https://wellcomecollection.org/covid-book-your-ticket">
                      Book your ticket
                    </a>
                    .
                  </li>
                  <li>Taking extra care with increased cleaning.</li>
                  <li>Providing hand-sanitiser dispensers.</li>
                  <li>
                    Providing our staff with personal protective equipment
                    (PPE).
                  </li>
                  <li>
                    Marking signposted routes around the building to help you
                    explore with plenty of space.
                  </li>
                  <li>Cleaning our accessible resources regularly.</li>
                  <li>
                    Spreading out café seating and serving pre-packed food.
                  </li>
                  <li>Quarantining books in the library and Reading Room.</li>
                  <li>
                    Removing shared headphones on audio exhibits. Instead you
                    will be able to use your own earphones, which have a
                    standard jack.
                  </li>
                  <li>
                    Providing optional mask-exempt badges from{' '}
                    <a href="https://www.euansguide.com/news/face-mask-exempt-badges/">
                      Euan’s Guide
                    </a>
                    .
                  </li>
                  <li>
                    Participating in NHS Track and Trace through our online
                    booking form.
                  </li>
                </ul>

                <div style={{ width: '100px' }}>
                  <WeAreGoodToGo />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Space>
    </PageLayout>
  );
};

export default CovidWelcomeBackPage;
