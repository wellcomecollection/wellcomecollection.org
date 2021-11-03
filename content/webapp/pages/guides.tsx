// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// Before working on this file, please get it to typecheck,
// I have had to add this here to unblock some work
import { GetServerSideProps, NextPageContext } from 'next';
import { FunctionComponent, ReactElement } from 'react';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import LayoutPaginatedResults from '@weco/common/views/components/LayoutPaginatedResults/LayoutPaginatedResults';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SegmentedControl from '@weco/common/views/components/SegmentedControl/SegmentedControl';
import {
  getGuides,
  getGuideFormats,
} from '@weco/common/services/prismic/guides';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { Page } from '@weco/common/model/pages';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { Format } from '@weco/common/model/format';
import {
  getGlobalContextData,
  WithGlobalContextData,
} from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';

const pageDescription = 'Guides intro text...';
const displayTitle = 'Guides';

type FiltersProps = {
  currentId: string | string[] | null;
  guideFormats: Format[];
};

const Filters: FunctionComponent<FiltersProps> = ({
  currentId,
  guideFormats,
}) => {
  const items = guideFormats.map(guide => {
    return {
      id: guide.id,
      url: `/guides?format=${guide.id}`,
      text: guide.title,
    };
  });
  items.unshift({
    id: 'all',
    url: '/guides',
    text: 'All',
  });
  return (
    <Layout12>
      <SegmentedControl
        id={'guidesFilter'}
        activeId={currentId || 'all'}
        items={items}
      />
    </Layout12>
  );
};

type Props = {
  guides: PaginatedResults<Page>;
  guideFormats: Format[];
  formatId: string | string[] | null;
} & WithGlobalContextData;

const GuidePage = ({
  guides,
  guideFormats,
  formatId,
  globalContextData,
}: Props): ReactElement<Props> => {
  return (
    <PageLayout
      title={'Guides'}
      description={pageDescription}
      url={{ pathname: '/guides' }}
      jsonLd={{ '@type': 'Webpage' }}
      openGraphType={'website'}
      siteSection={'what-we-do'}
      imageUrl={undefined}
      imageAltText={undefined}
      globalContextData={globalContextData}
    >
      <SpacingSection>
        <LayoutPaginatedResults
          showFreeAdmissionMessage={false}
          title={displayTitle}
          description={[
            {
              type: 'paragraph',
              text: pageDescription,
              spans: [],
            },
          ]}
          paginatedResults={guides}
          paginationRoot={''}
        >
          <Filters currentId={formatId} guideFormats={guideFormats} />
        </LayoutPaginatedResults>
      </SpacingSection>
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  ctx: NextPageContext
) => {
  const serverData = await getServerData(context);
  const globalContextData = getGlobalContextData(ctx);
  const { format, memoizedPrismic } = ctx.query;
  const guidesPromise = getGuides(
    ctx.req,
    {
      format,
    },
    memoizedPrismic
  );
  const guideFormatsPromise = getGuideFormats(ctx.req, memoizedPrismic);

  const [guides, guideFormats] = await Promise.all([
    guidesPromise,
    guideFormatsPromise,
  ]);

  if (guides) {
    return {
      props: removeUndefinedProps({
        guides,
        guideFormats,
        formatId: format || null,
        globalContextData,
        serverData,
      }),
    };
  } else {
    return { notFound: true };
  }
};

export default GuidePage;
