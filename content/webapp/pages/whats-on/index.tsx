import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import {
  collectionVenueId,
  prismicPageIds,
} from '@weco/common/data/hardcoded-ids';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { clock, information } from '@weco/common/icons';
import {
  ExceptionalOpeningHoursDay,
  OpeningHoursDay,
} from '@weco/common/model/opening-hours';
import { PagesDocument as RawPagesDocument } from '@weco/common/prismicio-types';
import { getServerData } from '@weco/common/server-data';
import { usePrismicData } from '@weco/common/server-data/Context';
import { AppErrorProps } from '@weco/common/services/app';
import {
  getTodaysVenueHours,
  getVenueById,
} from '@weco/common/services/prismic/opening-times';
import { transformCollectionVenues } from '@weco/common/services/prismic/transformers/collection-venues';
import { isOfTypePeriod, Period } from '@weco/common/types/periods';
import { font, grid } from '@weco/common/utils/classnames';
import {
  endOfDay,
  getNextWeekendDateRange,
  startOfDay,
} from '@weco/common/utils/dates';
import { formatDate, formatDayName } from '@weco/common/utils/format-date';
import { serialiseProps } from '@weco/common/utils/json';
import AccessibilityProvision from '@weco/common/views/components/AccessibilityProvision/AccessibilityProvision';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { HTMLDate } from '@weco/common/views/components/HTMLDateAndTime';
import Icon from '@weco/common/views/components/Icon/Icon';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { Container } from '@weco/common/views/components/styled/Container';
import CssGridContainer from '@weco/common/views/components/styled/CssGridContainer';
import { SectionPageHeader } from '@weco/common/views/components/styled/SectionPageHeader';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import theme from '@weco/common/views/themes/default';
import CardGrid from '@weco/content/components/CardGrid/CardGrid';
import EventsByMonth from '@weco/content/components/EventsByMonth/EventsByMonth';
import ExhibitionsAndEvents from '@weco/content/components/ExhibitionsAndEvents/ExhibitionsAndEvents';
import FacilityPromo from '@weco/content/components/FacilityPromo/FacilityPromo';
import FeaturedCard from '@weco/content/components/FeaturedCard';
import InfoBox, {
  InfoIconWrapper,
} from '@weco/content/components/InfoBox/InfoBox';
import MoreLink from '@weco/content/components/MoreLink/MoreLink';
import SectionHeader from '@weco/content/components/SectionHeader/SectionHeader';
import Tabs from '@weco/content/components/Tabs';
import {
  filterEventsForToday,
  filterEventsForWeekend,
} from '@weco/content/services/prismic/events';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchEvents } from '@weco/content/services/prismic/fetch/events';
import { fetchExhibitions } from '@weco/content/services/prismic/fetch/exhibitions';
import { fetchPage } from '@weco/content/services/prismic/fetch/pages';
import {
  transformEvent,
  transformEventBasic,
} from '@weco/content/services/prismic/transformers/events';
import { transformExhibitionsQuery } from '@weco/content/services/prismic/transformers/exhibitions';
import {
  eventLd,
  exhibitionLd,
} from '@weco/content/services/prismic/transformers/json-ld';
import { transformPage } from '@weco/content/services/prismic/transformers/pages';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import {
  enrichTryTheseTooPromos,
  getTryTheseTooPromos,
} from '@weco/content/services/prismic/transformers/whats-on';
import { EventBasic } from '@weco/content/types/events';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import { FacilityPromo as FacilityPromoType } from '@weco/content/types/facility-promo';
import { FeaturedText as FeaturedTextType } from '@weco/content/types/text';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';

const tabItems = [
  {
    id: 'current-and-coming-up',
    url: `/${prismicPageIds.whatsOn}`,
    text: 'Everything',
  },
  {
    id: 'today',
    url: `/${prismicPageIds.whatsOn}/today`,
    text: 'Today',
  },
  {
    id: 'this-weekend',
    url: `/${prismicPageIds.whatsOn}/this-weekend`,
    text: 'This weekend',
  },
];

export type Props = {
  pageId: string;
  exhibitions: ExhibitionBasic[];
  events: EventBasic[];
  availableOnlineEvents: EventBasic[];
  period: Period;
  dateRange: { start: Date; end?: Date };
  featuredText?: FeaturedTextType;
  tryTheseToo: FacilityPromoType[];
  jsonLd: JsonLdObj[];
};

