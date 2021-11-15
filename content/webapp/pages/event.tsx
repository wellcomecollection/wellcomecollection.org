import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import Prismic from '@prismicio/client';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import Body from '@weco/common/views/components/Body/Body';
import Contributors from '@weco/common/views/components/Contributors/Contributors';
import EventSchedule from '@weco/common/views/components/EventSchedule/EventSchedule';
import Dot from '@weco/common/views/components/Dot/Dot';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import EventbriteButton from '@weco/common/views/components/EventbriteButton/EventbriteButton';
import Message from '@weco/common/views/components/Message/Message';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import InfoBox from '@weco/common/views/components/InfoBox/InfoBox';
import DateRange from '@weco/common/views/components/DateRange/DateRange';
import { font, classNames } from '@weco/common/utils/classnames';
import { camelize } from '@weco/common/utils/grammar';
import {
  formatDayDate,
  isTimePast,
  isDatePast,
  formatTime,
} from '@weco/common/utils/format-date';
import EventDateRange from '@weco/common/views/components/EventDateRange/EventDateRange';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import PageHeader, {
  getFeaturedMedia,
} from '@weco/common/views/components/PageHeader/PageHeader';
import { getEvent, getEvents } from '@weco/common/services/prismic/events';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { eventLd } from '@weco/common/utils/json-ld';
import { isEventFullyBooked, UiEvent } from '@weco/common/model/events';
import EventDatesLink from '../components/EventDatesLink/EventDatesLink';
import Space from '@weco/common/views/components/styled/Space';
import { LabelField } from '@weco/common/model/label-field';
import { GetServerSideProps, NextPage } from 'next';
import styled from 'styled-components';
import {
  getGlobalContextData,
  WithGlobalContextData,
} from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';
import { WithGaDimensions } from '@weco/common/views/pages/_app';
import {
  audioDescribed,
  britishSignLanguage,
  email,
  hearingLoop,
  IconSvg,
  speechToText,
  ticket,
} from '@weco/common/icons';
import { getServerData } from '@weco/common/server-data';
import { removeUndefinedProps } from '@weco/common/utils/json';

const TimeWrapper = styled(Space).attrs({
  v: {
    size: 'm',
    properties: ['padding-top', 'padding-bottom'],
  },
  className: 'flex flex--h-space-between',
})`
  border-top: 1px solid ${props => props.theme.color('pumice')};
`;

const DateWrapper = styled.div.attrs({
  className: 'body-text',
})`
  border-bottom: 1px solid ${props => props.theme.color('pumice')};
`;

type Props = {
  jsonEvent: UiEvent;
} & WithGlobalContextData &
  WithGaDimensions;

// TODO: Probably use the StatusIndicator?
type EventStatusProps = {
  text: string;
  color: string;
};
function EventStatus({ text, color }: EventStatusProps) {
  return (
    <div className="flex">
      <div className={`${font('hnb', 5)} flex flex--v-center`}>
        <Space
          as="span"
          h={{ size: 'xs', properties: ['margin-right'] }}
          className={`flex flex--v-center`}
        >
          <Dot color={color} />
        </Space>
        {text}
      </div>
    </div>
  );
}

