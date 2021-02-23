import { NextPageContext } from 'next';
import { FunctionComponent, ReactElement } from 'react';
import PageLayout from '@weco/common/views/components/PageLayoutDeprecated/PageLayoutDeprecated';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import LayoutPaginatedResults from '@weco/common/views/components/LayoutPaginatedResults/LayoutPaginatedResults';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SegmentedControl from '@weco/common/views/components/SegmentedControl/SegmentedControl';
import { getGuides } from '@weco/common/services/prismic/guides';
import { getGuideFormatId } from '@weco/common/services/prismic/utils';
import {
  GuideFormatId,
  GuideFormatIds,
} from '@weco/common/model/content-format-id';
import { Page } from '@weco/common/model/pages';
import { PaginatedResults } from '@weco/common/services/prismic/types';

const pageDescription = 'Guides intro text...';
const displayTitle = 'Guides';

type FiltersProps = {
  currentId: GuideFormatId;
};

const Filters: FunctionComponent<FiltersProps> = ({ currentId }) => {
  return (
    <Layout12>
      <SegmentedControl
        id={'guidesFilter'}
        activeId={currentId || 'all'}
        items={[
          {
            id: 'all',
            url: '/guides',
            text: 'All',
          },
          {
            id: GuideFormatIds.HowTo,
            url: '/guides?format=how-to',
            text: 'How-to',
          },
          {
            id: GuideFormatIds.Topic,
            url: '/guides?format=topic',
            text: 'Topic',
          },
          {
            id: GuideFormatIds.LearningResource,
            url: '/guides?format=learning-resource',
            text: 'Learning resource',
          },
          {
            id: GuideFormatIds.ExhibitionGuide,
            url: '/guides?format=exhibition-guide',
            text: 'Exhibition guide',
          },
        ]}
      />
    </Layout12>
  );
};

type Props = {
  guides: PaginatedResults<Page>;
  formatId: GuideFormatId;
};

const GuidePage = ({ guides, formatId }: Props): ReactElement<Props> => {
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
          paginationRoot={''} // TODO
        >
          <Filters currentId={formatId} />
        </LayoutPaginatedResults>
      </SpacingSection>
    </PageLayout>
  );
};

GuidePage.getInitialProps = async (
  ctx: NextPageContext
): Promise<Props | { statusCode: number }> => {
  const { format } = ctx.query;
  const formatId = getGuideFormatId(format);
  const { memoizedPrismic } = (ctx.query.memoizedPrismic as unknown) as Record<
    string,
    unknown
  >;
  const memo = Array.isArray(memoizedPrismic)
    ? memoizedPrismic[0]
    : memoizedPrismic;
  const guides = await getGuides(
    ctx.req,
    {
      pageSize: 10,
      format,
    },
    memo
  );

  if (guides) {
    return {
      guides,
      formatId,
    };
  } else {
    return { statusCode: 404 };
  }
};

export default GuidePage;
