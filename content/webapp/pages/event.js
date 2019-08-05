// @flow
import type { Context } from 'next';
import NextLink from 'next/link';
import { Component, Fragment } from 'react';
import Prismic from 'prismic-javascript';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import Body from '@weco/common/views/components/Body/Body';
import Contributors from '@weco/common/views/components/Contributors/Contributors';
import EventSchedule from '@weco/common/views/components/EventSchedule/EventSchedule';
import Icon from '@weco/common/views/components/Icon/Icon';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import EventbriteButton from '@weco/common/views/components/EventbriteButton/EventbriteButton';
import Message from '@weco/common/views/components/Message/Message';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import InfoBox from '@weco/common/views/components/InfoBox/InfoBox';
import { UiImage } from '@weco/common/views/components/Images/Images';
import DateRange from '@weco/common/views/components/DateRange/DateRange';
import type { UiEvent } from '@weco/common/model/events';
import { font, classNames } from '@weco/common/utils/classnames';
import camelize from '@weco/common/utils/camelize';
import {
  formatDayDate,
  isTimePast,
  isDatePast,
  formatTime,
} from '@weco/common/utils/format-date';
import EventDateRange from '@weco/common/views/components/EventDateRange/EventDateRange';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { getEvent, getEvents } from '@weco/common/services/prismic/events';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { eventLd } from '@weco/common/utils/json-ld';
import { isEventFullyBooked } from '@weco/common/model/events';
import EventDatesLink from '@weco/common/views/components/EventDatesLink/EventDatesLink';
import VerticalSpace from '@weco/common/views/components/styled/VerticalSpace';

type Props = {|
  event: UiEvent,
|};

type State = {|
  scheduledIn: ?UiEvent,
|};

// TODO: Probably use the StatusIndicator?
function EventStatus(text, color) {
  return (
    <div className="flex">
      <div className={`${font('hnm', 6)} flex flex--v-center`}>
        <span className={`margin-right-6 flex flex--v-center`}>
          <Icon
            name="statusIndicator"
            extraClasses={`icon--match-text icon--${color}`}
          />
        </span>
        {text}
      </div>
    </div>
  );
}

function DateList(event) {
  return (
    event.times && (
      <Fragment>
        {event.times.map((eventTime, index) => {
          return (
            <VerticalSpace
              size="m"
              properties={['padding-top', 'padding-bottom']}
              key={index}
              className={`flex flex--h-space-between border-top-width-1 border-color-pumice`}
            >
              <div
                className={`${
                  isDatePast(eventTime.range.endDateTime) ? 'font-pewter' : ''
                } flex-1`}
              >
                <DateRange
                  start={eventTime.range.startDateTime}
                  end={eventTime.range.endDateTime}
                />
              </div>

              {isDatePast(eventTime.range.endDateTime) ? (
                <Fragment>{EventStatus('Past', 'marble')}</Fragment>
              ) : eventTime.isFullyBooked ? (
                EventStatus('Full', 'red')
              ) : null}
            </VerticalSpace>
          );
        })}
      </Fragment>
    )
  );
}

function showTicketSalesStart(dateTime) {
  return dateTime && !isTimePast(dateTime);
}

// Convert dates back to Date types because it's serialised through
// `getInitialProps`
export function convertJsonToDates(jsonEvent: UiEvent): UiEvent {
  const dateRange = {
    ...jsonEvent.dateRange,
    firstDate: new Date(jsonEvent.dateRange.firstDate),
    lastDate: new Date(jsonEvent.dateRange.lastDate),
  };
  const times = jsonEvent.times.map(time => {
    return {
      ...time,
      range: {
        startDateTime: new Date(time.range.startDateTime),
        endDateTime: new Date(time.range.endDateTime),
      },
    };
  });

  const schedule =
    jsonEvent.schedule &&
    jsonEvent.schedule.map(item => ({
      ...item,
      event: convertJsonToDates(item.event),
    }));

  return {
    ...jsonEvent,
    times,
    schedule,
    dateRange,
  };
}

class EventPage extends Component<Props, State> {
  state = {
    scheduledIn: null,
  };

  static getInitialProps = async (ctx: Context) => {
    const { id } = ctx.query;
    const event = await getEvent(ctx.req, { id });

    if (event) {
      return {
        event,
        title: event.title,
        description: event.metadataDescription || event.promoText,
        type: 'event',
        canonicalUrl: `https://wellcomecollection.org/events/${event.id}`,
        imageUrl: event.image && convertImageUri(event.image.contentUrl, 800),
        siteSection: 'whatson',
        category: 'public-programme',
        pageJsonLd: eventLd(event),
      };
    } else {
      return { statusCode: 404 };
    }
  };

