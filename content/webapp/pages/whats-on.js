// @flow
import type { Context } from 'next';
import { type UiExhibition } from '@weco/common/model/exhibitions';
import { type UiEvent } from '@weco/common/model/events';
import { type Period } from '@weco/common/model/periods';
import { type PaginatedResults } from '@weco/common/services/prismic/types';
import NextLink from 'next/link';
import { Component, Fragment } from 'react';
import { classNames, font, grid, cssGrid } from '@weco/common/utils/classnames';
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
  cafePromo,
  readingRoomPromo,
  dailyTourPromo,
} from '@weco/common/data/facility-promos';
import PageLayout from '@weco/common/views/components/PageLayoutDeprecated/PageLayoutDeprecated';
import SegmentedControl from '@weco/common/views/components/SegmentedControl/SegmentedControl';
import CardGrid from '@weco/common/views/components/CardGrid/CardGrid';
import EventsByMonth from '@weco/common/views/components/EventsByMonth/EventsByMonth';
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import Icon from '@weco/common/views/components/Icon/Icon';
// $FlowFixMe (tsx)
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import ExhibitionsAndEvents from '@weco/common/views/components/ExhibitionsAndEvents/ExhibitionsAndEvents';
import FacilityPromo from '@weco/common/views/components/FacilityPromo/FacilityPromo';
// $FlowFixMe (tsx)
import OpeningTimesContext from '@weco/common/views/components/OpeningTimesContext/OpeningTimesContext';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import { exhibitionLd, eventLd } from '@weco/common/utils/json-ld';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import Space from '@weco/common/views/components/styled/Space';
import { FeaturedCardExhibition } from '@weco/common/views/components/FeaturedCard/FeaturedCard';
import { getParseCollectionVenueById } from '@weco/common/services/prismic/opening-times';
import { collectionVenueId } from '@weco/common/services/prismic/hardcoded-id';

type Props = {|
  exhibitions: PaginatedResults<UiExhibition>,
  events: PaginatedResults<UiEvent>,
  period: string,
  dateRange: any[],
  tryTheseTooPromos: any[],
  eatShopPromos: any[],
|};

