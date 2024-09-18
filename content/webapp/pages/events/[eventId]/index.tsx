import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import * as prismic from '@prismicio/client';
import styled from 'styled-components';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import EventSchedule from '@weco/content/components/EventSchedule/EventSchedule';
import Button from '@weco/common/views/components/Buttons';
import EventbriteButtons from '@weco/content/components/EventbriteButtons/EventbriteButtons';
import Message from '@weco/content/components/Message/Message';
import InfoBox from '@weco/content/components/InfoBox/InfoBox';
import { font } from '@weco/common/utils/classnames';
import { camelize } from '@weco/common/utils/grammar';
import { formatDayDate, formatTime } from '@weco/common/utils/format-date';
import EventDateRange from '@weco/content/components/EventDateRange';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { getFeaturedMedia } from '@weco/content/utils/page-header';
import { Event, EventBasic, Interpretation } from '@weco/content/types/events';
import { upcomingDatesFullyBooked } from '@weco/content/services/prismic/events';
import EventDatesLink from '@weco/content/components/EventDatesLink/EventDatesLink';
import Space from '@weco/common/views/components/styled/Space';
import { LabelField } from '@weco/content/model/label-field';
import { GaDimensions } from '@weco/common/services/app/analytics-scripts';
import {
  audioDescribed,
  britishSignLanguage,
  email,
  hearingLoop,
  IconSvg,
  speechToText,
  ticket,
  arrow,
} from '@weco/common/icons';
import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
import Body from '@weco/content/components/Body/Body';
import ContentPage from '@weco/content/components/ContentPage/ContentPage';
import Contributors from '@weco/content/components/Contributors/Contributors';
import { eventLd } from '@weco/content/services/prismic/transformers/json-ld';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  fetchEvent,
  fetchEventScheduleItems,
  fetchEventsClientSide,
} from '@weco/content/services/prismic/fetch/events';
import {
  getScheduleIds,
  transformEvent,
} from '@weco/content/services/prismic/transformers/events';
import { createClient } from '@weco/content/services/prismic/fetch';
import {
  eventPolicyIds,
  prismicPageIds,
} from '@weco/common/data/hardcoded-ids';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { isPast } from '@weco/common/utils/dates';
import EventDateList from '@weco/content/components/EventDateList';
import EventStatus from '@weco/content/components/EventStatus';

import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { a11y, visualStoryLinkText } from '@weco/common/data/microcopy';
import { Pageview } from '@weco/common/services/conversion/track';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { AppErrorProps } from '@weco/common/services/app';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { Link } from '@weco/content/types/link';
import {
  ResourcesList,
  ResourcesItem,
  ResourceLink,
  ResourceLinkIconWrapper,
} from '@weco/content/components/styled/AccessResources';
import Icon from '@weco/common/views/components/Icon/Icon';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { isVideoEmbed } from '@weco/content/types/body';

const DateWrapper = styled.div.attrs({
  className: 'body-text',
})`
  border-bottom: 1px solid ${props => props.theme.color('warmNeutral.400')};
`;

const ThirdParty = styled.span.attrs({
  className: font('intr', 5),
})`
  color: ${props => props.theme.color('neutral.700')};
  margin: 0;
`;

const EmailTeamCopy = styled(Space).attrs({
  className: font('intb', 5),
  $v: { size: 's', properties: ['margin-top'] },
})`
  display: block;
  color: ${props => props.theme.color('neutral.700')};
`;

type EventProps = {
  event: Event;
  accessResourceLinks?: (Link & { type: string })[];
  jsonLd: JsonLdObj[];
  gaDimensions: GaDimensions;
  pageview: Pageview;
};

function showTicketSalesStart(dateTime: Date | undefined) {
  return dateTime && !isPast(dateTime);
}

