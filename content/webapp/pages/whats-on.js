// @flow
import type { Context } from 'next';
import NextLink from 'next/link';
import { Component, Fragment } from 'react';
import {
  classNames,
  font,
  spacing,
  grid,
  cssGrid,
} from '@weco/common/utils/classnames';
import { getExhibitions } from '@weco/common/services/prismic/exhibitions';
import {
  getEvents,
  filterEventsForToday,
  filterEventsForWeekend,
} from '@weco/common/services/prismic/events';
import { london, formatDay, formatDate } from '@weco/common/utils/format-date';
import { convertJsonToDates } from './event';
import { getTodaysGalleriesHours } from '@weco/common/utils/get-todays-galleries-hours';
import {
  shopPromo,
  cafePromo,
  readingRoomPromo,
  restaurantPromo,
  dailyTourPromo,
} from '@weco/common/data/facility-promos';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import SegmentedControl from '@weco/common/views/components/SegmentedControl/SegmentedControl';
import CardGrid from '@weco/common/views/components/CardGrid/CardGrid';
import EventsByMonth from '@weco/common/views/components/EventsByMonth/EventsByMonth';
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import Icon from '@weco/common/views/components/Icon/Icon';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import ExhibitionsAndEvents from '@weco/common/views/components/ExhibitionsAndEvents/ExhibitionsAndEvents';
import FacilityPromo from '@weco/common/views/components/FacilityPromo/FacilityPromo';
import Divider from '@weco/common/views/components/Divider/Divider';
import OpeningTimesContext from '@weco/common/views/components/OpeningTimesContext/OpeningTimesContext';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import { exhibitionLd, eventLd } from '@weco/common/utils/json-ld';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { type UiExhibition } from '@weco/common/model/exhibitions';
import { type UiEvent } from '@weco/common/model/events';
import { type Period } from '@weco/common/model/periods';
import { type PaginatedResults } from '@weco/common/services/prismic/types';

type Props = {|
  exhibitions: PaginatedResults<UiExhibition>,
  events: PaginatedResults<UiEvent>,
  period: string,
  dateRange: any[],
  tryTheseTooPromos: any[],
  eatShopPromos: any[],
|};

function getListHeader(collectionOpeningTimes: any = {}) {
  const galleriesOpeningTimes =
    collectionOpeningTimes.placesOpeningHours.length > 1 &&
    collectionOpeningTimes.placesOpeningHours.find(
      venue => venue.name === 'Galleries'
    ).openingHours;
  return {
    todayOpeningHours: getTodaysGalleriesHours(galleriesOpeningTimes),
    name: "What's on",
    items: [
      {
        id: 'everything',
        title: 'Everything',
        url: `/whats-on`,
      },
      {
        id: 'today',
        title: 'Today',
        url: `/whats-on/today`,
      },
      {
        id: 'the-weekend',
        title: 'This weekend',
        url: `/whats-on/the-weekend`,
      },
    ],
  };
}

export function getMomentsForPeriod(period: Period) {
  const todaysDate = london();
  const todaysDatePlusSix = todaysDate.clone().add(6, 'days');

  switch (period) {
    case 'today':
      return [todaysDate.startOf('day'), todaysDate.endOf('day')];
    case 'this-weekend':
      return [getWeekendFromDate(todaysDate), getWeekendToDate(todaysDate)];
    // FIXME: this isn't really 'this week', but the 'next seven days' (needs UX/content rethink?)
    case 'this-week':
      return [todaysDate.startOf('day'), todaysDatePlusSix.endOf('day')];
    default:
      return [todaysDate.startOf('day'), undefined];
  }
}

function getWeekendFromDate(today) {
  const todayInteger = today.day(); // day() return Sun as 0, Sat as 6
  if (todayInteger !== 0) {
    return london(today).day(5);
  } else {
    return london(today).day(-2);
  }
}

