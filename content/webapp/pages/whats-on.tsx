import { FunctionComponent } from 'react';
import NextLink from 'next/link';
import { ExhibitionBasic } from '../types/exhibitions';
import { EventBasic } from '../types/events';
import { Period } from '../types/periods';
import { font, grid, cssGrid } from '@weco/common/utils/classnames';
import {
  getPageFeaturedText,
  transformPage,
} from '../services/prismic/transformers/pages';
import {
  filterEventsForToday,
  filterEventsForWeekend,
} from '../services/prismic/events';
import { formatDayName, formatDate } from '@weco/common/utils/format-date';
import { clock } from '@weco/common/icons';
import {
  getTodaysVenueHours,
  getVenueById,
} from '@weco/common/services/prismic/opening-times';
import { transformCollectionVenues } from '@weco/common/services/prismic/transformers/collection-venues';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import SegmentedControl from '@weco/common/views/components/SegmentedControl/SegmentedControl';
import EventsByMonth from '../components/EventsByMonth/EventsByMonth';
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import Icon from '@weco/common/views/components/Icon/Icon';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import FacilityPromo from '../components/FacilityPromo/FacilityPromo';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
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
import FeaturedText from '../components/FeaturedText/FeaturedText';
import { defaultSerializer } from '../components/HTMLSerializers/HTMLSerializers';
import { FeaturedText as FeaturedTextType } from '../types/text';
import { SectionPageHeader } from '@weco/common/views/components/styled/SectionPageHeader';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { GetServerSideProps } from 'next';
import { AppErrorProps } from '@weco/common/services/app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { usePrismicData } from '@weco/common/server-data/Context';
import {
  exhibitionLd,
  eventLd,
} from '../services/prismic/transformers/json-ld';
import ExhibitionsAndEvents from '../components/ExhibitionsAndEvents/ExhibitionsAndEvents';
import CardGrid from '../components/CardGrid/CardGrid';
import { FeaturedCardExhibition } from '../components/FeaturedCard/FeaturedCard';
import { fetchPage } from '../services/prismic/fetch/pages';
import { createClient } from '../services/prismic/fetch';
import { fetchEvents } from '../services/prismic/fetch/events';
import { transformQuery } from '../services/prismic/transformers/paginated-results';
import {
  transformEvent,
  transformEventBasic,
} from '../services/prismic/transformers/events';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { fetchExhibitions } from '../services/prismic/fetch/exhibitions';
import { transformExhibitionsQuery } from '../services/prismic/transformers/exhibitions';
import {
  endOfDay,
  getNextWeekendDateRange,
  startOfDay,
} from '@weco/common/utils/dates';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import {
  enrichTryTheseTooPromos,
  getTryTheseTooPromos,
} from '../services/prismic/transformers/whats-on';
import { FacilityPromo as FacilityPromoType } from '../types/facility-promo';