export function getRangeForPeriod(period: Period): { start: Date; end?: Date } {
  const today = new Date();

  switch (period) {
    case 'today':
      return {
        start: startOfDay(today),
        end: endOfDay(today),
      };
    case 'this-weekend':
      return getNextWeekendDateRange(today);
    default:
      return { start: startOfDay(today) };
  }
}

const ClosedMessage = () => (
  <Space
    $v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}
    style={{ maxWidth: theme.sizes.large }}
  >
    <InfoBox
      title="Exhibitions are closed today"
      headingClasses={font('wb', 2)}
      items={[]}
    >
      <InfoIconWrapper>
        <Icon icon={information} />
      </InfoIconWrapper>
      <p className={font('intr', 5)}>
        Our exhibitions are closed today, but our{' '}
        <a href={`/visit-us/${prismicPageIds.cafe}`}>café</a> and{' '}
        <a href={`/visit-us/${prismicPageIds.shop}`}>shop</a> are open for your
        visit.
      </p>

      <InfoIconWrapper>
        <Icon icon={clock} />
      </InfoIconWrapper>
      <p className={font('intr', 5)} style={{ marginBottom: 0 }}>
        Galleries open Tuesday–Sunday,{' '}
        <a href={`/visit-us/${prismicPageIds.openingTimes}`}>
          see full opening times
        </a>
        .
      </p>
    </InfoBox>
    <Space $v={{ size: 'l', properties: ['margin-top'] }}>
      <MoreLink url="/exhibitions" name="View all exhibitions" />
    </Space>
    <Space $v={{ size: 'm', properties: ['margin-top'] }}>
      <MoreLink url="/events" name="View all events" />
    </Space>
  </Space>
);

type DateRangeProps = {
  dateRange: { start: Date; end?: Date };
  period: string;
};

const DateRange = ({ dateRange, period }: DateRangeProps) => {
  const { start, end } = dateRange;
  return (
    <Space
      $v={{
        size: 's',
        properties: ['margin-bottom'],
      }}
      as="p"
      className={font('intr', 5)}
    >
      {period === 'today' && <HTMLDate date={start} />}
      {period === 'this-weekend' && (
        <>
          <time dateTime={formatDate(start)}>{formatDayName(start)}</time>
          {' – '}
          {/*
            When the period is 'this-weekend', the dates come from getNextWeekendDateRange,
            which always includes a start and an end, so we can safely non-null here.

            We could get this working in the type system, but it's a more invasive change.
          */}
          <time dateTime={formatDate(end!)}>{formatDayName(end!)}</time>
        </>
      )}
      {period === 'current-and-coming-up' && (
        <>
          From <HTMLDate date={start} />
        </>
      )}
    </Space>
  );
};

const OpeningTimesWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const OpeningTimes = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

type HeaderProps = {
  activeId: string;
  todaysOpeningHours: ExceptionalOpeningHoursDay | OpeningHoursDay | undefined;
  featuredText?: FeaturedTextType;
};

