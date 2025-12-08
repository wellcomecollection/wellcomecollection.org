import { NextPage } from 'next';

import linkResolver from '@weco/common/services/prismic/link-resolver';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { font } from '@weco/common/utils/classnames';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import HeaderBackground from '@weco/common/views/components/HeaderBackground';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import PageHeader from '@weco/common/views/components/PageHeader';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space from '@weco/common/views/components/styled/Space';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { EventSeries } from '@weco/content/types/event-series';
import { EventBasic } from '@weco/content/types/events';
import { getFeaturedMedia } from '@weco/content/utils/page-header';
import Body from '@weco/content/views/components/Body';
import ContentPage from '@weco/content/views/components/ContentPage';
import Pagination from '@weco/content/views/components/Pagination';
import SearchResults from '@weco/content/views/components/SearchResults';

export type Props = {
  series: EventSeries;
  jsonLd: JsonLdObj[];
  pastEvents: PaginatedResults<EventBasic>;
  upcomingEvents: EventBasic[];
  page: number;
};

const EventSeriesPage: NextPage<Props> = ({
  series,
  jsonLd,
  pastEvents,
  upcomingEvents,
  page,
}) => {
  const breadcrumbs = {
    items: [
      {
        url: '/events',
        text: 'Events',
      },
      {
        url: linkResolver(series),
        text: series.title,
        isHidden: true,
      },
    ],
  };

  const FeaturedMedia = getFeaturedMedia(series);
  const Header = (
    <PageHeader
      variant="basic"
      breadcrumbs={breadcrumbs}
      labels={{ labels: series.labels }}
      title={series.title}
      Background={<HeaderBackground hasWobblyEdge={true} />}
      FeaturedMedia={FeaturedMedia}
    />
  );

  return (
    <PageLayout
      title={series.title}
      description={series.metadataDescription || series.promo?.caption || ''}
      url={{ pathname: `/event-series/${series.uid}` }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection="whats-on"
      image={series.image}
      apiToolbarLinks={[createPrismicLink(series.id)]}
    >
      <ContentPage
        id={series.id}
        uid={series.uid}
        Header={Header}
        Body={
          page === 1 ? (
            <Body
              untransformedBody={series.untransformedBody}
              pageId={series.id}
              pageUid={series.uid}
            />
          ) : undefined
        }
        contributors={series.contributors}
      >
        {page === 1 && (
          <>
            {upcomingEvents.length > 0 ? (
              <SearchResults
                variant="default"
                items={upcomingEvents}
                title="Coming up"
              />
            ) : (
              <h2 className={font('brand', 1)}>No upcoming events</h2>
            )}
          </>
        )}

        {pastEvents.results.length > 0 && (
          <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
            <SearchResults
              variant="default"
              items={pastEvents.results}
              title="Past events"
            />
          </Space>
        )}
        {pastEvents.totalPages > 1 && (
          <PaginationWrapper $verticalSpacing="m" $alignRight>
            <Pagination
              totalPages={pastEvents.totalPages}
              ariaLabel="Series pagination"
            />
          </PaginationWrapper>
        )}
      </ContentPage>
    </PageLayout>
  );
};

export default EventSeriesPage;
