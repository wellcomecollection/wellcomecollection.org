import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { grid, classNames, font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import CovidTOC from '@weco/common/views/components/CovidTOC/CovidTOC';
import CovidInfoBox from '@weco/common/views/components/CovidInfoBox/CovidInfoBox';
import Divider from '@weco/common/views/components/Divider/Divider';
import EventbriteButton from '@weco/common/views/components/EventbriteButton/EventbriteButton';
import styled from 'styled-components';

const CovidSmallPrint = styled.div.attrs({
  className: classNames({
    [font('hnl', 5)]: true,
  }),
})`
  h4 + p {
    margin-top: 0.2em;
  }
`;

const CovidH4 = styled.h4.attrs({
  className: classNames({
    [font('hnm', 5)]: true,
  }),
})``;

const CovidWeAreOpenPage = () => {
  return (
    <PageLayout
      title={'Book your ticket'}
      description={`You will need a free ticket to enter our building. Book online in advance, and choose between a museum visit and a library visit.`}
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
              v={{ size: 'xl', properties: ['margin-bottom'] }}
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
                    { text: 'Museum visit', url: '#museum-visit' },
                    {
                      text: 'Library and museum visit',
                      url: '#library-and-museum-visit',
                      sublinks: [
                        {
                          text: 'Need to know about your library visit',
                          url: '#need-to-know-about-your-library-visit',
                        },
                      ],
                    },
                    {
                      text: 'Need to know about your ticket',
                      url: '#need-to-know-about-your-ticket',
                    },
                  ]}
                />
              </Space>
              <CovidInfoBox title={'Museum visit'} id="museum-visit">
                <ul className="no-margin">
                  <li>Choose a time slot.</li>
                  <li>Stay as long as you like.</li>
                  <li>
                    You will be able to visit the Reading Room, ‘Being Human’
                    and the café. ‘Medicine Man’ will be open from 10 November.
                  </li>
                </ul>
                <EventbriteButton
                  event={{
                    eventbriteId:
                      'museum-visit-wellcome-collection-tickets-116206437583',
                  }}
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

              <CovidInfoBox
                title={'Library and museum visit'}
                id="library-and-museum-visit"
              >
                <ul className="no-margin">
                  <li>
                    Only current library members are able to book a ticket.
                  </li>
                  <li>Choose a time slot.</li>
                  <li>Stay for up to three hours.</li>
                  <li>
                    You will be able to visit the library as well as the
                    galleries and café.
                  </li>
                  <li>
                    You will need to order any materials 72 hours in advance.
                  </li>
                </ul>
                <Space v={{ size: 'm', properties: ['padding-top'] }} />
                <CovidSmallPrint>
                  <h3 id="need-to-know-about-your-library-visit">
                    Need to know about your library visit
                  </h3>
                  <CovidH4>What to bring</CovidH4>
                  <ul className="no-margin">
                    <li>Your ticket – on your phone is fine</li>

                    <li>Your library card</li>

                    <li>
                      Your face covering – this will need to be worn for the
                      duration of your visit.
                    </li>
                  </ul>
                  <p>
                    You can still bring in your laptop, study materials and
                    pencils in a clear plastic bag or carried, as normal. You
                    can leave anything else in the lockers on level 0.
                  </p>

                  <p>
                    Please note that shared computers, printers and scanners
                    won’t be available.
                  </p>

                  <CovidH4>Ordering materials</CovidH4>
                  <p>
                    All ordered material will be delivered to the Rare Materials
                    Room. In order to visit, you will need to book the ticket in
                    Eventbrite that indicates RMR access. These will be
                    available at 10.30 and 13.30 every day. Please only book if
                    you need it, as there is limited availability to allow for
                    social distancing.
                  </p>
                  <ul className="no-margin">
                    <li>
                      All your online requests will be delivered to the Rare
                      Materials Room.{' '}
                      <strong>
                        To start with, we’ll ask visitors to book just one RMR
                        slot each week
                      </strong>
                      .
                    </li>
                    <li>
                      After you’ve booked your ticket, request up to ten items
                      from wellcomelibrary.org before your visit.
                    </li>
                    <li>
                      <strong>
                        Place your request 72 hours before the day of your visit
                      </strong>
                      .
                    </li>
                    <li>
                      Once you’ve finished viewing the materials, we’ll put them
                      into quarantine for 72 hours.
                    </li>
                  </ul>

                  <CovidH4>Time slots</CovidH4>
                  <p>
                    You will be able to book library tickets up until 72 hours
                    before the start of each time slot to make sure we can
                    accommodate requests for materials.
                  </p>
                  <p>
                    You can use the library for three hours from the start of
                    your slot – you can spend as much time as you like in the
                    rest of the building.
                  </p>

                  <CovidH4>Open shelves</CovidH4>
                  <p>
                    You will be able to access the open shelves, but when you
                    have finished with your book, please place on a quarantine
                    trolley.
                  </p>

                  <CovidH4>Study rooms</CovidH4>
                  <ul className="no-margin">
                    <li>
                      The accessible study room can be booked – email the
                      library before you book your ticket to make sure the room
                      is available for you on the day you want to come. We’re
                      allowing one booking per day to ensure thorough cleaning
                      before the next user.
                    </li>
                    <li>
                      The Group Study Room will be closed, and group working
                      desks in the Gallery will be reserved for one person only.
                    </li>
                  </ul>
                  <EventbriteButton
                    event={{
                      eventbriteId:
                        'library-and-museum-visit-wellcome-collection-tickets-116213402415',
                    }}
                  />
                </CovidSmallPrint>
              </CovidInfoBox>

              <Space
                v={{
                  size: 'xl',
                  properties: ['margin-top', 'margin-bottom'],
                }}
              >
                <Divider extraClasses="divider--keyline divider--pumice" />
              </Space>
              <div className="body-text">
                <h2 id="need-to-know-about-your-ticket">
                  Need to know about your ticket
                </h2>
                <ul>
                  <li>
                    You can book for up to six members of a household at a time.
                    Please only visit once per week, as space is limited, and we
                    want as many people to be able to visit as possible.
                  </li>
                  <li>
                    <strong>
                      It’s important that you arrive during your 15-minute slot
                    </strong>{' '}
                    or we may have to ask you to book another ticket.
                  </li>
                  <li>
                    If you think you are not going to make your slot or change
                    your mind about visiting,{' '}
                    <strong>please cancel and rebook</strong>. Do not give your
                    ticket to anyone else – we are collecting information for
                    NHS Track and Trace.
                  </li>
                  <li>
                    Please bring your ticket with you, if you can – on your
                    phone is fine. You will have your ticket checked by our
                    staff on arrival.
                  </li>
                  <li>
                    <strong>
                      Once you have left the building you cannot re-enter
                    </strong>
                    . This is so we can manage visitor numbers and allow plenty
                    of space for social distancing.
                  </li>
                  <li>
                    You will be able to book museum tickets up until 30 minutes
                    before the start of each time slot.
                  </li>
                </ul>
              </div>
            </Space>
          </div>
        </div>
      </Space>
    </PageLayout>
  );
};

export default CovidWeAreOpenPage;
