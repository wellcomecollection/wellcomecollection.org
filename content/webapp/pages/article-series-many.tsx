import { SeriesBasic } from '../types/series';
import type { PaginatedResults } from '@weco/common/services/prismic/types';
import { createClient } from '../services/prismic/fetch';
import { transformQuery } from '../services/prismic/transformers/paginated-results';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import LayoutPaginatedResults from '../components/LayoutPaginatedResults/LayoutPaginatedResults';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { getPage } from '../utils/query-params';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { fetchSeries } from 'services/prismic/fetch/series';
import {
  transformSeries,
  transformSeriesToSeriesBasic,
} from 'services/prismic/transformers/series';

type Props = {
  series: PaginatedResults<SeriesBasic>;
  jsonLd: JsonLdObj[];
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const page = getPage(context.query);

    if (typeof page !== 'number') {
      return appError(context, 400, page.message);
    }

    const client = createClient(context);
    // TODO: ordering
    const seriesQuery = await fetchSeries(client, { page });
    const series = transformQuery(seriesQuery, transformSeries);
    const basicSeries = {
      ...series,
      results: series.results.map(transformSeriesToSeriesBasic),
    };

    // TODO: seriesLd
    // TODO: image for openGraph etc.

    const serverData = await getServerData(context);

    return {
      props: removeUndefinedProps({
        series: basicSeries,
        jsonLd: [],
        serverData,
      }),
    };
  };

const ArticleSeriesManyPage: FunctionComponent<Props> = ({
  series,
  jsonLd,
}: Props) => {
  return (
    <PageLayout
      title="Series"
      description={pageDescriptions.series}
      url={{ pathname: '/series' }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection="stories"
      image={undefined}
    >
      <SpacingSection>
        <LayoutPaginatedResults
          showFreeAdmissionMessage={false}
          title="Series"
          description={[
            {
              type: 'paragraph',
              text: pageDescriptions.series,
              spans: [],
            },
          ]}
          paginatedResults={series}
          paginationRoot="/series"
        />
      </SpacingSection>
    </PageLayout>
  );
};

export default ArticleSeriesManyPage;