  async componentDidMount() {
    const scheduledIn = await getEvents(null, {
      predicates: [
        Prismic.Predicates.at('my.events.schedule.event', this.props.event.id),
      ],
    });

    if (scheduledIn && scheduledIn.results.length > 0) {
      this.setState({
        scheduledIn: scheduledIn.results[0],
      });
    }
  }

  render() {
    const jsonEvent = this.props.event;
    const event = convertJsonToDates(jsonEvent);
    const { scheduledIn } = this.state;

    const image = event.promo && event.promo.image;
    const tasl = image && {
      isFull: false,
      contentUrl: image.contentUrl,
      title: image.title,
      author: image.author,
      sourceName: image.source && image.source.name,
      sourceLink: image.source && image.source.link,
      license: image.license,
      copyrightHolder: image.copyright && image.copyright.holder,
      copyrightLink: image.copyright && image.copyright.link,
    };

    const FeaturedMedia = image && <UiImage tasl={tasl} {...image} />;
    const eventFormat = event.format
      ? [{ url: null, text: event.format.title }]
      : [];
    const eventAudiences = event.audiences
      ? event.audiences.map(a => {
          return {
            url: null,
            text: a.title,
          };
        })
      : [];
    const eventInterpretations = event.interpretations
      ? event.interpretations.map(i => {
          return {
            url: null,
            text: i.interpretationType.title,
          };
        })
      : [];
    const relaxedPerformanceLabel = event.isRelaxedPerformance
      ? [
          {
            url: null,
            text: 'Relaxed performance',
          },
        ]
      : [];

    const breadcrumbs = {
      items: [
        {
          url: '/events',
          text: 'Events',
        },
        ...event.series.map(series => ({
          url: `/event-series/${series.id}`,
          text: series.title || '',
          prefix: 'Part of',
        })),
        scheduledIn
          ? {
              url: `/events/${scheduledIn.id}`,
              text: scheduledIn.title || '',
              prefix: 'Part of',
            }
          : null,
        {
          url: `/events/${event.id}`,
          text: event.title,
          isHidden: true,
        },
      ].filter(Boolean),
    };

    const labels = {
      labels: eventFormat.concat(
        eventAudiences,
        eventInterpretations,
        relaxedPerformanceLabel
      ),
    };
    const Header = (
      <PageHeader
        asyncBreadcrumbsRoute={`/events/${event.id}/scheduled-in`}
        breadcrumbs={breadcrumbs}
        labels={labels}
        title={event.title}
        FeaturedMedia={FeaturedMedia}
        Background={
          <HeaderBackground
            hasWobblyEdge={true}
            backgroundTexture={`https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F43a35689-4923-4451-85d9-1ab866b1826d_event_header_background.svg`}
          />
        }
        ContentTypeInfo={
          <Fragment>
            <VerticalSpace
              size="s"
              className={classNames({
                'flex flex--wrap': true,
              })}
            >
              <EventDateRange event={event} />
              <div
                className={classNames({
                  'margin-left-12': true,
                })}
              >
                {!event.isPast && <EventDatesLink id={event.id} />}
              </div>
            </VerticalSpace>
            {event.isPast && EventStatus('Past', 'marble')}
            {!event.isPast &&
              isEventFullyBooked(event) &&
              EventStatus('Fully booked', 'red')}
          </Fragment>
        }
        HeroPicture={null}
        isFree={!event.cost}
      />
    );

    return (
      <PageLayout
        title={event.title}
        description={event.metadataDescription || event.promoText || ''}
        url={{ pathname: `/events/${event.id}` }}
        jsonLd={eventLd(event)}
        openGraphType={'website'}
        siteSection={'whats-on'}
        imageUrl={event.image && convertImageUri(event.image.contentUrl, 800)}
        imageAltText={event.image && event.image.alt}
      >
        <ContentPage
          id={event.id}
          Header={Header}
          Body={<Body body={event.body} pageId={event.id} />}
        >
          {event.contributors.length > 0 && (
            <Contributors
              titlePrefix="About your"
              titleOverride={event.contributorsTitle}
              contributors={event.contributors}
            />
          )}
          <Fragment>
            <div
              className={`body-text border-bottom-width-1 border-color-pumice`}
            >
              <h2 id="dates">Dates</h2>
              {DateList(event)}
            </div>
          </Fragment>
          {event.schedule && event.schedule.length > 0 && (
            <Fragment>
              <h2 className="h2">Events</h2>
              <ul className="plain-list no-margin no-padding">
                {event.schedule && <EventSchedule schedule={event.schedule} />}
              </ul>
            </Fragment>
          )}
          {event.ticketSalesStart &&
            showTicketSalesStart(event.ticketSalesStart) && (
              <Fragment>
                <Message
                  text={`Booking opens ${formatDayDate(
                    event.ticketSalesStart
                  )} ${
                    event.ticketSalesStart
                      ? formatTime(event.ticketSalesStart)
                      : ''
                  }`}
                />
              </Fragment>
            )}

          {!event.isPast && !showTicketSalesStart(event.ticketSalesStart) && (
            <Fragment>
              {event.eventbriteId && (
                <VerticalSpace size="m">
                  <EventbriteButton event={event} />
                </VerticalSpace>
              )}

              {event.thirdPartyBooking && (
                <Fragment>
                  {event.isCompletelySoldOut ? (
                    <Fragment>
                      <Button
                        type="primary"
                        disabled={true}
                        text="Fully booked"
                      />
                    </Fragment>
                  ) : (
                    <Fragment>
                      <Button
                        type="primary"
                        url={event.thirdPartyBooking.url}
                        trackingEvent={{
                          category: 'component',
                          action: 'booking-tickets:click',
                          label: 'event-page',
                        }}
                        icon="ticket"
                        text="Check for tickets"
                      />
                      {event.thirdPartyBooking.name && (
                        <VerticalSpace size="s" properties={['margin-top']}>
                          <p
                            className={`no-margin font-charcoal ${font(
                              'hnl',
                              5
                            )}`}
                          >
                            with {event.thirdPartyBooking.name}
                          </p>
                        </VerticalSpace>
                      )}
                    </Fragment>
                  )}
                </Fragment>
              )}

              {event.bookingEnquiryTeam && (
                <Fragment>
                  {event.isCompletelySoldOut ? (
                    <Message text={`Fully booked`} />
                  ) : (
                    <Button
                      type="primary"
                      url={`mailto:${event.bookingEnquiryTeam.email}?subject=${event.title}`}
                      trackingEvent={{
                        category: 'component',
                        action: 'booking-tickets:click',
                        label: 'event-page (email to book)',
                      }}
                      icon="email"
                      text="Email to book"
                    />
                  )}

                  {/* FIXME: work out why Flow requires the check for bookingEnquiryTeam here even though we've already checked above */}
                  <NextLink
                    href={`mailto:${
                      event.bookingEnquiryTeam
                        ? event.bookingEnquiryTeam.email
                        : ''
                    }?subject=${event.title}`}
                    as={`mailto:${
                      event.bookingEnquiryTeam
                        ? event.bookingEnquiryTeam.email
                        : ''
                    }?subject=${event.title}`}
                    passHref
                  >
                    <VerticalSpace
                      as="a"
                      size="s"
                      properties={['margin-top']}
                      className={classNames({
                        'block font-charcoal': true,
                        [font('hnm', 5)]: true,
                      })}
                    >
                      <span>{event.bookingEnquiryTeam.email}</span>
                    </VerticalSpace>
                  </NextLink>
                </Fragment>
              )}

              {!event.eventbriteId &&
                !event.bookingEnquiryTeam &&
                !(event.schedule && event.schedule.length > 1) && (
                  <Fragment>
                    {!event.hasEarlyRegistration && !event.cost && (
                      <VerticalSpace size="l">
                        <Message text="Just turn up" />
                      </VerticalSpace>
                    )}
                    {event.hasEarlyRegistration && (
                      <VerticalSpace size="l">
                        <Message text="Arrive early to register" />
                      </VerticalSpace>
                    )}
                  </Fragment>
                )}
            </Fragment>
          )}
          {!event.isPast && (
            <Fragment>
              <InfoBox
                title="Need to know"
                items={[
                  event.place && {
                    id: null,
                    title: 'Location',
                    description: event.place.information,
                  },
                  event.bookingInformation && {
                    id: null,
                    title: 'Extra information',
                    description: event.bookingInformation,
                  },
                ]
                  .concat(event.policies.map(policy => ({ ...policy })))
                  .concat(
                    event.interpretations.map(
                      ({ interpretationType, isPrimary }) => ({
                        id: null,
                        icon: camelize(interpretationType.title),
                        title: interpretationType.title,
                        description: isPrimary
                          ? interpretationType.primaryDescription
                          : interpretationType.description,
                      })
                    )
                  )
                  .filter(Boolean)}
              >
                <p className={`no-margin ${font('hnl', 5)}`}>
                  <a href="https://wellcomecollection.org/pages/Wuw19yIAAK1Z3Sng">
                    Our event terms and conditions
                  </a>
                </p>
              </InfoBox>
            </Fragment>
          )}
          {event.audiences.map(audience => {
            //  TODO remove?
            if (audience.description) {
              return (
                <div className={`body-text`} key={audience.title}>
                  <h2>For {audience.title}</h2>
                  <PrismicHtmlBlock html={audience.description} />
                </div>
              );
            }
          })}
        </ContentPage>
      </PageLayout>
    );
  }
}

export default EventPage;
