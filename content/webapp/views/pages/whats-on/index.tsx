import { NextPage } from 'next';

import {
  collectionVenueId,
  prismicPageIds,
} from '@weco/common/data/hardcoded-ids';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { usePrismicData } from '@weco/common/server-data/Context';
import {
  getTodaysVenueHours,
  getVenueById,
} from '@weco/common/services/prismic/opening-times';
import { transformCollectionVenues } from '@weco/common/services/prismic/transformers/collection-venues';
import { Period } from '@weco/common/types/periods';
import { font } from '@weco/common/utils/classnames';
import AccessibilityProvision from '@weco/common/views/components/AccessibilityProvision';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import {
  filterEventsForToday,
  filterEventsForWeekend,
} from '@weco/content/services/prismic/events';
import { enrichTryTheseTooPromos } from '@weco/content/services/prismic/transformers/whats-on';
import { EventBasic } from '@weco/content/types/events';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import { FacilityCard as FacilityCardType } from '@weco/content/types/facility';
import { FeaturedText as FeaturedTextType } from '@weco/content/types/text';
import CardGrid from '@weco/content/views/components/CardGrid';
import ExhibitionsAndEvents from '@weco/content/views/components/ExhibitionsAndEvents';
import FeaturedCard from '@weco/content/views/components/FeaturedCard';
import SectionHeader from '@weco/content/views/components/SectionHeader';

import ClosedMessage from './whats-on.ClosedMessage';
import DateRange from './whats-on.DateRange';
import EventsByMonth from './whats-on.EventsByMonth';
import FacilityCard from './whats-on.FacilityCard';
import Header from './whats-on.Header';

export const tabItems = [
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
  tryTheseToo: FacilityCardType[];
  jsonLd: JsonLdObj[];
};

const WhatsOnPage: NextPage<Props> = props => {
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
                      <span className={font('intb', 0)}>Free admission</span>
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
            <Container>
              <Grid className="card-theme card-theme--transparent">
                {tryTheseToo.map(promo => (
                  <GridCell
                    key={promo.id}
                    $sizeMap={{
                      s: [12],
                      m: [6],
                      l: [4],
                      xl: [4],
                    }}
                  >
                    <FacilityCard {...promo} />
                  </GridCell>
                ))}
              </Grid>
            </Container>
          </SpacingComponent>
        </SpacingSection>
      </>
    </PageLayout>
  );
};

export default WhatsOnPage;
