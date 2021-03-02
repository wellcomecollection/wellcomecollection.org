import { NextPageContext } from 'next';
import { FunctionComponent, ReactElement } from 'react';
import PageLayout from '@weco/common/views/components/PageLayoutDeprecated/PageLayoutDeprecated';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import LayoutPaginatedResults from '@weco/common/views/components/LayoutPaginatedResults/LayoutPaginatedResults';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SegmentedControl from '@weco/common/views/components/SegmentedControl/SegmentedControl';
import {
  getGuides,
  getGuideFormats,
} from '@weco/common/services/prismic/guides';
import { Page } from '@weco/common/model/pages';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { Format } from '@weco/common/model/format';

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
};

const GuidePage = ({
  guides,
  guideFormats,
  formatId,
}: Props): ReactElement<Props> => {
  return (
    <PageLayout
      title={'Guides'}
      description={pageDescription}
      url={{ pathname: '/guides' }}
      jsonLd={{}}
      openGraphType={'website'}
      siteSection={'whatwedo'}
      imageUrl={null}
      imageAltText={null}
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

GuidePage.getInitialProps = async (
  ctx: NextPageContext
): Promise<Props | { statusCode: number }> => {
  const { format } = ctx.query;
  const { memoizedPrismic } = (ctx.query.memoizedPrismic as unknown) as Record<
    string,
    unknown
  >;
  const memo = Array.isArray(memoizedPrismic)
    ? memoizedPrismic[0]
    : memoizedPrismic;
  const guidesPromise = await getGuides(
    ctx.req,
    {
      format,
    },
    memo
  );
  const guideFormatsPromise = getGuideFormats(ctx.req, memo);

  const [guides, guideFormats] = await Promise.all([
    guidesPromise,
    guideFormatsPromise,
  ]);

  if (guides) {
    return {
      guides,
      guideFormats,
      formatId: format || null,
    };
  } else {
    return { statusCode: 404 };
  }
};

export default GuidePage;
