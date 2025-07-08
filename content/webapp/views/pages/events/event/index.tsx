import * as prismic from '@prismicio/client';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  eventPolicyIds,
  interpretationTypeIconMap,
  prismicPageIds,
} from '@weco/common/data/hardcoded-ids';
import { a11y } from '@weco/common/data/microcopy';
import { arrow, email, ticket } from '@weco/common/icons';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { font } from '@weco/common/utils/classnames';
import { formatDayDate, formatTime } from '@weco/common/utils/format-date';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { getBreadcrumbItems } from '@weco/common/views/components/Breadcrumb';
import Button from '@weco/common/views/components/Buttons';
import HeaderBackground from '@weco/common/views/components/HeaderBackground';
import Icon from '@weco/common/views/components/Icon';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import PageHeader from '@weco/common/views/components/PageHeader';
import PageLayout from '@weco/common/views/components/PageLayout';
import Space from '@weco/common/views/components/styled/Space';
import Body from '@weco/content/views/components/Body';
import BslLeafletVideo from '@weco/content/views/components/BslLeafletVideo';
import ContentPage from '@weco/content/views/components/ContentPage';
import Contributors from '@weco/content/views/components/Contributors';
import EventbriteButtons from '@weco/content/views/components/EventbriteButtons';
import EventDateRange from '@weco/content/views/components/EventDateRange';
import EventSchedule from '@weco/content/views/components/EventSchedule';
import InfoBox from '@weco/content/views/components/InfoBox';
import Message from '@weco/content/views/components/Message';
import {
  ResourceLink,
  ResourceLinkIconWrapper,
  ResourcesItem,
  ResourcesList,
} from '@weco/content/views/components/styled/AccessResources';
import { LabelField } from '@weco/content/model/label-field';
import { upcomingDatesFullyBooked } from '@weco/content/services/prismic/events';
import { fetchEventsClientSide } from '@weco/content/services/prismic/fetch/events';
import { isVideoEmbed } from '@weco/content/types/body';
import { Event, EventBasic } from '@weco/content/types/events';
import { Link } from '@weco/content/types/link';
import { getFeaturedMedia } from '@weco/content/utils/page-header';

import EventDateList from './event.EventDateList';
import EventDatesLink from './event.EventDatesLink';
import EventStatus from './event.EventStatus';
import {
  eventInterpretationIcons,
  getDescription,
  showTicketSalesStart,
} from './event.helpers';

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

export type Props = {
  event: Event;
  accessResourceLinks?: (Link & { type: string })[];
  jsonLd: JsonLdObj[];
};

/**
 * Please note that the /events/{period} routes do not arrive here
 * but instead are rewritten to the index file. Please observe
 * this setup in the next.config file for this app
 */
const EventPage: NextPage<Props> = ({ event, accessResourceLinks, jsonLd }) => {
  const [scheduledIn, setScheduledIn] = useState<EventBasic>();
  const [isModalActive, setIsModalActive] = useState(false);

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

  const extraBreadcrumbs = [
    {
      url: '/events',
      text: 'Events',
    },
    ...event.series.map(series => ({
      url: linkResolver(series),
      text: series.title || '',
      prefix: 'Part of',
    })),
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
  ].filter(isNotUndefined);

  const labels = {
    labels: eventFormat.concat(eventAudiences, eventInterpretations),
  };

  const Header = (
    <>
      <PageHeader
        breadcrumbs={getBreadcrumbItems('whats-on', extraBreadcrumbs)}
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
        isFree={!event.cost}
        isContentTypeInfoBeforeMedia={true}
      />

      {event.bslLeafletVideo && (
        <BslLeafletVideo
          video={event.bslLeafletVideo}
          isModalActive={isModalActive}
          setIsModalActive={setIsModalActive}
        />
      )}
    </>
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
                {event.isCompletelySoldOut ? (
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
                  const description = getDescription(interpretation);
                  const matchingInterpretation = interpretationTypeIconMap.find(
                    item =>
                      item.prismicId === interpretation.interpretationType.id
                  );
                  const iconName = matchingInterpretation?.iconName;
                  return {
                    icon: iconName ? eventInterpretationIcons[iconName] : null,
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
                  href={`https://wellcomecollection.org/visit-us/${prismicPageIds.bookingAndAttendingOurEvents}`}
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

export default EventPage;