function getListHeader(openingTimes: any) {
  const galleriesOpeningTimes = getParseCollectionVenueById(
    openingTimes,
    collectionVenueId.galleries.id
  );

  return {
    todayOpeningHours: getTodaysGalleriesHours(
      galleriesOpeningTimes.openingHours.id
    ),
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
  openingTimes: any, // TODO
|};
const DateRange = ({
  dateRange,
  period,
  cafePromo,
  openingTimes,
}: DateRangeProps) => {
  const fromDate = dateRange[0];
  const toDate = dateRange[1];
  // TODO: reinstate after lockdown
  // const collectionOpeningTimes =
  // openingTimes && openingTimes.collectionOpeningTimes;
  // const listHeader = getListHeader(collectionOpeningTimes);

  return (
    <Fragment>
      <Space
        v={{
          size: 's',
          properties: ['margin-bottom'],
        }}
        as="p"
        className={classNames({
          [font('hnm', 5)]: true,
        })}
      >
        {period === 'today' && (
          <time dateTime={formatDate(fromDate)}>{formatDate(fromDate)}</time>
        )}
        {period === 'this-weekend' && (
          <Fragment>
            <time dateTime={formatDate(fromDate)}>{formatDay(fromDate)}</time>
            &ndash;
            <time dateTime={formatDate(toDate)}>{formatDay(toDate)}</time>
          </Fragment>
        )}
        {period === 'current-and-coming-up' && (
          <Fragment>
            From{' '}
            <time dateTime={formatDate(fromDate)}>{formatDate(fromDate)}</time>
          </Fragment>
        )}
      </Space>
      {/* TODO: reinstate after lockdown */}
      {/* {!(listHeader.todayOpeningHours && listHeader.todayOpeningHours.opens) &&
        period === 'today' && (
          <Fragment>
            <Space
              v={{
                size: 'm',
                properties: ['margin-bottom'],
              }}
              as="p"
              className={classNames({
                [font('wb', 2)]: true,
              })}
            >
              Our exhibitions are closed today, but our{' '}
              <a href={cafePromo.url}>café</a> and{' '}
              <a href={shopPromo.url}>shop</a> are open for your visit.
            </Space>
            <Space
              v={{
                size: 'l',
                properties: ['margin-top', 'margin-bottom'],
              }}
            >
              <Divider extraClasses={'divider--dashed'} />
            </Space>
          </Fragment>
        )} */}
    </Fragment>
  );
};

type HeaderProps = {|
  activeId: string,
  openingTimes: any, // TODO
|};
const Header = ({ activeId, openingTimes }: HeaderProps) => {
  const listHeader = getListHeader(openingTimes);
  const todayOpeningHours = listHeader.todayOpeningHours;

  return (
    <Space
      v={{
        size: 'l',
        properties: ['padding-top', 'padding-bottom'],
      }}
      className={classNames({
        row: true,
        'bg-cream': true,
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
                    <Space
                      as="span"
                      h={{ size: 'm', properties: ['margin-right'] }}
                      className={classNames({
                        [font('hnm', 5)]: true,
                      })}
                    >
                      Galleries
                      {todayOpeningHours.opens ? ' open ' : ' closed '}
                      today
                    </Space>
                    {todayOpeningHours.opens && (
                      <Fragment>
                        <Space
                          as="span"
                          h={{ size: 's', properties: ['margin-right'] }}
                        >
                          <Icon name={'clock'} />
                        </Space>
                        <Space
                          as="span"
                          h={{ size: 'm', properties: ['margin-right'] }}
                          className={classNames({
                            [font('hnl', 5)]: true,
                          })}
                        >
                          <Fragment>
                            <time>{todayOpeningHours.opens}</time>
                            {'—'}
                            <time>{todayOpeningHours.closes}</time>
                          </Fragment>
                        </Space>
                      </Fragment>
                    )}
                  </div>
                )}
                <NextLink href={`/opening-times`} as={`/opening-times`}>
                  <a
                    className={classNames({
                      [font('hnm', 5)]: true,
                    })}
                  >{`Full opening times`}</a>
                </NextLink>
              </div>
            </div>
          </div>
          <Space
            v={{
              size: 'm',
              properties: ['margin-top', 'margin-bottom'],
            }}
            className={classNames({
              [grid({ s: 12, m: 10, l: 8, xl: 6 })]: true,
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
          </Space>
        </div>
      </div>
    </Space>
  );
};

const pageDescription =
  'Discover all of the exhibitions, events and more on offer at Wellcome Collection, a free museum and library exploring health and human experience.';
export class WhatsOnPage extends Component<Props> {
  static getInitialProps = async (ctx: Context) => {
    const period = ctx.query.period || 'current-and-coming-up';
    const { memoizedPrismic } = ctx.query;
    const exhibitionsPromise = getExhibitions(
      ctx.req,
      {
        period,
        order: 'asc',
      },
      memoizedPrismic
    );
    const eventsPromise = getEvents(
      ctx.req,
      {
        period: 'current-and-coming-up',
        pageSize: 100,
      },
      memoizedPrismic
    );

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
        eatShopPromos: [cafePromo],
        cafePromo,
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
              <Space v={{ size: 'l', properties: ['margin-top'] }}>
                {period === 'current-and-coming-up' && (
                  <Fragment>
                    <Space v={{ size: 'l', properties: ['padding-top'] }}>
                      <SpacingSection>
                        <Layout12>
                          <DateRange
                            dateRange={dateRange}
                            period={period}
                            cafePromo={eatShopPromos[0]}
                            openingTimes={openingTimes}
                          />
                          <div className="flex flex--v-center flex--h-space-between">
                            <h2 className="h1">Exhibitions</h2>
                            <span className={font('hnm', 5)}>
                              Free admission
                            </span>
                          </div>
                        </Layout12>
                        <Space
                          v={{ size: 'xl', properties: ['margin-bottom'] }}
                        >
                          {firstExhibition ? (
                            <Layout12>
                              <FeaturedCardExhibition
                                exhibition={firstExhibition}
                                background={'cream'}
                                color={'black'}
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
                          <SectionHeader title={'Events'} />
                        </SpacingComponent>
                        <SpacingComponent>
                          {events.length > 0 ? (
                            <EventsByMonth
                              events={events}
                              links={[
                                { text: 'View all events', url: '/events' },
                              ]}
                            />
                          ) : (
                            <Layout12>
                              <p>There are no upcoming events</p>
                            </Layout12>
                          )}
                        </SpacingComponent>
                      </SpacingSection>
                    </Space>
                  </Fragment>
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
                        <DateRange
                          dateRange={dateRange}
                          period={period}
                          cafePromo={eatShopPromos[0]}
                          openingTimes={openingTimes}
                        />
                        <div className="flex flex--v-center flex--h-space-between">
                          <h2 className="h1">Exhibitions and Events</h2>
                          <span className={font('hnm', 4)}>Free admission</span>
                        </div>
                      </Layout12>
                    </Space>
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
              </Space>

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
                        <div className="css-grid grid--scroll card-theme card-theme--transparent">
                          {tryTheseTooPromos
                            .concat(eatShopPromos)
                            .map(promo => (
                              <div
                                key={promo.id}
                                className={cssGrid({
                                  s: 12,
                                  m: 6,
                                  l: 4,
                                  xl: 4,
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
