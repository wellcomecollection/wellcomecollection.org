import { ExhibitionGuideBasic } from '@weco/content/types/exhibition-guides';
import type { PaginatedResults } from '@weco/common/services/prismic/types';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchExhibitionGuides } from '@weco/content/services/prismic/fetch/exhibition-guides';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import {
  transformExhibitionGuide,
  transformExhibitionGuideToExhibitionGuideBasic,
} from '@weco/content/services/prismic/transformers/exhibition-guides';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { exhibitionGuideLd } from '@weco/content/services/prismic/transformers/json-ld';
import { getPage } from '@weco/content/utils/query-params';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import LayoutPaginatedResults from '@weco/content/components/LayoutPaginatedResults/LayoutPaginatedResults';
import { exhibitionGuidesLinks } from '@weco/common/views/components/Header/Header';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

type Props = {
  exhibitionGuides: PaginatedResults<ExhibitionGuideBasic>;
  jsonLd: JsonLdObj[];
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);
  const page = getPage(context.query);

  if (typeof page !== 'number') {
    return appError(context, 400, page.message);
  }

  const client = createClient(context);
  const exhibitionGuidesQuery = await fetchExhibitionGuides(client, { page });

  const exhibitionGuides = transformQuery(
    exhibitionGuidesQuery,
    transformExhibitionGuide
  );

  const basicExhibitionGuides = {
    ...exhibitionGuides,
    results: exhibitionGuides.results.map(
      transformExhibitionGuideToExhibitionGuideBasic
    ),
  };

  const jsonLd = exhibitionGuides.results.map(exhibitionGuideLd);

  return {
    props: serialiseProps({
      exhibitionGuides: basicExhibitionGuides,
      jsonLd,
      serverData,
    }),
  };
};

const ExhibitionGuidesPage: FunctionComponent<Props> = props => {
  const { exhibitionGuides } = props;
  const image = exhibitionGuides.results[0]?.image;

  return (
    <PageLayout
      title="Exhibition Guides"
      description={pageDescriptions.exhibitionGuides}
      url={{ pathname: '/guides/exhibitions' }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType="website"
      siteSection="exhibition-guides"
      image={image}
      headerProps={{
        customNavLinks: exhibitionGuidesLinks,
        isMinimalHeader: true,
      }}
      hideNewsletterPromo={true}
      hideFooter={true}
    >
      <SpacingSection>
        <LayoutPaginatedResults
          title="Exhibition guides"
          paginatedResults={exhibitionGuides}
        />
      </SpacingSection>
    </PageLayout>
  );
};

export default ExhibitionGuidesPage;
