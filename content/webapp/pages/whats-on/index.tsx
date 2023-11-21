import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';
import styled from 'styled-components';
import NextLink from 'next/link';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import { EventBasic } from '@weco/content/types/events';
import { Period, isOfTypePeriod } from '@weco/common/types/periods';
import { font, grid, cssGrid } from '@weco/common/utils/classnames';
import {
  getPageFeaturedText,
  transformPage,
} from '@weco/content/services/prismic/transformers/pages';
import {
  filterEventsForToday,
  filterEventsForWeekend,
} from '@weco/content/services/prismic/events';
import { formatDayName, formatDate } from '@weco/common/utils/format-date';
import { clock } from '@weco/common/icons';
import {
  getTodaysVenueHours,
  getVenueById,
} from '@weco/common/services/prismic/opening-times';
import { transformCollectionVenues } from '@weco/common/services/prismic/transformers/collection-venues';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import EventsByMonth from '@weco/content/components/EventsByMonth/EventsByMonth';
import SectionHeader from '@weco/content/components/SectionHeader/SectionHeader';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import Icon from '@weco/common/views/components/Icon/Icon';
import Layout, { gridSize12 } from '@weco/common/views/components/Layout';
import FacilityPromo from '@weco/content/components/FacilityPromo/FacilityPromo';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import Space from '@weco/common/views/components/styled/Space';
import CssGridContainer from '@weco/common/views/components/styled/CssGridContainer';
import {
  ExceptionalOpeningHoursDay,
  OpeningHoursDay,
} from '@weco/common/model/opening-hours';
import {
  collectionVenueId,
  prismicPageIds,
} from '@weco/common/data/hardcoded-ids';
import FeaturedText from '@weco/content/components/FeaturedText/FeaturedText';
import { defaultSerializer } from '@weco/content/components/HTMLSerializers/HTMLSerializers';
import { FeaturedText as FeaturedTextType } from '@weco/content/types/text';
import { SectionPageHeader } from '@weco/common/views/components/styled/SectionPageHeader';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { AppErrorProps } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { usePrismicData } from '@weco/common/server-data/Context';
import {
  exhibitionLd,
  eventLd,
} from '@weco/content/services/prismic/transformers/json-ld';
import ExhibitionsAndEvents from '@weco/content/components/ExhibitionsAndEvents/ExhibitionsAndEvents';
import CardGrid from '@weco/content/components/CardGrid/CardGrid';
import { FeaturedCardExhibition } from '@weco/content/components/FeaturedCard/FeaturedCard';
import { fetchPage } from '@weco/content/services/prismic/fetch/pages';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchEvents } from '@weco/content/services/prismic/fetch/events';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import {
  transformEvent,
  transformEventBasic,
} from '@weco/content/services/prismic/transformers/events';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { fetchExhibitions } from '@weco/content/services/prismic/fetch/exhibitions';
import { transformExhibitionsQuery } from '@weco/content/services/prismic/transformers/exhibitions';
import {
  endOfDay,
  getNextWeekendDateRange,
  startOfDay,
} from '@weco/common/utils/dates';
import { HTMLDate } from '@weco/common/views/components/HTMLDateAndTime';
import {
  enrichTryTheseTooPromos,
  getTryTheseTooPromos,
} from '@weco/content/services/prismic/transformers/whats-on';
import { FacilityPromo as FacilityPromoType } from '@weco/content/types/facility-promo';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';
import { Container } from '@weco/common/views/components/styled/Container';
import Tabs from '@weco/content/components/Tabs';

const tabItems = [
  {
    id: 'current-and-coming-up',
    url: '/whats-on',
    text: 'Everything',
  },
  {
    id: 'today',
    url: '/whats-on/today',
    text: 'Today',
  },
  {
    id: 'this-weekend',
    url: '/whats-on/this-weekend',
    text: 'This weekend',
  },
];

