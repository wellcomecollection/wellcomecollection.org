import { FC } from 'react';
import { getEvents } from '@weco/common/services/prismic/events';
import { orderEventsByNextAvailableDate } from '../services/prismic/events';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import LayoutPaginatedResults from '../components/LayoutPaginatedResults/LayoutPaginatedResults';
import type { UiEvent } from '@weco/common/model/events';
import type { PaginatedResults } from '@weco/common/services/prismic/types';
import type { Period } from '@weco/common/model/periods';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { convertJsonToDates } from './event';
import MoreLink from '@weco/common/views/components/MoreLink/MoreLink';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import Space from '@weco/common/views/components/styled/Space';
import { GetServerSideProps } from 'next';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { eventLd } from '../services/prismic/transformers/json-ld';

type Props = {
  displayTitle: string;
  events: PaginatedResults<UiEvent>;
  period?: Period;
};

const pageDescription =
  'Our events are now taking place online. Choose from an inspiring range of free talks, discussions and more.';

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const {
      page = 1,
      memoizedPrismic,
      period = 'current-and-coming-up',
      isOnline,
      availableOnline,
    } = context.query;

    const events = await getEvents(
      context.req,
      {
        page,
        period,
        pageSize: 100,
        isOnline: isOnline === 'true',
        availableOnline: availableOnline === 'true',
      },
      memoizedPrismic
    );

    if (events) {
      const title = (period === 'past' ? 'Past e' : 'E') + 'vents';
      return {
        props: removeUndefinedProps({
          events,
          title,
          period,
          displayTitle: title,
          serverData,
        }),
      };
    } else {
      return { notFound: true };
    }
  };

const EventsPage: FC<Props> = props => {
  const { events, displayTitle, period } = props;
  const convertedEvents = events.results.map(convertJsonToDates);
  const convertedPaginatedResults = {
    ...events,
    results:
      period !== 'past'
        ? orderEventsByNextAvailableDate(convertedEvents)
        : convertedEvents,
  } as PaginatedResults<UiEvent>;
  const firstEvent = events.results[0];
  return (
    <PageLayout
      title={displayTitle}
      description={pageDescription}
      url={{ pathname: `/events${period ? `/${period}` : ''}` }}
      jsonLd={events.results.flatMap(eventLd)}
      openGraphType={'website'}
      siteSection={'whats-on'}
      imageUrl={
        firstEvent &&
        firstEvent.image &&
        convertImageUri(firstEvent.image.contentUrl, 800)
      }
      imageAltText={
        (firstEvent && firstEvent.image && firstEvent.image.alt) ?? undefined
      }
    >
      <SpacingSection>
        <LayoutPaginatedResults
          showFreeAdmissionMessage={true}
          title={displayTitle}
          description={[
            {
              type: 'paragraph',
              text: pageDescription,
              spans: [],
            },
          ]}
          paginatedResults={convertedPaginatedResults}
          paginationRoot={`events${period ? `/${period}` : ''}`}
        />
        {period === 'current-and-coming-up' && (
          <Layout12>
            <Space v={{ size: 'm', properties: ['margin-top'] }}>
              <MoreLink url={`/events/past`} name={`View past events`} />
            </Space>
          </Layout12>
        )}
      </SpacingSection>
    </PageLayout>
  );
};

export default EventsPage;
