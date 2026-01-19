import * as prismic from '@prismicio/client';
import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { serialiseProps } from '@weco/common/utils/json';
import { toMaybeString } from '@weco/common/utils/routes';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { allGuides } from '@weco/content/pages/guides/exhibitions';
import { createClient } from '@weco/content/services/prismic/fetch';
import {
  fetchExhibitionGuide,
  fetchExhibitionGuides,
} from '@weco/content/services/prismic/fetch/exhibition-guides';
import {
  fetchExhibitionHighlightTour,
  fetchExhibitionHighlightTours,
} from '@weco/content/services/prismic/fetch/exhibition-highlight-tours';
import {
  fetchExhibitionText,
  fetchExhibitionTexts,
} from '@weco/content/services/prismic/fetch/exhibition-texts';
import { transformExhibitionGuide } from '@weco/content/services/prismic/transformers/exhibition-guides';
import {
  transformExhibitionHighlightTours,
  transformExhibitionHighlightToursQuery,
} from '@weco/content/services/prismic/transformers/exhibition-highlight-tours';
import {
  transformExhibitionTexts,
  transformExhibitionTextsQuery,
} from '@weco/content/services/prismic/transformers/exhibition-texts';
import { exhibitionGuideLd } from '@weco/content/services/prismic/transformers/json-ld';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import { getGuidesRedirections } from '@weco/content/utils/digital-guides';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import ExhibitionGuidePage, {
  Props as ExhibitionGuidePageProps,
} from '@weco/content/views/pages/guides/exhibitions/exhibition';

const Page: NextPage<ExhibitionGuidePageProps> = props => {
  return <ExhibitionGuidePage {...props} />;
};

// N.B. There are quite a lot of requests to Prismic for this page, which are necessary in order to maintain the url structure
// while supporting both the deprecated ExhibitionGuide type and new custom types
// We are looking to change the url structure for this and related pages, see: https://docs.google.com/document/d/17xPEfOFAFzBeFopkKUAWUTyBo89lPzoSSV5o_4Ri8NQ/edit#heading=h.l7pem7f5wz3f
// At which point we'll have the exhibition id in the url and can query the types directly, filtering by the exhibition id

