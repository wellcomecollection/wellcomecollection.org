import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';
import Head from 'next/head';
import * as prismic from '@prismicio/client';
import { SeriesBasic } from '@weco/content/types/series';
import type { PaginatedResults } from '@weco/common/services/prismic/types';
import { createClient } from '@weco/content/services/prismic/fetch';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import LayoutPaginatedResults from '@weco/content/components/LayoutPaginatedResults/LayoutPaginatedResults';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { getPage } from '@weco/content/utils/query-params';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { fetchSeries } from '@weco/content/services/prismic/fetch/series';
import {
  transformSeries,
  transformSeriesToSeriesBasic,
} from '@weco/content/services/prismic/transformers/series';
import { ArticleFormatIds } from '@weco/content/data/content-format-ids';
import { articleSeriesLd } from '@weco/content/services/prismic/transformers/json-ld';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

const contentTypes = ['comic'] as const;
type ContentType = (typeof contentTypes)[number];

type Props = {
  title: string;
  contentType: ContentType;
  series: PaginatedResults<SeriesBasic>;
  jsonLd: JsonLdObj[];
};

type ContentTypeIdAndTitle = {
  id: string;
  title: string;
};

function getContentTypeId(type: ContentType): ContentTypeIdAndTitle {
  switch (type) {
    case 'comic':
      return {
        id: ArticleFormatIds.Comic,
        title: 'Comics',
      };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isContentType(x: any): x is ContentType {
  return contentTypes.includes(x);
}

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const page = getPage(context.query);

  if (typeof page !== 'number') {
    return appError(context, 400, page.message);
  }

  const { contentType } = context.query;

  if (isContentType(contentType)) {
    const serverData = await getServerData(context);
    const contentTypeInfo = getContentTypeId(contentType);

    const client = createClient(context);
    const seriesQuery = await fetchSeries(client, {
      filters: prismic.filter.at('my.series.format', contentTypeInfo.id),
      page,
      orderings: [
        {
          field: 'document.first_publication_date',
          direction: 'desc',
        },
      ],
    });
    const series = transformQuery(seriesQuery, transformSeries);
    const basicSeries = {
      ...series,
      results: series.results.map(transformSeriesToSeriesBasic),
    };

    const jsonLd = series.results.map(articleSeriesLd);

    return {
      props: serialiseProps({
        title: contentTypeInfo.title,
        contentType,
        series: basicSeries,
        jsonLd,
        serverData,
      }),
    };
  }

  return { notFound: true };
};

const ArticleSeriesManyPage: FunctionComponent<Props> = ({
  title,
  contentType,
  series,
  jsonLd,
}: Props) => {
  const image = series.results[0]?.image;

  return (
    <>
      {/* TODO: remove this when we're sure we've got the right route  */}
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <PageLayout
        title={title}
        description={pageDescriptions[contentType]}
        url={{ pathname: '/series' }}
        jsonLd={jsonLd}
        openGraphType="website"
        siteSection="stories"
        image={image}
      >
        <SpacingSection>
          <LayoutPaginatedResults
            title={title}
            description={pageDescriptions[contentType]}
            paginatedResults={series}
          />
        </SpacingSection>
      </PageLayout>
    </>
  );
};

export default ArticleSeriesManyPage;
