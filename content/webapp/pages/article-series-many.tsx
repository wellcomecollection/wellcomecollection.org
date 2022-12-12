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
import { ArticleFormatIds } from '@weco/common/data/content-format-ids';

type ContentType = 'comic';

type Props = {
  title: string;
  contentType: ContentType;
  series: PaginatedResults<SeriesBasic>;
  jsonLd: JsonLdObj[];
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const page = getPage(context.query);
    const { contentType } = context.query;
    const contentTypes = ['comic'];

    if (
      typeof contentType !== 'string' ||
      !contentTypes.includes(contentType)
    ) {
      return { notFound: true };
    }

    const contentTypeInfo = getContentTypeId(contentType);

    type SeriesIdAndTitle = {
      id: string;
      title: string;
    };

    function getContentTypeId(type: ContentType): SeriesIdAndTitle {
      switch (type) {
        case 'comic':
          return {
            id: ArticleFormatIds.Comic,
            title: 'Comics',
          };
      }
    }

    if (typeof page !== 'number') {
      return appError(context, 400, page.message);
    }

    const client = createClient(context);
    // TODO: ordering
    const seriesQuery = await fetchSeries(client, {
      predicates: [`[at(my.series.format, "${contentTypeInfo.id}")]`],
      page,
      orderings: {
        field: 'document.first_publication_date',
        direction: 'desc',
      },
    });
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
        title: contentTypeInfo.title,
        contentType,
        series: basicSeries,
        jsonLd: [],
        serverData,
      }),
    };
  };

const ArticleSeriesManyPage: FunctionComponent<Props> = ({
  title,
  contentType,
  series,
  jsonLd,
}: Props) => {
  return (
    <PageLayout
      title={title}
      description={pageDescriptions[contentType]}
      url={{ pathname: '/series' }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection="stories"
      image={undefined}
    >
      <SpacingSection>
        <LayoutPaginatedResults
          showFreeAdmissionMessage={false}
          title={title}
          description={[
            {
              type: 'paragraph',
              text: pageDescriptions[contentType],
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