const segmentedControlItems = [
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
  period: string;
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
//       v={{
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
//       v={{
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
      v={{
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
    <Space
      v={{
        size: 'l',
        properties: ['padding-top'],
      }}
      className="row"
    >
      <div className="container">
        <div className="grid">
          <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
            <div className="flex flex--v-center flex--h-space-between flex--wrap">
              <SectionPageHeader sectionLevelPage={true}>
                What’s on
              </SectionPageHeader>
              <div className="flex flex--v-center flex--wrap">
                {todaysOpeningHours && (
                  <div className="flex flex--v-center">
                    <Space
                      as="span"
                      h={{ size: 'm', properties: ['margin-right'] }}
                      className={font('intb', 5)}
                    >
                      Galleries
                      {todaysOpeningHours.isClosed ? ' closed ' : ' open '}
                      today
                    </Space>
                    {!todaysOpeningHours.isClosed && (
                      <>
                        <Space
                          className="flex"
                          as="span"
                          h={{ size: 's', properties: ['margin-right'] }}
                        >
                          <Icon icon={clock} />
                        </Space>
                        <Space
                          as="span"
                          h={{ size: 'm', properties: ['margin-right'] }}
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
                <NextLink href="/opening-times" as="/opening-times">
                  <a className={font('intb', 5)}>Full opening times</a>
                </NextLink>
              </div>
            </div>
          </div>
          {featuredText && featuredText.value && (
            <Space
              v={{
                size: 's',
                properties: ['margin-top', 'margin-bottom'],
              }}
              className={grid({ s: 12, m: 10, l: 8, xl: 8 })}
            >
              <FeaturedText
                html={featuredText.value}
                htmlSerializer={defaultSerializer}
              />
            </Space>
          )}
          <Space
            v={{
              size: 'm',
              properties: ['margin-top', 'margin-bottom'],
            }}
            className={grid({ s: 12, m: 10, l: 7, xl: 7 })}
          >
            <SegmentedControl
              ariaCurrentText="page"
              id="whatsOnFilter"
              activeId={activeId}
              items={segmentedControlItems}
            />
          </Space>
        </div>
      </div>
    </Space>
  );
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);

    const client = createClient(context);

    const period = context.query.period
      ? context.query.period.toString()
      : 'current-and-coming-up';

    // call prismic for specific content for section page such as featured text

    // TODO: If we're only looking up this page to get the featured text slice,
    // would it be faster to skip all the fetchLinks?  Is that possible?
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

    const basicEvents = transformQuery(
      eventsQuery,
      transformEventBasic
    ).results;

    if (period && events && exhibitions) {
      const jsonLd = [
        ...exhibitions.map(exhibitionLd),
        ...events.map(eventLd),
      ] as JsonLdObj[];

      return {
        props: removeUndefinedProps({
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

  const extraTitleText = segmentedControlItems.find(item => item.id === period);
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
      apiToolbarLinks={[
        {
          id: 'prismic',
          label: 'Prismic',
          link: `https://wellcomecollection.prismic.io/documents~b=working&c=published&l=en-gb/${prismicPageIds.whatsOn}/`,
        },
      ]}
    >
      <>
        <Header
          activeId={period}
          todaysOpeningHours={todaysOpeningHours}
          featuredText={featuredText}
        />
        <Layout12>
          <DateRange dateRange={dateRange} period={period} />
          {/* TODO put back when building, shop and cafe are open normally */}
          {/* {period === 'today' && todaysOpeningHours?.isClosed && (
            <ClosedMessage />
          )} */}
        </Layout12>
        <Space v={{ size: 'l', properties: ['margin-top'] }}>
          {period === 'current-and-coming-up' && (
            <>
              <Space v={{ size: 'l', properties: ['padding-top'] }}>
                <SpacingSection>
                  <SpacingComponent>
                    <SectionHeader title="Exhibitions" />
                  </SpacingComponent>
                  <SpacingComponent>
                    <Space v={{ size: 'xl', properties: ['margin-bottom'] }}>
                      {firstExhibition ? (
                        <Layout12>
                          <FeaturedCardExhibition
                            exhibition={firstExhibition}
                            background="warmNeutral.300"
                            textColor="black"
                          />
                        </Layout12>
                      ) : (
                        <Layout12>
                          <p data-test-id="no-exhibitions">
                            There are no current exhibitions
                          </p>
                        </Layout12>
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
                      <Layout12>
                        <p>There are no upcoming events</p>
                      </Layout12>
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
                      <Layout12>
                        <p>There are no upcoming catch up events</p>
                      </Layout12>
                    )}
                  </SpacingComponent>
                </SpacingSection>
              </Space>
            </>
          )}
          {period !== 'current-and-coming-up' && (
            <SpacingSection>
              <Space
                v={{
                  size: 'm',
                  properties: ['padding-top', 'margin-bottom'],
                }}
              >
                <Layout12>
                  <div className="flex flex--v-center flex--h-space-between">
                    <h2 className="h1">Exhibitions and Events</h2>
                    <span className={font('intb', 4)}>Free admission</span>
                  </div>
                </Layout12>
              </Space>
              <ExhibitionsAndEvents
                exhibitions={exhibitions}
                events={eventsToShow as EventBasic[]}
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