const Header: FunctionComponent<HeaderProps> = ({
  activeId,
  todaysOpeningHours,
}) => {
  return (
    <Space $v={{ size: 'l', properties: ['padding-top'] }}>
      <Container>
        <div className="grid">
          <div
            className={grid({
              s: [12],
              m: [12],
              l: [12],
              xl: [12],
            })}
          >
            <OpeningTimesWrapper>
              <SectionPageHeader $sectionLevelPage={true}>
                What’s on
              </SectionPageHeader>
              <OpeningTimes>
                {todaysOpeningHours && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Space
                      as="span"
                      $h={{ size: 'm', properties: ['margin-right'] }}
                      className={font('intb', 5)}
                    >
                      Galleries
                      {todaysOpeningHours.isClosed ? ' closed ' : ' open '}
                      today
                    </Space>
                    {!todaysOpeningHours.isClosed && (
                      <>
                        <Space
                          style={{ display: 'flex' }}
                          as="span"
                          $h={{ size: 's', properties: ['margin-right'] }}
                        >
                          <Icon icon={clock} />
                        </Space>
                        <Space
                          as="span"
                          $h={{ size: 'm', properties: ['margin-right'] }}
                          className={font('intr', 5)}
                        >
                          <>
                            <time>{todaysOpeningHours.opens}</time>
                            {' – '}
                            <time>{todaysOpeningHours.closes}</time>
                          </>
                        </Space>
                      </>
                    )}
                  </div>
                )}
                <NextLink
                  href={`/visit-us/${prismicPageIds.openingTimes}`}
                  className={font('intb', 5)}
                >
                  Full opening times
                </NextLink>
              </OpeningTimes>
            </OpeningTimesWrapper>
          </div>
          <Space
            className={grid({
              s: [12],
              m: [10],
              l: [7],
              xl: [7],
            })}
            $v={{ size: 's', properties: ['margin-top', 'margin-bottom'] }}
          >
            <Tabs
              tabBehaviour="navigate"
              label="date filter"
              currentSection={activeId}
              items={tabItems}
            />
          </Space>
        </div>
      </Container>
    </Space>
  );
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res, cacheTTL.events);
  const serverData = await getServerData(context);

  const client = createClient(context);

  let period: Period;

  if (context.query.period) {
    const test = context.query.period.toString();
    if (isOfTypePeriod(test)) {
      period = test;
    } else {
      return { notFound: true };
    }
  } else {
    period = 'current-and-coming-up';
  }

  const whatsOnPagePromise = fetchPage(client, prismicPageIds.whatsOn);

  const exhibitionsQueryPromise = fetchExhibitions(client, {
    period,
    order: 'asc',
  });

  const eventsQueryPromise = fetchEvents(client, {
    period: 'current-and-coming-up',
    pageSize: 100,
  });

  const availableOnlineEventsQueryPromise = fetchEvents(client, {
    period: 'past',
    pageSize: 6,
    availableOnline: true,
  });

  const [
    exhibitionsQuery,
    eventsQuery,
    availableOnlineEventsQuery,
    whatsOnPageDocument,
  ] = await Promise.all([
    exhibitionsQueryPromise,
    eventsQueryPromise,
    availableOnlineEventsQueryPromise,
    whatsOnPagePromise,
  ]);

  const whatsOnPage = transformPage(whatsOnPageDocument as RawPagesDocument);

  const tryTheseToo = getTryTheseTooPromos(whatsOnPage);

  const dateRange = getRangeForPeriod(period);

  const events = transformQuery(eventsQuery, transformEvent).results;
  const exhibitions = transformExhibitionsQuery(exhibitionsQuery).results;
  const availableOnlineEvents = transformQuery(
    availableOnlineEventsQuery,
    transformEventBasic
  ).results;

  const basicEvents = transformQuery(eventsQuery, transformEventBasic).results;

  if (period && events && exhibitions) {
    const jsonLd = [
      ...exhibitions.map(exhibitionLd),
      ...events.map(eventLd),
    ] as JsonLdObj[];

    return {
      props: serialiseProps({
        pageId: whatsOnPage.id,
        period,
        exhibitions,
        events: basicEvents,
        availableOnlineEvents,
        dateRange,
        jsonLd,
        tryTheseToo,
        serverData,
      }),
    };
  } else {
    return { notFound: true };
  }
};