const getDescription = ({
  interpretationType,
  extraInformation,
  isPrimary,
}: Interpretation): prismic.RichTextField => {
  const baseDescription: prismic.RichTextField | undefined = isPrimary
    ? interpretationType.primaryDescription
    : interpretationType.description;

  const extraDescription: prismic.RichTextField | undefined =
    extraInformation || [];

  return [...(baseDescription || []), ...extraDescription].filter(
    isNotUndefined
  ) as [prismic.RTNode, ...prismic.RTNode[]];
};

const eventInterpretationIcons: Record<string, IconSvg> = {
  britishSignLanguage,
  speechToText,
  hearingLoop,
  audioDescribed,
};

/**
 * Please note that the /events/{period} routes do not arrive here
 * but instead are rewritten to the index file. Please observe
 * this setup in the next.config file for this app
 */
const EventPage: NextPage<EventProps> = ({
  event,
  accessResourceLinks,
  jsonLd,
}) => {
  const [scheduledIn, setScheduledIn] = useState<EventBasic>();

  // This is used to populate the 'Part of' in the breadcrumb trail.
  //
  // Here's an example of a page which uses it:
  // https://wellcomecollection.org/events/W3K54ykAACcAEIGL
  const getScheduledIn = async () => {
    const scheduledInQuery = await fetchEventsClientSide({
      filters: [prismic.filter.at('my.events.schedule.event', event.id)],
      pageSize: 1,
    });

    if (
      isNotUndefined(scheduledInQuery) &&
      scheduledInQuery.results.length > 0
    ) {
      setScheduledIn(scheduledInQuery.results[0]);
    }
  };
  useEffect(() => {
    getScheduledIn();
  }, []);

  const maybeFeaturedMedia = getFeaturedMedia(event);
  const hasFeaturedVideo =
    event.untransformedBody.length > 0 &&
    isVideoEmbed(event.untransformedBody[0]);
  const untransformedBody = hasFeaturedVideo
    ? event.untransformedBody.slice(1, event.untransformedBody.length)
    : event.untransformedBody;
  const eventFormat = event.format ? [{ text: event.format.title }] : [];
  const eventAudiences = event.audiences.map(a => ({ text: a.title }));
  const eventInterpretations = event.interpretations.map(i => ({
    text: i.interpretationType.title,
  }));

  const breadcrumbs = {
    items: [
      {
        url: '/events',
        text: 'Events',
      },
      ...event.series.map(series => {
        console.log(series);
        return {
          url: linkResolver(series),
          text: series.title || '',
          prefix: 'Part of',
        };
      }),
      scheduledIn
        ? {
            url: linkResolver(scheduledIn),
            text: scheduledIn.title || '',
            prefix: 'Part of',
          }
        : undefined,
      {
        url: linkResolver(event),
        text: event.title,
        isHidden: true,
      },
    ].filter(isNotUndefined),
  };

  const labels = {
    labels: eventFormat.concat(eventAudiences, eventInterpretations),
  };

  const Header = (
    <PageHeader
      breadcrumbs={breadcrumbs}
      labels={labels}
      title={event.title}
      FeaturedMedia={maybeFeaturedMedia}
      Background={
        <HeaderBackground
          hasWobblyEdge={true}
          backgroundTexture={headerBackgroundLs}
        />
      }
      ContentTypeInfo={
        <>
          <Space
            $v={{ size: 's', properties: ['margin-bottom'] }}
            style={{ display: 'flex', flexWrap: 'wrap' }}
          >
            <div style={{ display: 'inline' }}>
              <EventDateRange eventTimes={event.times} />
            </div>
            {/*
              This 'All dates' link takes the user to the complete list of dates
              further down the page, but if there's only one date we can skip it.
             */}
            <Space $h={{ size: 's', properties: ['margin-left'] }}>
              {!event.isPast && event.times.length > 1 && <EventDatesLink />}
            </Space>
          </Space>
          {event.isPast && <EventStatus text="Past" color="neutral.500" />}
          {upcomingDatesFullyBooked(event.times) && (
            <EventStatus text="Fully booked" color="validation.red" />
          )}
        </>
      }
      isFree={!event.cost} // TODO or no online cost
      isContentTypeInfoBeforeMedia={true}
    />
  );

  return (
    <PageLayout
      title={event.title}
      description={event.metadataDescription || event.promo?.caption || ''}
      url={{ pathname: `/events/${event.uid}` }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection="whats-on"
      image={event.image}
      apiToolbarLinks={[createPrismicLink(event.id)]}
    >
      <ContentPage
        id={event.id}
        Header={Header}
        Body={<Body untransformedBody={untransformedBody} pageId={event.id} />}
        seasons={event.seasons}
        // We hide contributors as we render them higher up the page on events
        hideContributors={true}
      >
        <DateWrapper>
          <h2 id="dates">Dates</h2>
          <EventDateList event={event} />
        </DateWrapper>
        {event.schedule && event.schedule.length > 0 && (
          <EventSchedule schedule={event.schedule} />
        )}
        {event.ticketSalesStart &&
          showTicketSalesStart(event.ticketSalesStart) && (
            <>
              <Message
                text={
                  'Booking opens ' +
                  formatDayDate(event.ticketSalesStart) +
                  ' ' +
                  formatTime(event.ticketSalesStart)
                }
              />
            </>
          )}

        {!event.isPast && !showTicketSalesStart(event.ticketSalesStart) && (
          <>
            <EventbriteButtons event={event} />
            {event.thirdPartyBooking && (
              <>
                {event.isCompletelySoldOut ? ( // TODO online sold out / versus normal sold out
                  <>
                    <Button
                      variant="ButtonSolid"
                      disabled={true}
                      text="Fully booked"
                    />
                  </>
                ) : (
                  <>
                    <Button
                      variant="ButtonSolidLink"
                      link={event.thirdPartyBooking.url}
                      icon={ticket}
                      text="Check for tickets"
                      dataGtmTrigger="click_to_book"
                    />
                    {event.thirdPartyBooking.name && (
                      <Space $v={{ size: 's', properties: ['margin-top'] }}>
                        <ThirdParty>
                          with {event.thirdPartyBooking.name}
                        </ThirdParty>
                      </Space>
                    )}
                  </>
                )}
              </>
            )}
            {event.bookingEnquiryTeam && (
              <>
                {event.isCompletelySoldOut ? (
                  <Message text="Fully booked" />
                ) : (
                  <Button
                    variant="ButtonSolidLink"
                    link={`mailto:${event.bookingEnquiryTeam.email}?subject=${event.title}`}
                    icon={email}
                    text="Email to book"
                    dataGtmTrigger="click_to_book"
                  />
                )}

                <NextLink
                  href={`mailto:${event.bookingEnquiryTeam.email}?subject=${event.title}`}
                  as={`mailto:${event.bookingEnquiryTeam.email}?subject=${event.title}`}
                  passHref
                  legacyBehavior
                >
                  <EmailTeamCopy as="a">
                    <span>{event.bookingEnquiryTeam.email}</span>
                  </EmailTeamCopy>
                </NextLink>
              </>
            )}
            {!event.eventbriteId &&
              !event.bookingEnquiryTeam &&
              !(event.schedule && event.schedule.length > 1) && (
                <>
                  {!event.hasEarlyRegistration && !event.cost && (
                    <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
                      <Message text="Just turn up" />
                    </Space>
                  )}
                  {event.hasEarlyRegistration && (
                    <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
                      <Message text="Arrive early to register" />
                    </Space>
                  )}
                </>
              )}
          </>
        )}

        {accessResourceLinks && accessResourceLinks.length > 0 && (
          <>
            <h2 className={font('wb', 3)}>Event access content</h2>
            <Space $v={{ size: 'l', properties: ['padding-bottom'] }}>
              <ResourcesList>
                {accessResourceLinks.map((link, i) => {
                  return (
                    <ResourcesItem key={link.url}>
                      <ResourceLink
                        key={i}
                        href={link.url}
                        $borderColor="accent.turquoise"
                      >
                        {link.type === 'visual-story' && (
                          <h3 className={font('intb', 4)}>Visual story</h3>
                        )}
                        <span className={font('intr', 6)}>{link.text}</span>
                        <ResourceLinkIconWrapper>
                          <Icon icon={arrow} />
                        </ResourceLinkIconWrapper>
                      </ResourceLink>
                    </ResourcesItem>
                  );
                })}
              </ResourcesList>
            </Space>
          </>
        )}

        <InfoBox
          title="Need to know"
          items={
            [
              event.locations[0] && {
                title: 'Location',
                description: event.locations[0].information,
              },
              event.bookingInformation && {
                title: 'Extra information',
                description: event.bookingInformation,
              },
            ]
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              .concat(event.policies)
              .concat(
                event.interpretations.map(interpretation => {
                  const iconName = camelize(
                    interpretation.interpretationType.title
                  );

                  const description = getDescription(interpretation);

                  return {
                    icon: eventInterpretationIcons[iconName],
                    title: interpretation.interpretationType.title,
                    description,
                  };
                })
              )
              .filter(Boolean) as LabelField[]
          }
        >
          {/*
            By default we show an 'event terms and conditions' link at the bottom
            of the yellow box, but school events have their own T&Cs which are
            managed separately, so we suppress the link.

            Later we might want to make this event configurable in Prismic,

            See https://wellcome.slack.com/archives/C8X9YKM5X/p1673523089747359
          */}
          {isNotUndefined(
            event.policies.find(p => p.id === eventPolicyIds.schoolBooking)
          ) ? (
            <p className={font('intr', 5)} style={{ marginBottom: 0 }}>
              {a11y.defaultEventMessage}
            </p>
          ) : (
            <>
              <p className={font('intr', 5)}>{a11y.defaultEventMessage}</p>
              <p className={font('intr', 5)} style={{ marginBottom: 0 }}>
                <a
                  href={`https://wellcomecollection.org/pages/${prismicPageIds.bookingAndAttendingOurEvents}`}
                >
                  Our event terms and conditions
                </a>
              </p>
            </>
          )}
        </InfoBox>
        {/* We deliberately position the contributors below the schedule, so a
        reader can see all the events in a festival/multi-part event before they
        see the contributors. This was agreed in April 2022 with the content
        team. */}
        {event.contributors.length > 0 && (
          <Contributors
            contributors={event.contributors}
            titlePrefix="About your"
          />
        )}
      </ContentPage>
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<
  EventProps | AppErrorProps
> = async context => {
  setCacheControl(context.res, cacheTTL.events);
  const { eventId } = context.query;

  if (!looksLikePrismicId(eventId)) {
    return { notFound: true };
  }

  const client = createClient(context);
  const eventDocument = await fetchEvent(client, eventId as string);

  if (isNotUndefined(eventDocument?.event)) {
    const { event, visualStories } = eventDocument;

    const serverData = await getServerData(context);
    const scheduleIds = getScheduleIds(event);

    const scheduleQuery =
      scheduleIds.length > 0
        ? await fetchEventScheduleItems(client, scheduleIds)
        : undefined;

    const eventDoc = transformEvent(event, scheduleQuery);

    const jsonLd = eventLd(eventDoc);

    const visualStoriesLinks = visualStories?.results.map(visualStory => {
      const url = linkResolver(visualStory);
      return {
        text: visualStoryLinkText,
        url,
        type: 'visual-story',
      };
    });

    return {
      props: serialiseProps({
        event: eventDoc,
        accessResourceLinks: visualStoriesLinks,
        jsonLd,
        serverData,
        gaDimensions: {
          partOf: eventDoc.seasons
            .map(season => season.id)
            .concat(eventDoc.series.map(series => series.id)),
        },
        pageview: {
          name: 'event',
          properties: {},
        },
      }),
    };
  }

  return { notFound: true };
};

export default EventPage;