type Props = ServerSideProps<ExhibitionGuidePageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const { id, stopNumber } = context.query;

  if (!looksLikePrismicId(id)) {
    return { notFound: true };
  }

  // Check if it needs to be redirected because of query params or cookie preferences
  // Will redirect here if needed
  const redirect = getGuidesRedirections(context);
  if (redirect) return redirect;

  // If not needed, then fetch everything required for this page
  const client = createClient(context);

  // We don't know exactly which type of document the id is for, so:
  // We try and get any deprecated ExhibitionGuides
  // and also the custom types that have replaced ExhibitionGuides
  const exhibitionGuideQueryPromise = fetchExhibitionGuide(client, id);
  const exhibitionTextQueryPromise = fetchExhibitionText(client, id);
  const exhibitionHighlightTourQueryPromise = fetchExhibitionHighlightTour(
    client,
    id
  );

  // We fetch all the guides so that we can display links to other guides
  const exhibitionGuidesQueryPromise = fetchExhibitionGuides(client, {
    page: 1,
  });
  const exhibitionTextsQueryPromise = fetchExhibitionTexts(client, {
    page: 1,
  });
  const exhibitionHighlightToursQueryPromise = fetchExhibitionHighlightTours(
    client,
    {
      page: 1,
    }
  );

  const [
    exhibitionGuideQuery,
    exhibitionTextQuery,
    exhibitionHighlightTourQuery,
    exhibitionGuidesQuery,
    exhibitionTextsQuery,
    exhibitionHighlightToursQuery,
  ] = await Promise.all([
    exhibitionGuideQueryPromise,
    exhibitionTextQueryPromise,
    exhibitionHighlightTourQueryPromise,
    exhibitionGuidesQueryPromise,
    exhibitionTextsQueryPromise,
    exhibitionHighlightToursQueryPromise,
  ]);

  if (
    isNotUndefined(exhibitionGuideQuery || exhibitionTextQuery) ||
    exhibitionHighlightTourQuery
  ) {
    const serverData = await getServerData(context);

    const exhibitionGuides = transformQuery(
      exhibitionGuidesQuery,
      transformExhibitionGuide
    );

    const exhibitionTexts = transformQuery(
      exhibitionTextsQuery,
      transformExhibitionTexts
    );

    const exhibitionHighlightTours = transformQuery(
      exhibitionHighlightToursQuery,
      transformExhibitionHighlightTours
    );

    const guides = allGuides({
      exhibitionTexts,
      exhibitionHighlightTours,
      exhibitionGuides,
    });

    // If we're dealing with the deprecated ExhibitionGuides
    if (isNotUndefined(exhibitionGuideQuery)) {
      // We don't need to send data about individual components to the page, so
      // remove it here.
      const exhibitionGuide = {
        ...transformExhibitionGuide(exhibitionGuideQuery),
        components: [],
      };

      const jsonLd = exhibitionGuideLd(exhibitionGuide);

      return {
        props: serialiseProps<Props>({
          exhibitionGuide,
          jsonLd,
          serverData,
          otherExhibitionGuides: guides.results.filter(
            result => result.title !== exhibitionGuide?.title
          ),
        }),
      };
    }

    // If we're dealing with the custom types that replaced the deprecated ExhibitionGuides
    if (isNotUndefined(exhibitionTextQuery) || exhibitionHighlightTourQuery) {
      const exhibitionText = exhibitionTextQuery && {
        ...transformExhibitionTexts(exhibitionTextQuery),
        components: [],
      };
      const exhibitionHighlightTour = exhibitionHighlightTourQuery && {
        ...transformExhibitionHighlightTours(exhibitionHighlightTourQuery),
        components: [],
      };

      // If we have an exhibitionText, there may be a exhibitionHiglightTour
      // associated to the same exhibition, or vice versa.
      // So we try to fetch those.
      let exhibitionTexts;
      let exhibitionHighlightTours;

      const relatedExhibitionId =
        exhibitionText?.relatedExhibition?.id ||
        exhibitionHighlightTour?.relatedExhibition?.id;

      if (relatedExhibitionId) {
        try {
          const exhibitionTextsQuery =
            !exhibitionTextQuery &&
            fetchExhibitionTexts(client, {
              filters: [
                prismic.filter.at(
                  'my.exhibition-texts.related_exhibition',
                  relatedExhibitionId
                ),
              ],
            });
          exhibitionTexts = exhibitionTextsQuery
            ? transformExhibitionTextsQuery(await exhibitionTextsQuery)
            : undefined;
        } catch {
          exhibitionTexts = undefined;
        }

        try {
          const exhibitionHighlightToursQuery =
            !exhibitionHighlightTourQuery &&
            fetchExhibitionHighlightTours(client, {
              filters: [
                prismic.filter.at(
                  'my.exhibition-highlight-tours.related_exhibition',
                  relatedExhibitionId
                ),
              ],
            });

          exhibitionHighlightTours = exhibitionHighlightToursQuery
            ? transformExhibitionHighlightToursQuery(
                await exhibitionHighlightToursQuery
              )
            : undefined;
        } catch {
          exhibitionHighlightTours = undefined;
        }
      }

      const jsonLd =
        exhibitionTexts || exhibitionHighlightTours
          ? exhibitionGuideLd(exhibitionTexts || exhibitionHighlightTours)
          : { '@type': 'Thing' };

      // If the user has not yet have a guide preference cookie set
      // The TypeOption links should contain the stop number, so we
      // need to pass it in
      //
      // The first stop's link is an exception, in that it should link to
      // the [exhibitionId]/[type] page, and not directly on the stop's page.
      const validStopNumber =
        Number(toMaybeString(stopNumber)) && toMaybeString(stopNumber) !== '1'
          ? toMaybeString(stopNumber)
          : undefined;

      return {
        props: serialiseProps<Props>({
          jsonLd,
          serverData,
          exhibitionText: exhibitionText || exhibitionTexts?.results[0], // There should only ever be one of these, so we take the first
          exhibitionHighlightTour:
            exhibitionHighlightTour || exhibitionHighlightTours?.results[0], // There should only ever be one of these, so we take the first
          otherExhibitionGuides: guides.results.filter(
            result =>
              result.title !== exhibitionText?.title &&
              result.title !== exhibitionHighlightTour?.title
          ),
          stopNumber: validStopNumber,
        }),
      };
    }
  }

  return { notFound: true };
};

export default Page;