const WhatsOnPage: FunctionComponent<Props> = props => {
  const {
    pageId,
    period,
    exhibitions,
    events,
    availableOnlineEvents,
    dateRange,
    jsonLd,
    featuredText,
    tryTheseToo: basicTryTheseTooPromos,
  } = props;

  const tryTheseToo = enrichTryTheseTooPromos(basicTryTheseTooPromos);

  const firstExhibition = exhibitions[0];

  const extraTitleText = tabItems.find(item => item.id === period);
  const pageTitle = extraTitleText
    ? `What’s on${` - ${extraTitleText.text}`}`
    : `What’s on`;

  const { collectionVenues } = usePrismicData();
  const venues = transformCollectionVenues(collectionVenues);
  const galleries = getVenueById(venues, collectionVenueId.galleries.id);
  const todaysOpeningHours = galleries && getTodaysVenueHours(galleries);

  const eventsToShow =
    period === 'today'
      ? filterEventsForToday(events)
      : period === 'this-weekend'
        ? filterEventsForWeekend(events)
        : events;

  // When the galleries are closed, we shouldn't be displaying exhibitions
  const exhibitionsToShow =
    period === 'today' && todaysOpeningHours?.isClosed ? [] : exhibitions;

  return (
    <PageLayout
      title={pageTitle}
      description={pageDescriptions.whatsOn}
      url={{ pathname: '/whats-on' }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection="whats-on"
      image={firstExhibition && firstExhibition.promo?.image}
      apiToolbarLinks={[createPrismicLink(pageId)]}
    >
      <>
        <Header
          activeId={period}
          todaysOpeningHours={todaysOpeningHours}
          featuredText={featuredText}
        />
        <ContaineredLayout gridSizes={gridSize12()}>
          <DateRange dateRange={dateRange} period={period} />

          {period === 'today' && todaysOpeningHours?.isClosed && (
            <ClosedMessage />
          )}
        </ContaineredLayout>
        <Space $v={{ size: 'm', properties: ['margin-top'] }}>
          {period === 'current-and-coming-up' && (
            <>
              <Space $v={{ size: 'm', properties: ['padding-top'] }}>
                <SpacingSection>
                  <SpacingComponent>
                    <SectionHeader
                      title="Exhibitions"
                      gridSize={gridSize12()}
                    />
                  </SpacingComponent>
                  <SpacingComponent>
                    <Space $v={{ size: 'xl', properties: ['margin-bottom'] }}>
                      {firstExhibition ? (
                        <ContaineredLayout gridSizes={gridSize12()}>
                          <FeaturedCard
                            type="exhibition"
                            exhibition={firstExhibition}
                            background="warmNeutral.300"
                            textColor="black"
                          />
                        </ContaineredLayout>
                      ) : (
                        <ContaineredLayout gridSizes={gridSize12()}>
                          <p>There are no current exhibitions</p>
                        </ContaineredLayout>
                      )}
                    </Space>
                  </SpacingComponent>

                  <CardGrid
                    items={exhibitions.slice(1)}
                    itemsPerRow={3}
                    links={[
                      {
                        text: 'View all exhibitions',
                        url: '/exhibitions',
                      },
                    ]}
                    optionalComponent={<AccessibilityProvision />}
                  />
                </SpacingSection>

                <SpacingSection>
                  <SpacingComponent>
                    <SectionHeader title="Events" gridSize={gridSize12()} />
                  </SpacingComponent>
                  <SpacingComponent>
                    {events.length > 0 ? (
                      <EventsByMonth
                        events={events}
                        links={[{ text: 'View all events', url: '/events' }]}
                      />
                    ) : (
                      <ContaineredLayout gridSizes={gridSize12()}>
                        <p>There are no upcoming events</p>
                      </ContaineredLayout>
                    )}
                  </SpacingComponent>
                </SpacingSection>

                <SpacingSection>
                  <SpacingComponent>
                    <SectionHeader title="Catch up" gridSize={gridSize12()} />
                  </SpacingComponent>
                  <SpacingComponent>
                    {availableOnlineEvents.length > 0 ? (
                      <CardGrid
                        items={availableOnlineEvents}
                        itemsPerRow={3}
                        links={[
                          {
                            text: 'View all catch up events',
                            url: '/events/past?availableOnline=true',
                          },
                        ]}
                      />
                    ) : (
                      <ContaineredLayout gridSizes={gridSize12()}>
                        <p>There are no upcoming catch up events</p>
                      </ContaineredLayout>
                    )}
                  </SpacingComponent>
                </SpacingSection>
              </Space>
            </>
          )}
          {period !== 'current-and-coming-up' &&
            (exhibitionsToShow.length > 0 || eventsToShow.length > 0) && (
              <SpacingSection>
                <Space
                  $v={{
                    size: 'm',
                    properties: ['padding-top', 'margin-bottom'],
                  }}
                >
                  <ContaineredLayout gridSizes={gridSize12()}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <h2 className={font('wb', 2)}>Exhibitions and Events</h2>
                      <span className={font('intb', 4)}>Free admission</span>
                    </div>
                  </ContaineredLayout>
                </Space>
                <ExhibitionsAndEvents
                  exhibitions={exhibitionsToShow}
                  events={eventsToShow}
                  links={[
                    { text: 'View all exhibitions', url: '/exhibitions' },
                    { text: 'View all events', url: '/events' },
                  ]}
                />
              </SpacingSection>
            )}
        </Space>

        <SpacingSection>
          <SpacingComponent>
            <SectionHeader title="Try these too" gridSize={gridSize12()} />
          </SpacingComponent>
          <SpacingComponent>
            <CssGridContainer>
              <div className="grid card-theme card-theme--transparent">
                {tryTheseToo.map(promo => (
                  <div
                    key={promo.id}
                    className={grid({
                      s: 12,
                      m: 6,
                      l: 4,
                      xl: 4,
                    })}
                  >
                    <FacilityPromo {...promo} />
                  </div>
                ))}
              </div>
            </CssGridContainer>
          </SpacingComponent>
        </SpacingSection>
      </>
    </PageLayout>
  );
};

export default WhatsOnPage;
