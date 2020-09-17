import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { grid } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import CovidInfoBox from '@weco/common/views/components/CovidInfoBox/CovidInfoBox';
import EventbriteButton from '@weco/common/views/components/EventbriteButton/EventbriteButton';

const CovidWeAreOpenPage = () => {
  return (
    <PageLayout
      title={'Book your ticket'}
      description={`Wellcome Collection is open`}
      url={{ pathname: `/covid-book-your-ticket` }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType={'website'}
      siteSection={'visit-us'}
      imageUrl={null}
      imageAltText={null}
    >
      <PageHeader
        breadcrumbs={{ items: [] }}
        labels={null}
        title={'Book your ticket'}
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
                  To enter our building you’ll need to book a free ticket in
                  advance. Choose between two different ticket types depending
                  on whether you are visiting the museum or the library.
                </p>
              </div>
            </div>

            <Space
              v={{ size: 'xl', properties: ['margin-top', 'margin-bottom'] }}
              className={grid({
                s: 12,
                m: 12,
                l: 10,
                shiftL: 1,
                xl: 10,
                shiftXL: 1,
              })}
            >
              <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
                <CovidInfoBox
                  title={'Book your museum visit'}
                  body={
                    <>
                      <p>
                        <ul>
                          <li>Choose a time slot</li>
                          <li>Stay as long as you like</li>
                          <li>
                            You will be able to visit the Reading Room, Being
                            Human, the shop and café
                          </li>
                        </ul>
                      </p>
                      <p>
                        <a href="#more-info-about-ticket">
                          Find out more about booking your tickets
                        </a>
                      </p>
                      <EventbriteButton event={{ eventbriteId: '' }} />
                    </>
                  }
                />
              </Space>

              <CovidInfoBox
                title={'Book your museum and library visit'}
                body={
                  <>
                    <p>
                      <ul>
                        <li>Choose a time slot</li>
                        <li>Stay for up to three hours</li>
                        <li>
                          Only current library members are able to book a ticket
                        </li>
                        <li>
                          You will be able to visit the library as well as the
                          museum, including the galleries, shop and café
                        </li>
                        <li>
                          You will need to order any materials 72 hours in
                          advance
                        </li>
                      </ul>
                    </p>
                    <p>
                      <a href="#more-info-about-museum-library-ticket">
                        Find out more about booking museum and library tickets
                      </a>
                    </p>
                    <EventbriteButton event={{ eventbriteId: '' }} />
                  </>
                }
              />
            </Space>
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
              <div className="body-text spaced-text">
                <h2 id="more-info-about-ticket">
                  More information about your ticket
                </h2>

                <h3>Entering and leaving the building</h3>
                <p>
                  Please bring your ticket with you on the day – on your phone
                  is fine. You will have your ticket checked by our staff on
                  arrival. There may be queues at busy times.
                </p>

                <p>
                  Once you have left the building you cannot re-enter. This is
                  so we can manage visitor numbers and allow plenty of space for
                  social distancing.
                </p>

                <h3>Time slots</h3>
                <p>
                  You can arrive at any point during your 15-minute slot. If you
                  think you are not going to make your slot, please let us know.
                </p>

                <h3>Cancelling your ticket</h3>
                <p>
                  There are three ways to cancel your ticket:
                  <ul>
                    <li>Follow the instructions via Eventbrite </li>
                    <li>Email info@wellcomecollection.org</li>
                    <li>Call +44 (0)20 7611 2222</li>
                  </ul>
                </p>
                <p>
                  If you change your mind about the type of ticket you need
                  please cancel and rebook. Or give us a call.
                </p>

                <h3>Track and Trace</h3>
                <p>
                  We are collecting the information necessary for NHS Test and
                  Trace via our booking form. For this reason, please do not
                  give your tickets to anyone else. If you have changed your
                  mind about visiting, please cancel your booking.
                </p>

                <h3>Groups and frequent visitors</h3>
                <p>
                  You can book for up to six members of a household at a time.
                  Please only visit once per week, space is limited, and we want
                  as many people to be able to visit as possible.
                </p>

                <h2 id="more-info-about-museum-library-ticket">
                  More information about your library visit
                </h2>

                <h3>What to bring</h3>
                <p>
                  You can still bring in your laptops, study materials and
                  pencils in a clear plastic bag or carried, as normal. You can
                  leave anything else in lockers on level 0.
                </p>
                <p>
                  You will need to wear a face covering for the duration of your
                  visit.
                </p>
                <p>
                  No need to provide your own hand sanitizer - we’ll have plenty
                  available.
                </p>

                <h3>Time slots</h3>
                <p>
                  You can use the library for three hours from the start of your
                  slot – you can spend as much time as you’d like in the rest of
                  the building.
                </p>

                <h3>Ordering materials</h3>
                <p>
                  <ul>
                    <li>
                      Request up to 10 items from wellcomelibrary.org before
                      your visit
                    </li>
                    <li>
                      Place your requests 72 hours before the day of your visit
                    </li>
                    <li>
                      Once you’re finished viewing the materials, we put the
                      materials in quarantine for 72 hours. The materials cannot
                      be retrieved during their quarantine. This is to ensure
                      the safety of researchers and our staff
                    </li>
                    <li>
                      All your online requests will be delivered to the Rare
                      Materials Room. To start with, we’ll ask visitors to book
                      just one RMR slot each week
                    </li>
                  </ul>
                </p>

                <h3>Open shelves</h3>
                <p>
                  You will be able to access the open shelves, but when you are
                  finished with your book, please place on a quarantine trolley.
                </p>

                <h3>Study rooms</h3>
                <p>
                  <ul>
                    <li>
                      Accessible study room can be booked - email the library
                      before you book your ticket to make sure the room is
                      available for you on the day you want to come. We’re
                      allowing one booking per day to ensure thorough cleaning
                      before next user
                    </li>
                    <li>
                      The Group Study Room will be closed, and group working
                      desks in the Gallery will be reserved for one person only
                    </li>
                  </ul>
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
