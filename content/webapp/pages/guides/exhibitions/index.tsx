import { FunctionComponent } from 'react';

import { getServerData } from '@weco/common/server-data';
import { appError } from '@weco/common/services/app';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
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
import ExhibitionGuidesPage, {
  Props as ExhibitionGuidesPageProps,
} from '@weco/content/views/pages/guides/exhibitions';

const Page: FunctionComponent<ExhibitionGuidesPageProps> = props => {
  return <ExhibitionGuidesPage {...props} />;
};

type Props = ServerSideProps<ExhibitionGuidesPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
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
    props: serialiseProps<Props>({
      exhibitionGuides: guides,
      jsonLd,
      serverData,
    }),
  };
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

  const uniqueExhibitionsWithGuides = Array.from(
    new Map(
      [
        ...exhibitionTexts.results.map(transformToBasic),
        ...exhibitionHighlightTours.results.map(transformToBasic),
      ].map(item => [item.relatedExhibition?.id, item])
    ).values()
  );

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

export default Page;