function DateList(event) {
  return (
    event.times && (
      <>
        {event.times.map((eventTime, index) => {
          return (
            <TimeWrapper key={index}>
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
                <>{EventStatus({ text: 'Past', color: 'marble' })}</>
              ) : eventTime.isFullyBooked ? (
                EventStatus({ text: 'Full', color: 'red' })
              ) : null}
            </TimeWrapper>
          );
        })}
      </>
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

const eventInterpretationIcons: Record<string, IconSvg> = {
  britishSignLanguage: britishSignLanguage,
  speechToText: speechToText,
  hearingLoop: hearingLoop,
  audioDescribed: audioDescribed,
};

const EventPage: NextPage<Props> = ({
  jsonEvent,
  globalContextData,
}: Props) => {
  const [scheduledIn, setScheduledIn] = useState<UiEvent>();
  const getScheduledIn = async () => {
    const scheduledIn = await getEvents(null, {
      predicates: [
        Prismic.Predicates.at('my.events.schedule.event', jsonEvent.id),
      ],
    });

    if (scheduledIn && scheduledIn.results.length > 0) {
      setScheduledIn(scheduledIn.results[0]);
    }
  };
  useEffect(() => {
    getScheduledIn();
  }, []);

  const event = convertJsonToDates(jsonEvent);

  const genericFields = {
    id: event.id,
    title: event.title,
    contributors: event.contributors,
    contributorsTitle: event.contributorsTitle,
    promo: event.promo,
    body: event.body,
    standfirst: event.standfirst,
    promoImage: event.promoImage,
    promoText: event.promoText,
    image: event.image,
    squareImage: event.squareImage,
    widescreenImage: event.widescreenImage,
    labels: event.labels,
    metadataDescription: event.metadataDescription,
  };

  const maybeFeaturedMedia = getFeaturedMedia(genericFields);
  const hasFeaturedVideo =
    event.body.length > 0 && event.body[0].type === 'videoEmbed';
  const body = hasFeaturedVideo
    ? event.body.slice(1, event.body.length)
    : event.body;
  const eventFormat = event.format ? [{ text: event.format.title }] : [];
  const eventAudiences = event.audiences
    ? event.audiences.map(a => {
        return {
          text: a.title,
        };
      })
    : [];
  const eventInterpretations = event.interpretations
    ? event.interpretations.map(i => {
        return {
          text: i.interpretationType.title,
        };
      })
    : [];
  const relaxedPerformanceLabel = event.isRelaxedPerformance
    ? [
        {
          text: 'Relaxed',
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
      scheduledIn && {
        url: `/events/${scheduledIn.id}`,
        text: scheduledIn.title || '',
        prefix: 'Part of',
      },
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
      FeaturedMedia={maybeFeaturedMedia}
      Background={
        <HeaderBackground
          hasWobblyEdge={true}
          backgroundTexture={`https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F43a35689-4923-4451-85d9-1ab866b1826d_event_header_background.svg`}
        />
      }
      ContentTypeInfo={
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
            <EventDateRange event={event} />
            <Space h={{ size: 's', properties: ['margin-left'] }}>
              {!event.isPast && <EventDatesLink id={event.id} />}
            </Space>
          </Space>
          {event.isPast && EventStatus({ text: 'Past', color: 'marble' })}
          {!event.isPast &&
            isEventFullyBooked(event) &&
            EventStatus({ text: 'Fully booked', color: 'red' })}
        </>
      }
      HeroPicture={null}
      isFree={!event.cost}
      isContentTypeInfoBeforeMedia={true}
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
      imageAltText={event?.image?.alt}
      globalContextData={globalContextData}
    >
      <ContentPage
        id={event.id}
        Header={Header}
        Body={<Body body={body} pageId={event.id} />}
        seasons={event.seasons}
      >
        {event.contributors.length > 0 && (
          <Contributors
            titlePrefix="About your"
            titleOverride={event.contributorsTitle}
            contributors={event.contributors}
          />
        )}
        <DateWrapper>
          <h2 id="dates">Dates</h2>
          {DateList(event)}
        </DateWrapper>
        {event.schedule && event.schedule.length > 0 && (
          <>
            <h2 className="h2">Events</h2>
            {event.schedule && <EventSchedule schedule={event.schedule} />}
          </>
        )}
        {event.ticketSalesStart &&
          showTicketSalesStart(event.ticketSalesStart) && (
            <>
              <Message
                text={`Booking opens ${formatDayDate(event.ticketSalesStart)} ${
                  event.ticketSalesStart
                    ? formatTime(event.ticketSalesStart)
                    : ''
                }`}
              />
            </>
          )}

        {!event.isPast && !showTicketSalesStart(event.ticketSalesStart) && (
          <>
            {event.eventbriteId && (
              <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
                <EventbriteButton event={event} />
              </Space>
            )}

            {event.thirdPartyBooking && (
              <>
                {event.isCompletelySoldOut ? (
                  <>
                    <ButtonSolid disabled={true} text="Fully booked" />
                  </>
                ) : (
                  <>
                    <ButtonSolidLink
                      link={event.thirdPartyBooking.url}
                      trackingEvent={{
                        category: 'component',
                        action: 'booking-tickets:click',
                        label: 'event-page',
                      }}
                      icon={ticket}
                      text="Check for tickets"
                    />
                    {event.thirdPartyBooking.name && (
                      <Space v={{ size: 's', properties: ['margin-top'] }}>
                        <p
                          className={`no-margin font-charcoal ${font(
                            'hnr',
                            5
                          )}`}
                        >
                          with {event.thirdPartyBooking.name}
                        </p>
                      </Space>
                    )}
                  </>
                )}
              </>
            )}

            {event.bookingEnquiryTeam && (
              <>
                {event.isCompletelySoldOut ? (
                  <Message text={`Fully booked`} />
                ) : (
                  <ButtonSolidLink
                    link={`mailto:${event.bookingEnquiryTeam.email}?subject=${event.title}`}
                    trackingEvent={{
                      category: 'component',
                      action: 'booking-tickets:click',
                      label: 'event-page (email to book)',
                    }}
                    icon={email}
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
                  <Space
                    v={{
                      size: 's',
                      properties: ['margin-top'],
                    }}
                    as="a"
                    className={classNames({
                      'block font-charcoal': true,
                      [font('hnb', 5)]: true,
                    })}
                  >
                    <span>{event.bookingEnquiryTeam.email}</span>
                  </Space>
                </NextLink>
              </>
            )}

            {!event.eventbriteId &&
              !event.bookingEnquiryTeam &&
              !(event.schedule && event.schedule.length > 1) && (
                <>
                  {!event.hasEarlyRegistration && !event.cost && (
                    <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
                      <Message text="Just turn up" />
                    </Space>
                  )}
                  {event.hasEarlyRegistration && (
                    <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
                      <Message text="Arrive early to register" />
                    </Space>
                  )}
                </>
              )}
          </>
        )}

        <InfoBox
          title="Need to know"
          items={
            [
              event.place && {
                id: undefined,
                title: 'Location',
                description: event.place.information,
              },
              event.bookingInformation && {
                id: undefined,
                title: 'Extra information',
                description: event.bookingInformation,
              },
            ]
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              .concat(event.policies)
              .concat(
                event.interpretations.map(
                  ({ interpretationType, isPrimary, extraInformation }) => {
                    const iconName = camelize(interpretationType.title);
                    return {
                      id: undefined,
                      icon: eventInterpretationIcons[iconName],
                      title: interpretationType.title,
                      description: (
                        (isPrimary
                          ? interpretationType.primaryDescription
                          : interpretationType.description) || []
                      ).concat(extraInformation || []),
                    };
                  }
                )
              )
              .filter(Boolean) as LabelField[]
          }
        >
          <p className={`no-margin ${font('hnr', 5)}`}>
            <a href="https://wellcomecollection.org/pages/Wuw19yIAAK1Z3Sng">
              Our event terms and conditions
            </a>
          </p>
        </InfoBox>

        {event.audiences.map(audience => {
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
};

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const serverData = await getServerData(context);
  const globalContextData = getGlobalContextData(context);
  const { id, memoizedPrismic } = context.query;
  const event = await getEvent(context.req, { id }, memoizedPrismic);

  if (!event) {
    return {
      notFound: true,
    };
  }

  // This is a bit of nonsense as the event type has loads `undefined` values
  // which we could pick out explicitly, or do this.
  // See: https://github.com/vercel/next.js/discussions/11209#discussioncomment-35915
  return {
    props: removeUndefinedProps({
      jsonEvent: JSON.parse(JSON.stringify(event)),
      globalContextData,
      serverData,
      gaDimensions: {
        partOf: event.seasons
          .map(season => season.id)
          .concat(event.series.map(series => series.id)),
      },
    }),
  };
};

export default EventPage;
