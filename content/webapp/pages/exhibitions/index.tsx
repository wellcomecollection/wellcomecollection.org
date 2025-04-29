import type { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import {
  pageDescriptions,
  pastExhibitionsStrapline,
} from '@weco/common/data/microcopy';
import { getServerData } from '@weco/common/server-data';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { Period } from '@weco/common/types/periods';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { isFuture } from '@weco/common/utils/dates';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { getBreadcrumbItems } from '@weco/common/views/components/Breadcrumb';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import PageLayout from '@weco/common/views/components/PageLayout';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import { Container } from '@weco/common/views/components/styled/Container';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import CardGrid from '@weco/content/components/CardGrid';
import Pagination from '@weco/content/components/Pagination';
import SectionHeader from '@weco/content/components/SectionHeader';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchExhibitions } from '@weco/content/services/prismic/fetch/exhibitions';
import { transformExhibitionsQuery } from '@weco/content/services/prismic/transformers/exhibitions';
import { exhibitionLd } from '@weco/content/services/prismic/transformers/json-ld';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import { getPage } from '@weco/content/utils/query-params';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';

export type ExhibitionsProps = {
  exhibitions: PaginatedResults<ExhibitionBasic>;
  period?: Period;
  title: string;
  jsonLd: JsonLdObj[];
};

export const getServerSideProps: GetServerSideProps<
  ExhibitionsProps | AppErrorProps
> = async context => {
  setCacheControl(context.res, cacheTTL.events);

  const page = getPage(context.query);

  if (typeof page !== 'number') {
    return appError(context, 400, page.message);
  }

  const client = createClient(context);
  const { period } = context.query;

  const exhibitionsQuery = await fetchExhibitions(client, {
    page,
    period: period as Period,
  });
  const exhibitions = transformExhibitionsQuery(exhibitionsQuery);

  if (isNotUndefined(exhibitions) && exhibitions.results.length > 0) {
    const serverData = await getServerData(context);
    const title = (period === 'past' ? 'Past e' : 'E') + 'xhibitions';
    const jsonLd = exhibitions.results.map(exhibitionLd);

    return {
      props: serialiseProps({
        exhibitions,
        title,
        period: period as Period,
        jsonLd,
        serverData,
      }),
    };
  }

  return { notFound: true };
};

const ExhibitionsPage: FunctionComponent<ExhibitionsProps> = props => {
  const { exhibitions, period, title, jsonLd } = props;
  const firstExhibition = exhibitions[0];

  const partitionedExhibitionItems = exhibitions.results.reduce(
    (acc, result) => {
      if (result.end && isFuture(result.end)) {
        acc.currentAndUpcoming.push(result);
      } else {
        acc.past.push({
          ...result,
          hideStatus: true,
        });
      }
      return acc;
    },
    { currentAndUpcoming: [], past: [] } as {
      currentAndUpcoming: ExhibitionBasic[];
      past: ExhibitionBasic[];
    }
  );

  const paginationRoot = `/exhibitions${period ? `/${period}` : ''}`;

  return (
    <PageLayout
      title={title}
      description={pageDescriptions.exhibitions}
      url={{ pathname: paginationRoot }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection="whats-on"
      image={firstExhibition && firstExhibition.image}
    >
      <PageHeader
        breadcrumbs={getBreadcrumbItems('whats-on')}
        title={title}
        ContentTypeInfo={
          pageDescriptions.exhibitions && (
            <PrismicHtmlBlock
              html={[
                {
                  type: 'paragraph',
                  text: pageDescriptions.exhibitions,
                  spans: [],
                },
              ]}
            />
          )
        }
        backgroundTexture={headerBackgroundLs}
        highlightHeading={true}
      />
      {partitionedExhibitionItems.currentAndUpcoming.length > 0 && (
        <>
          <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
            <SectionHeader
              title="Current exhibitions"
              gridSize={gridSize12()}
            />
          </Space>
          <SpacingSection>
            <CardGrid
              items={partitionedExhibitionItems.currentAndUpcoming}
              itemsPerRow={3}
            />
          </SpacingSection>
        </>
      )}

      {partitionedExhibitionItems.past.length > 0 && (
        <>
          {!period && (
            <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
              <SectionHeader title="Past Exhibitions" gridSize={gridSize12()} />
              <ContaineredLayout gridSizes={gridSize12()}>
                <Space $v={{ size: 'm', properties: ['margin-top'] }}>
                  <p style={{ marginBottom: 0 }}>{pastExhibitionsStrapline}</p>
                </Space>
              </ContaineredLayout>
            </Space>
          )}
          <SpacingSection>
            <CardGrid
              items={partitionedExhibitionItems.past}
              itemsHaveTransparentBackground={true}
              itemsPerRow={3}
            />
            {exhibitions.totalPages > 1 && (
              <Container>
                <PaginationWrapper $verticalSpacing="m" $alignRight>
                  <Pagination
                    totalPages={exhibitions.totalPages}
                    ariaLabel="Exhibitions pagination"
                  />
                </PaginationWrapper>
              </Container>
            )}
          </SpacingSection>
        </>
      )}
    </PageLayout>
  );
};

export default ExhibitionsPage;
