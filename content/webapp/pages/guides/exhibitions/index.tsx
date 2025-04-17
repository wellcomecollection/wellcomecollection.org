import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { getServerData } from '@weco/common/server-data';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { pluralize } from '@weco/common/utils/grammar';
import { serialiseProps } from '@weco/common/utils/json';
import Divider from '@weco/common/views/components/Divider/Divider';
import { exhibitionGuidesLinks } from '@weco/common/views/components/Header/Header';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import CardGrid from '@weco/content/components/CardGrid/CardGrid';
import Pagination from '@weco/content/components/Pagination/Pagination';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchExhibitionGuides } from '@weco/content/services/prismic/fetch/exhibition-guides';
import { fetchExhibitionHighlightTours } from '@weco/content/services/prismic/fetch/exhibition-highlight-tours';
import { fetchExhibitionTexts } from '@weco/content/services/prismic/fetch/exhibition-texts';
import {
  transformExhibitionGuide,
  transformExhibitionGuideToExhibitionGuideBasic,
} from '@weco/content/services/prismic/transformers/exhibition-guides';
import { transformExhibitionHighlightTours } from '@weco/content/services/prismic/transformers/exhibition-highlight-tours';
import {
  transformExhibitionTexts,
  transformToBasic,
} from '@weco/content/services/prismic/transformers/exhibition-texts';
import { exhibitionGuideLd } from '@weco/content/services/prismic/transformers/json-ld';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import { ExhibitionGuideBasic } from '@weco/content/types/exhibition-guides';
import { getPage } from '@weco/content/utils/query-params';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

type Props = {
  exhibitionGuides: PaginatedResults<ExhibitionGuideBasic>;
  jsonLd: JsonLdObj[];
};

// We want a list of all the exhibition guides,
// including the deprecated ExhibitionGuides
// and the combined exhibitionTexts and exhibitionHiglightTours,
// which relate to a single exhibition
export function allGuides({
  exhibitionGuides,
  exhibitionTexts,
  exhibitionHighlightTours,
}: {
  exhibitionGuides: PaginatedResults<ExhibitionGuideBasic>;
  exhibitionTexts: PaginatedResults<ExhibitionGuideBasic>;
  exhibitionHighlightTours: PaginatedResults<ExhibitionGuideBasic>;
}): PaginatedResults<ExhibitionGuideBasic> {
  // exhibitionTexts and exhibitionHighlightTours may have the same related exhibition
  // in that case we only keep one of them
  // for the purpose of rendering links to the exhibition guide page.

  const uniqueExhibitionsWithGuides = [
    ...new Map(
      [
        ...exhibitionTexts.results.map(transformToBasic),
        ...exhibitionHighlightTours.results.map(transformToBasic),
      ].map(item => [item.relatedExhibition?.id, item])
    ).values(),
  ];

  const allResults = [
    ...uniqueExhibitionsWithGuides.map(guide => {
      const matchingExhibitionText = exhibitionTexts.results.find(
        et => et.relatedExhibition?.id === guide.relatedExhibition?.id
      );
      const matchingExhibitionHighlightTour =
        exhibitionHighlightTours.results.find(
          eht => eht.relatedExhibition?.id === guide.relatedExhibition?.id
        );
      return {
        ...guide,
        exhibitionTextUid: matchingExhibitionText?.uid,
        exhibitionHighlightTourUid: matchingExhibitionHighlightTour?.uid,
        availableTypes: {
          BSLVideo:
            matchingExhibitionText?.availableTypes.BSLVideo ||
            matchingExhibitionHighlightTour?.availableTypes.BSLVideo ||
            false,
          audioWithoutDescriptions:
            matchingExhibitionText?.availableTypes.audioWithoutDescriptions ||
            matchingExhibitionHighlightTour?.availableTypes
              .audioWithoutDescriptions ||
            false,
          captionsOrTranscripts:
            matchingExhibitionText?.availableTypes.captionsOrTranscripts ||
            matchingExhibitionHighlightTour?.availableTypes
              .captionsOrTranscripts ||
            false,
        },
      };
    }),
    ...exhibitionGuides.results.map(
      transformExhibitionGuideToExhibitionGuideBasic
    ),
  ];

  return {
    currentPage: 1,
    pageSize: allResults.length,
    totalResults: allResults.length,
    totalPages: 1,
    results: allResults,
  };
}

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
  // ExhibitionGuides are deprecated in Prismic, we fetch them for the old content
  const exhibitionGuidesQueryPromise = fetchExhibitionGuides(client, { page });
  // What was ExhibitionGuides is now split into ExhibitionTexts and ExhibitionHighlightTours
  // We look for both of these and later combine any that share the same related exhibition
  // for the purpose of rendering links to the exhibition guide index page.
  const exhibitionTextsQueryPromise = fetchExhibitionTexts(client, { page });
  const exhibitionHighlightsToursQueryPromise = fetchExhibitionHighlightTours(
    client,
    { page }
  );

  const [
    exhibitionGuidesQuery,
    exhibitionTextsQuery,
    exhibitionHighlightsToursQuery,
  ] = await Promise.all([
    exhibitionGuidesQueryPromise,
    exhibitionTextsQueryPromise,
    exhibitionHighlightsToursQueryPromise,
  ]);

  const exhibitionGuides = transformQuery(
    exhibitionGuidesQuery,
    transformExhibitionGuide
  );

  const exhibitionTexts = transformQuery(
    exhibitionTextsQuery,
    transformExhibitionTexts
  );

  const exhibitionHighlightTours = transformQuery(
    exhibitionHighlightsToursQuery,
    transformExhibitionHighlightTours
  );

  const guides = allGuides({
    exhibitionTexts,
    exhibitionHighlightTours,
    exhibitionGuides,
  });

  const jsonLd = guides.results.map(exhibitionGuideLd);

  return {
    props: serialiseProps({
      exhibitionGuides: guides,
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
      title="Digital Guides"
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
    >
      <SpacingSection>
        <PageHeader
          breadcrumbs={{ items: [], noHomeLink: true }}
          title="Digital Guides"
          backgroundTexture={headerBackgroundLs}
          highlightHeading={true}
        />

        {exhibitionGuides.totalPages > 1 && (
          <ContaineredLayout gridSizes={gridSize12()}>
            <PaginationWrapper $verticalSpacing="l">
              <span>{pluralize(exhibitionGuides.totalResults, 'result')}</span>

              <Pagination
                totalPages={exhibitionGuides.totalPages}
                ariaLabel="Results pagination"
                isHiddenMobile
              />
            </PaginationWrapper>

            <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
              <Divider />
            </Space>
          </ContaineredLayout>
        )}

        <Space $v={{ size: 'l', properties: ['margin-top'] }}>
          {exhibitionGuides.results.length > 0 ? (
            <CardGrid items={exhibitionGuides.results} itemsPerRow={3} />
          ) : (
            <ContaineredLayout gridSizes={gridSize12()}>
              <p>There are no results.</p>
            </ContaineredLayout>
          )}
        </Space>

        {exhibitionGuides.totalPages > 1 && (
          <ContaineredLayout gridSizes={gridSize12()}>
            <PaginationWrapper $verticalSpacing="l" $alignRight>
              <Pagination
                totalPages={exhibitionGuides.totalPages}
                ariaLabel="Results pagination"
              />
            </PaginationWrapper>
          </ContaineredLayout>
        )}
      </SpacingSection>
    </PageLayout>
  );
};

export default ExhibitionGuidesPage;