export type Props = {
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

// const ClosedMessage = () => (
//   <>
//     <Space
//       $v={{
//         size: 'm',
//         properties: ['margin-bottom'],
//       }}
//       as="p"
//       className={font('wb', 2)}
//     >
//       Our exhibitions are closed today, but our <a href={cafePromo.url}>café</a>{' '}
//       and <a href={shopPromo.url}>shop</a> are open for your visit.
//     </Space>
//     <Space
//       $v={{
//         size: 'l',
//         properties: ['margin-top', 'margin-bottom'],
//       }}
//     ></Space>
//   </>
// );

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
          {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
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
  featuredText,
}) => {
  return (
    <Space $v={{ size: 'l', properties: ['padding-top'] }}>
      <Container>
        <div className="grid">
          <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
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
                  href="/opening-times"
                  as="/opening-times"
                  className={font('intb', 5)}
                >
                  Full opening times
                </NextLink>
              </OpeningTimes>
            </OpeningTimesWrapper>
          </div>
          {featuredText && featuredText.value && (
            <Space
              className={grid({ s: 12, m: 10, l: 8, xl: 8 })}
              $v={{ size: 's', properties: ['margin-top', 'margin-bottom'] }}
            >
              <FeaturedText
                html={featuredText.value}
                htmlSerializer={defaultSerializer}
              />
            </Space>
          )}
          <Space
            className={grid({ s: 12, m: 10, l: 7, xl: 7 })}
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

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const whatsOnPage = transformPage(whatsOnPageDocument!);

  const featuredText = getPageFeaturedText(whatsOnPage);
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
        period,
        exhibitions,
        events: basicEvents,
        availableOnlineEvents,
        dateRange,
        jsonLd,
        featuredText,
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

  return (
    <PageLayout
      title={pageTitle}
      description={pageDescriptions.whatsOn}
      url={{ pathname: '/whats-on' }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection="whats-on"
      image={firstExhibition && firstExhibition.promo?.image}
      apiToolbarLinks={[createPrismicLink(prismicPageIds.whatsOn)]}
    >
      <>
        <Header
          activeId={period}
          todaysOpeningHours={todaysOpeningHours}
          featuredText={featuredText}
        />
        <Layout gridSizes={gridSize12()}>
          <DateRange dateRange={dateRange} period={period} />
          {/* TODO put back when building, shop and cafe are open normally */}
          {/* {period === 'today' && todaysOpeningHours?.isClosed && (
            <ClosedMessage />
          )} */}
        </Layout>
        <Space $v={{ size: 'm', properties: ['margin-top'] }}>
          {period === 'current-and-coming-up' && (
            <>
              <Space $v={{ size: 'm', properties: ['padding-top'] }}>
                <SpacingSection>
                  <SpacingComponent>
                    <SectionHeader title="Exhibitions" />
                  </SpacingComponent>
                  <SpacingComponent>
                    <Space $v={{ size: 'xl', properties: ['margin-bottom'] }}>
                      {firstExhibition ? (
                        <Layout gridSizes={gridSize12()}>
                          <FeaturedCardExhibition
                            exhibition={firstExhibition}
                            background="warmNeutral.300"
                            textColor="black"
                          />
                        </Layout>
                      ) : (
                        <Layout gridSizes={gridSize12()}>
                          <p>There are no current exhibitions</p>
                        </Layout>
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
                  />
                </SpacingSection>

                <SpacingSection>
                  <SpacingComponent>
                    <SectionHeader title="Events" />
                  </SpacingComponent>
                  <SpacingComponent>
                    {events.length > 0 ? (
                      <EventsByMonth
                        events={events}
                        links={[{ text: 'View all events', url: '/events' }]}
                      />
                    ) : (
                      <Layout gridSizes={gridSize12()}>
                        <p>There are no upcoming events</p>
                      </Layout>
                    )}
                  </SpacingComponent>
                </SpacingSection>

                <SpacingSection>
                  <SpacingComponent>
                    <SectionHeader title="Catch up" />
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
                      <Layout gridSizes={gridSize12()}>
                        <p>There are no upcoming catch up events</p>
                      </Layout>
                    )}
                  </SpacingComponent>
                </SpacingSection>
              </Space>
            </>
          )}
          {period !== 'current-and-coming-up' && (
            <SpacingSection>
              <Space
                $v={{ size: 'm', properties: ['padding-top', 'margin-bottom'] }}
              >
                <Layout gridSizes={gridSize12()}>
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
                </Layout>
              </Space>
              <ExhibitionsAndEvents
                exhibitions={exhibitions}
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
            <SectionHeader title="Try these too" />
          </SpacingComponent>
          <SpacingComponent>
            <CssGridContainer>
              <div className="css-grid card-theme card-theme--transparent">
                {tryTheseToo.map(promo => (
                  <div
                    key={promo.id}
                    className={cssGrid({
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
