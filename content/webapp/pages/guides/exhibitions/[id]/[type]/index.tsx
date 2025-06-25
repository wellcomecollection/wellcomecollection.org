import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import {
  ExhibitionHighlightToursDocument,
  ExhibitionTextsDocument,
} from '@weco/common/prismicio-types';
import { getServerData } from '@weco/common/server-data';
import { AppErrorProps } from '@weco/common/services/app';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { serialiseProps } from '@weco/common/utils/json';
import { toMaybeString } from '@weco/common/utils/routes';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchExhibitionGuide } from '@weco/content/services/prismic/fetch/exhibition-guides';
import { fetchExhibitionHighlightTour } from '@weco/content/services/prismic/fetch/exhibition-highlight-tours';
import { fetchExhibitionText } from '@weco/content/services/prismic/fetch/exhibition-texts';
import {
  filterExhibitionGuideComponents,
  transformExhibitionGuide,
} from '@weco/content/services/prismic/transformers/exhibition-guides';
import { transformExhibitionHighlightTours } from '@weco/content/services/prismic/transformers/exhibition-highlight-tours';
import { transformExhibitionTexts } from '@weco/content/services/prismic/transformers/exhibition-texts';
import { exhibitionGuideLd } from '@weco/content/services/prismic/transformers/json-ld';
import { isValidExhibitionGuideType } from '@weco/content/types/exhibition-guides';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import ExhibitionGuideTypePage, {
  Props,
} from '@weco/content/views/guides/exhibitions/exhibition/type';

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const { id, type, userPreferenceSet, stopId } = context.query;

  if (!looksLikePrismicId(id) || !isValidExhibitionGuideType(type)) {
    return { notFound: true };
  }

  const client = createClient(context);

  // We don't know exactly which type of document the id is for, so:
  // We try and get any deprecated ExhibitionGuides
  // and also the custom types that have replaced ExhibitionGuides.
  // We know from the type which of the new types to retrieve
  const exhibitionGuideQueryPromise = fetchExhibitionGuide(client, id);
  const exhibitionTextQueryPromise =
    type === 'captions-and-transcripts'
      ? fetchExhibitionText(client, id)
      : new Promise(resolve => {
          resolve(undefined);
        });
  const exhibitionHighlightTourQueryPromise =
    type === 'bsl' || type === 'audio-without-descriptions'
      ? fetchExhibitionHighlightTour(client, id)
      : new Promise(resolve => {
          resolve(undefined);
        });

  const [
    exhibitionGuideQuery,
    exhibitionTextQuery,
    exhibitionHighlightTourQuery,
  ] = await Promise.all([
    exhibitionGuideQueryPromise,
    exhibitionTextQueryPromise,
    exhibitionHighlightTourQueryPromise,
  ]);

  if (
    isNotUndefined(exhibitionGuideQuery) ||
    isNotUndefined(exhibitionTextQuery) ||
    isNotUndefined(exhibitionHighlightTourQuery)
  ) {
    const serverData = await getServerData(context);

    // If we're dealing with the deprecated ExhibitionGuides
    if (isNotUndefined(exhibitionGuideQuery)) {
      const exhibitionGuide = transformExhibitionGuide(exhibitionGuideQuery);
      const filteredExhibitionGuide = filterExhibitionGuideComponents(
        exhibitionGuide,
        type
      );

      const jsonLd = exhibitionGuideLd(exhibitionGuide);

      return {
        props: serialiseProps({
          exhibitionGuide: filteredExhibitionGuide,
          jsonLd,
          serverData,
          type,
          userPreferenceSet,
          stopId: toMaybeString(stopId),
        }),
      };
    }

    // If we're dealing with and ExhibitionText
    if (isNotUndefined(exhibitionTextQuery)) {
      const exhibitionText = transformExhibitionTexts(
        exhibitionTextQuery as ExhibitionTextsDocument
      );
      const jsonLd = exhibitionGuideLd(exhibitionText);
      return {
        props: serialiseProps({
          exhibitionGuide: exhibitionText,
          jsonLd,
          serverData,
          type,
          userPreferenceSet,
          stopId: toMaybeString(stopId),
        }),
      };
    }

    // If we're dealing with an ExhibitionHighlightTour
    if (isNotUndefined(exhibitionHighlightTourQuery)) {
      const exhibitionHighlightTour = transformExhibitionHighlightTours(
        exhibitionHighlightTourQuery as ExhibitionHighlightToursDocument
      );
      const jsonLd = exhibitionGuideLd(exhibitionHighlightTour);
      return {
        props: serialiseProps({
          exhibitionGuide: exhibitionHighlightTour,
          jsonLd,
          serverData,
          type,
          userPreferenceSet,
          stopId: toMaybeString(stopId),
        }),
      };
    }
  }

  return { notFound: true };
};

const Page: FunctionComponent<Props> = props => {
  return (
    <ExhibitionGuideTypePage
      exhibitionGuide={props.exhibitionGuide}
      jsonLd={props.jsonLd}
      type={props.type}
      userPreferenceSet={props.userPreferenceSet}
      stopId={props.stopId}
    />
  );
};

export default Page;
