import { GetServerSideProps, NextPageContext } from 'next';
import { FunctionComponent, ReactElement } from 'react';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import LayoutPaginatedResults from '../components/LayoutPaginatedResults/LayoutPaginatedResults';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SegmentedControl from '@weco/common/views/components/SegmentedControl/SegmentedControl';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { Page } from '@weco/common/model/pages';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { Format } from '@weco/common/model/format';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { createClient } from '../services/prismic/fetch';
import {
  fetchGuideFormats,
  fetchGuides,
} from '../services/prismic/fetch/guides';
import { transformQuery } from '../services/prismic/transformers/paginated-results';
import {
  transformGuide,
  transformGuideFormat,
} from '../services/prismic/transformers/guides';
import { getServerData } from '@weco/common/server-data';

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
      description={pageDescriptions.guides}
      url={{ pathname: '/guides' }}
      jsonLd={{ '@type': 'Webpage' }}
      openGraphType={'website'}
      siteSection={'what-we-do'}
      image={undefined}
    >
      <SpacingSection>
        <LayoutPaginatedResults
          showFreeAdmissionMessage={false}
          title={displayTitle}
          description={[
            {
              type: 'paragraph',
              text: pageDescriptions.guides,
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
  console.log(`@@AWLC getServerSideProps`);
  const serverData = await getServerData(ctx);
  const { format } = ctx.query;

  const client = createClient(ctx);

  const guidesQueryPromise = fetchGuides(client, { format });
  const guidesFormatQueryPromise = fetchGuideFormats(client);

  const [guidesQuery, guideFormatsQuery] = await Promise.all([
    guidesQueryPromise,
    guidesFormatQueryPromise,
  ]);

  const guides = transformQuery(guidesQuery, transformGuide);
  const guideFormats = transformQuery(guideFormatsQuery, transformGuideFormat);

  if (guides) {
    return {
      props: removeUndefinedProps({
        guides,
        guideFormats,
        formatId: format || null,
        serverData,
      }),
    };
  } else {
    return { notFound: true };
  }
};

export default GuidePage;
