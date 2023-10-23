import type { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { Period } from '@weco/common/types/periods';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { visualStoryLd } from '@weco/content/services/prismic/transformers/json-ld';
import { getPage } from '@weco/content/utils/query-params';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { createClient } from '@weco/content/services/prismic/fetch';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import CardGrid from '@weco/content/components/CardGrid/CardGrid';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import Pagination from '@weco/content/components/Pagination/Pagination';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';
import { fetchVisualStories } from 'services/prismic/fetch/visual-stories';
import { transformVisualStories } from 'services/prismic/transformers/visual-stories';
import { VisualStory } from '@weco/content/types/visual-stories';
import { Container } from 'components/WorksSearchResult/WorksSearchResult.styles';

export type VisualStoriesProps = {
  visualStories: PaginatedResults<VisualStory>;
  title: string;
  jsonLd: JsonLdObj[];
};

export const getServerSideProps: GetServerSideProps<
  VisualStoriesProps | AppErrorProps
> = async context => {
  setCacheControl(context.res, cacheTTL.events);
  const serverData = await getServerData(context);
  const client = createClient(context);

  const page = getPage(context.query);
  if (typeof page !== 'number') {
    return appError(context, 400, page.message);
  }

  const { period } = context.query;

  const visualStoriesQuery = await fetchVisualStories(client, {
    page,
    hasDelistFilter: false,
  });
  const visualStories = transformVisualStories(visualStoriesQuery);

  if (visualStories && visualStories.results.length > 0) {
    const title = (period === 'past' ? 'Past v' : 'V') + 'isual stories';
    const jsonLd = visualStories.results.map(visualStoryLd);
    return {
      props: serialiseProps({
        visualStories,
        title,
        period: period as Period,
        jsonLd,
        serverData,
      }),
    };
  } else {
    return { notFound: true };
  }
};

// TODO consider how ordering would work
const VisualStoriesPage: FunctionComponent<VisualStoriesProps> = props => {
  const { visualStories, title, jsonLd } = props;

  return (
    <PageLayout
      title={title}
      description={pageDescriptions.visualStories}
      url={{ pathname: '/visual-stories' }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection={undefined} // TODO
    >
      <PageHeader
        breadcrumbs={{ items: [] }}
        title={title}
        ContentTypeInfo={
          pageDescriptions.visualStories && (
            <PrismicHtmlBlock
              html={[
                {
                  type: 'paragraph',
                  text: pageDescriptions.visualStories,
                  spans: [],
                },
              ]}
            />
          )
        }
        backgroundTexture={headerBackgroundLs}
        highlightHeading={true}
      />

      <SpacingSection>
        <CardGrid items={visualStories.results} itemsPerRow={3} />
        {visualStories.totalPages > 1 && (
          <Container>
            <PaginationWrapper verticalSpacing="m" alignRight>
              <Pagination
                totalPages={visualStories.totalPages}
                ariaLabel="Visual stories pagination"
              />
            </PaginationWrapper>
          </Container>
        )}
      </SpacingSection>
    </PageLayout>
  );
};

export default VisualStoriesPage;