function getWeekendToDate(today) {
  const todayInteger = today.day(); // day() return Sun as 0, Sat as 6
  if (todayInteger === 0) {
    return london(today);
  } else {
    return london(today).day(7);
  }
}
type DateRangeProps = {|
  dateRange: any,
  period: string,
  cafePromo: any,
  shopPromo: any,
  openingTimes: any, // TODO
|};
const DateRange = ({
  dateRange,
  period,
  cafePromo,
  shopPromo,
  openingTimes,
}: DateRangeProps) => {
  const fromDate = dateRange[0];
  const toDate = dateRange[1];
  const collectionOpeningTimes =
    openingTimes && openingTimes.collectionOpeningTimes;
  const listHeader = getListHeader(collectionOpeningTimes);

  return (
    <Fragment>
      <p
        className={classNames({
          [font({ s: 'HNM4', m: 'HNM4' })]: true,
          [spacing({ s: 0 }, { margin: ['top'] })]: true,
          [spacing({ s: 1 }, { margin: ['bottom'] })]: true,
        })}
      >
        {period === 'today' && (
          <time dateTime={fromDate}>{formatDate(fromDate)}</time>
        )}
        {period === 'this-weekend' && (
          <Fragment>
            <time dateTime={fromDate}>{formatDay(fromDate)}</time>
            &ndash;
            <time dateTime={toDate}>{formatDay(toDate)}</time>
          </Fragment>
        )}
        {period === 'current-and-coming-up' && (
          <Fragment>
            From <time dateTime={fromDate}>{formatDate(fromDate)}</time>
          </Fragment>
        )}
      </p>
      {!(listHeader.todayOpeningHours && listHeader.todayOpeningHours.opens) &&
        period === 'today' && (
          <Fragment>
            <p
              className={classNames({
                [font({ s: 'WB6', m: 'WB5', l: 'WB4' })]: true,
                [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
              })}
            >
              Our exhibitions are closed today, but our{' '}
              <a href={cafePromo.url}>café</a> and{' '}
              <a href={shopPromo.url}>shop</a> are open for your visit.
            </p>
            <div
              className={classNames({
                [spacing(
                  { s: 3, m: 4, l: 5 },
                  { margin: ['top', 'bottom'] }
                )]: true,
              })}
            >
              <Divider extraClasses={'divider--dashed'} />
            </div>
          </Fragment>
        )}
    </Fragment>
  );
};

type HeaderProps = {|
  activeId: string,
  openingTimes: any, // TODO
|};
const Header = ({ activeId, openingTimes }: HeaderProps) => {
  const collectionOpeningTimes =
    openingTimes && openingTimes.collectionOpeningTimes;
  const listHeader = getListHeader(collectionOpeningTimes);
  const todayOpeningHours = listHeader.todayOpeningHours;

  return (
    <div
      className={classNames({
        row: true,
        'bg-cream': true,
        [spacing({ s: 3, m: 5, l: 5 }, { padding: ['top', 'bottom'] })]: true,
      })}
    >
      <div className="container">
        <div className="grid">
          <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
            <div className="flex flex--v-center flex--h-space-between flex--wrap">
              <div>
                <h1 className="inline h1">What{`'`}s on</h1>
              </div>
              <div className="flex flex--v-center flex--wrap">
                {todayOpeningHours && (
                  <div className="flex flex--v-center">
                    <span
                      className={classNames({
                        [font({ s: 'HNM5', m: 'HNM4' })]: true,
                        [spacing({ s: 2 }, { margin: ['right'] })]: true,
                      })}
                    >
                      Galleries
                      {todayOpeningHours.opens ? ' open ' : ' closed '}
                      today
                    </span>
                    {todayOpeningHours.opens && (
                      <Fragment>
                        <Icon name={'clock'} extraClasses={'margin-right-s1'} />
                        <span
                          className={classNames({
                            [font({ s: 'HNL5', m: 'HNL4' })]: true,
                            [spacing({ s: 2 }, { margin: ['right'] })]: true,
                          })}
                        >
                          <Fragment>
                            <time>{todayOpeningHours.opens}</time>
                            {'—'}
                            <time>{todayOpeningHours.closes}</time>
                          </Fragment>
                        </span>
                      </Fragment>
                    )}
                  </div>
                )}
                <NextLink href={`/opening-times`} as={`/opening-times`}>
                  <a
                    className={classNames({
                      [font({ s: 'HNM5', m: 'HNM4' })]: true,
                    })}
                  >{`Full opening times`}</a>
                </NextLink>
              </div>
            </div>
          </div>
          <div
            className={classNames({
              [grid({ s: 12, m: 10, l: 8, xl: 6 })]: true,
              [spacing({ s: 2 }, { margin: ['top', 'bottom'] })]: true,
            })}
          >
            <SegmentedControl
              id={'whatsOnFilter'}
              activeId={activeId}
              items={[
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
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const pageDescription =
  'Discover all of the exhibitions, events and more on offer at Wellcome Collection, the free museum and library for the incurably curious.';
export class WhatsOnPage extends Component<Props> {
  static getInitialProps = async (ctx: Context) => {
    const period = ctx.query.period || 'current-and-coming-up';
    const exhibitionsPromise = getExhibitions(ctx.req, {
      period,
      order: 'asc',
    });
    const eventsPromise = getEvents(ctx.req, {
      period: 'current-and-coming-up',
      pageSize: 100,
    });

    const [exhibitions, events] = await Promise.all([
      exhibitionsPromise,
      eventsPromise,
    ]);
    const dateRange = getMomentsForPeriod(period);

    if (period && events && exhibitions) {
      return {
        period,
        exhibitions,
        events,
        dateRange,
        tryTheseTooPromos: [readingRoomPromo],
        eatShopPromos: [shopPromo, cafePromo, restaurantPromo],
        cafePromo,
        shopPromo,
        dailyTourPromo,
      };
    } else {
      return { statusCode: 404 };
    }
  };

  render() {
    const { period, dateRange, tryTheseTooPromos, eatShopPromos } = this.props;

    const events = this.props.events.results.map(convertJsonToDates);
    const exhibitions = this.props.exhibitions.results.map(exhibition => {
      return {
        start: exhibition.start && new Date(exhibition.start),
        end: exhibition.end && new Date(exhibition.end),
        ...exhibition,
      };
    });
    const firstExhibition = exhibitions[0];

    return (
      <PageLayout
        title={`What's on`}
        description={pageDescription}
        url={{ pathname: `/whats-on` }}
        jsonLd={[...exhibitions.map(exhibitionLd), ...events.map(eventLd)]}
        openGraphType={'website'}
        siteSection={'whats-on'}
        imageUrl={
          firstExhibition &&
          firstExhibition.image &&
          convertImageUri(firstExhibition.image.contentUrl, 800)
        }
        imageAltText={
          firstExhibition && firstExhibition.image && firstExhibition.image.alt
        }
      >
        <OpeningTimesContext.Consumer>
          {openingTimes => (
            <Fragment>
              <Header activeId={period} openingTimes={openingTimes} />

              <div
                className={classNames({
                  [spacing({ s: 2, m: 4 }, { margin: ['top'] })]: true,
                })}
              >
                {period === 'current-and-coming-up' && (
                  <Fragment>
                    <div
                      className={classNames({
                        [spacing(
                          { s: 3, m: 5, l: 5 },
                          { margin: ['top'] }
                        )]: true,
                      })}
                    >
                      <SpacingSection>
                        <Layout12>
                          <DateRange
                            dateRange={dateRange}
                            period={period}
                            cafePromo={eatShopPromos[0]}
                            shopPromo={eatShopPromos[1]}
                            openingTimes={openingTimes}
                          />
                          <div className="flex flex--v-center flex--h-space-between">
                            <h2 className="h1">Exhibitions</h2>
                            <span className={font({ s: 'HNM5', m: 'HNM4' })}>
                              Free admission
                            </span>
                          </div>
                        </Layout12>

                        <CardGrid
                          items={exhibitions}
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
                          <SectionHeader title={'Events'} />
                        </SpacingComponent>
                        <SpacingComponent>
                          <EventsByMonth events={events} />
                        </SpacingComponent>
                      </SpacingSection>
                    </div>
                  </Fragment>
                )}
                {period !== 'current-and-coming-up' && (
                  <SpacingSection>
                    <div
                      className={classNames({
                        [spacing(
                          { s: 3, m: 5, l: 5 },
                          { margin: ['top'] }
                        )]: true,
                        [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
                      })}
                    >
                      <Layout12>
                        <div
                          className={classNames({
                            [spacing(
                              { s: 0 },
                              { margin: ['top', 'bottom'] }
                            )]: true,
                          })}
                        >
                          <DateRange
                            dateRange={dateRange}
                            period={period}
                            cafePromo={eatShopPromos[0]}
                            shopPromo={eatShopPromos[1]}
                            openingTimes={openingTimes}
                          />
                          <div className="flex flex--v-center flex--h-space-between">
                            <h2 className="h1">Exhibitions and Events</h2>
                            <span className={font({ s: 'HNM5', m: 'HNM4' })}>
                              Free admission
                            </span>
                          </div>
                        </div>
                      </Layout12>
                    </div>
                    <ExhibitionsAndEvents
                      exhibitions={exhibitions}
                      events={
                        period === 'today'
                          ? filterEventsForToday(events)
                          : period === 'this-weekend'
                          ? filterEventsForWeekend(events)
                          : events
                      }
                      links={[
                        { text: 'View all exhibitions', url: '/exhibitions' },
                        { text: 'View all events', url: '/events' },
                      ]}
                    />
                  </SpacingSection>
                )}
              </div>

              <SpacingSection>
                <SpacingComponent>
                  <SectionHeader title="Try these too" />
                </SpacingComponent>
                <SpacingComponent>
                  <div className="css-grid__container">
                    <div
                      className={classNames({
                        'css-grid': true,
                      })}
                    >
                      <div
                        className={classNames({
                          'css-grid__scroll-container container--scroll touch-scroll': true,
                          [cssGrid({ s: 12, m: 12, l: 12, xl: 12 })]: true,
                        })}
                      >
                        <div className="css-grid grid--scroll">
                          {tryTheseTooPromos
                            .concat(eatShopPromos)
                            .map(promo => (
                              <div
                                key={promo.id}
                                className={cssGrid({
                                  s: 12,
                                  m: 6,
                                  l: 3,
                                  xl: 3,
                                })}
                              >
                                <FacilityPromo
                                  id={promo.id}
                                  title={promo.title}
                                  url={promo.url}
                                  description={promo.description}
                                  imageProps={promo.image}
                                  metaText={promo.metaText}
                                  metaIcon={promo.metaIcon}
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </SpacingComponent>
              </SpacingSection>
            </Fragment>
          )}
        </OpeningTimesContext.Consumer>
      </PageLayout>
    );
  }
}

export default WhatsOnPage;
