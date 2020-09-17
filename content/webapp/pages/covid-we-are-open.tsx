import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { grid, classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import CovidTOC from '@weco/common/views/components/CovidTOC/CovidTOC';
import CovidSafetyMeasure from '@weco/common/views/components/CovidSafetyMeasure/CovidSafetyMeasure';
import CovidInfoBox from '@weco/common/views/components/CovidInfoBox/CovidInfoBox';
import {
  WeAreGoodToGo,
  CovidIconsEnum,
} from '@weco/common/views/components/CovidIcons/CovidIcons';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';

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
                  We can’t wait to welcome you back from 7 October. To make your
                  visit as safe and enjoyable as possible, we’ve made a few
                  changes. For example, you will need a ticket to enter the
                  building.
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
                <h2
                  id="book-your-ticket"
                  aria-hidden
                  className="visually-hidden"
                >
                  Book your ticket
                </h2>
                <CovidInfoBox
                  title={'Book your ticket'}
                  body={
                    <>
                      <p>
                        <ul>
                          <li>
                            It’s still free to visit our museum and library.
                            You’ll just need to choose a time slot and book a
                            ticket before you arrive.
                          </li>
                          <li>
                            You can explore the museum for as long as you’d
                            like, but library sessions are now limited to either
                            a morning or an afternoon. Library tickets include
                            museum entry, too.
                          </li>
                        </ul>
                      </p>
                      <ButtonSolidLink
                        icon="ticket"
                        text="Book a ticket"
                        link="/covid-book-your-ticket"
                      />
                    </>
                  }
                />

                <h2 id="plan-your-visit">Plan your visit</h2>

                <h3>What’s open?</h3>
                <p>
                  <ul>
                    <li>
                      Being Human permanent gallery, the Reading Room, café, and
                      library are open from 7 October.
                    </li>
                    <li>Medicine Man will be opening from 10 November.</li>
                    <li>
                      The shop and Wellcome Kitchen are closed to make space for
                      more café seating.
                    </li>
                  </ul>
                </p>

                <h3>Opening hours</h3>
                <p>
                  Wellcome Collection is open Tuesday-Sunday, 10-5pm, and until
                  7pm on Thursdays.
                </p>

                <h3>Facilities and access</h3>
                <p>
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
                      Shared accessible resources, like magnifiers and
                      large-print guides, are still available, but our team are
                      collecting and cleaning them between each use. If you’d
                      like to use them, just ask.
                    </li>
                    <li>
                      There might be queues from time to time. If queuing is not
                      accessible for you, please speak to a member of staff and
                      we can make alternative arrangements with you.
                    </li>
                  </ul>
                </p>

                <p>
                  <a href="#">Find out more</a>
                </p>

                <h3>Storing your belongings</h3>
                <p>
                  <ul>
                    <li>
                      You will be able to use lockers on level 0 to store
                      belongings.
                    </li>
                    <li>
                      Library users will still be able to bring laptops, pencils
                      and study materials into the library in clear plastic
                      bags.
                    </li>
                    <li>
                      Some of the lockers will be large enough for fold-up
                      bicycles, however we won’t be able to store luggage.
                    </li>
                    <li>
                      There is a buggy drop-off inside the building on arrival.{' '}
                    </li>
                  </ul>
                </p>

                <p>
                  <a href="#">Find out more</a>
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
                  and galleries including Access or Perspective Tours. All our
                  events are currently online.{' '}
                  <a href="/whats-on">Find out more about what’s on</a>.
                </p>

                <h2 id="keeping-you-safe">Keeping you safe</h2>
                <p>
                  We’ve made a few changes to ensure you have a safe and
                  enjoyable visit.{' '}
                </p>

                <h3>What you need to do</h3>

                <CovidSafetyMeasure
                  title={'Clean your hands regularly'}
                  description={
                    'As well as our usual hand-washing facilities, you’ll find hand sanitiser dispensers throughout the museum and library.'
                  }
                  icon={CovidIconsEnum.washYourHands}
                />

                <CovidSafetyMeasure
                  title={'Wear a face covering'}
                  description={
                    'Keep your nose and mouth covered, unless you’re exempt.'
                  }
                  icon={CovidIconsEnum.wearAMask}
                />

                <CovidSafetyMeasure
                  title={'Keep your distance'}
                  description={
                    'Please stay two metres away from people not in your household or bubble.'
                  }
                  icon={CovidIconsEnum.keepYourDistance}
                />

                <CovidSafetyMeasure
                  title={'Stay at home if you have Covid-19 symptoms'}
                  description={
                    'If you have a temperature or any other Covid-19 symptoms, please stay at home.'
                  }
                  icon={CovidIconsEnum.stayAtHome}
                />

                <h3>How we’re keeping you safe</h3>
                <p>
                  <ul>
                    <li>
                      Limiting the number of visitors each day with a free
                      ticketing system.{' '}
                      <a href="/covid-book-your-ticket">Book your ticket</a>
                    </li>
                    <li>Taking extra care with increased cleaning</li>
                    <li>Providing hand sanitiser dispensers</li>
                    <li>
                      Providing our staff with personal protective equipment
                      (PPE)
                    </li>
                    <li>
                      Marking signposted routes around the building to help you
                      explore with plenty of space
                    </li>
                    <li>Cleaning our accessible resources regularly</li>
                    <li>
                      Spreading out café seating and serving pre-packed food
                    </li>
                    <li>Quarantining books in the library and Reading Room</li>
                    <li>
                      Removing shared headphones on audio exhibits. Instead you
                      will be able to use your own earphones which have a
                      standard jack
                    </li>
                    <li>Providing optional mask-exempt badges</li>
                  </ul>
                </p>

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

export default CovidWeAreOpenPage;
