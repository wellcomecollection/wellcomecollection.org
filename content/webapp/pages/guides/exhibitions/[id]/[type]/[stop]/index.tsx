import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { getServerData } from '@weco/common/server-data';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { AppErrorProps } from '@weco/common/services/app';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { isFilledSliceZone } from '@weco/common/services/prismic/types';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchExhibitionHighlightTour } from '@weco/content/services/prismic/fetch/exhibition-highlight-tours';
import {
  transformExhibitionHighlightTours,
  transformGuideStopSlice,
} from '@weco/content/services/prismic/transformers/exhibition-highlight-tours';
import { exhibitionGuideLd } from '@weco/content/services/prismic/transformers/json-ld';
import { isValidExhibitionGuideType } from '@weco/content/types/exhibition-guides';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import ExhibitionGuideStopPage, {
  Props as ExhibitionGuideStopPageProps,
} from '@weco/content/views/guides/exhibitions/exhibition/type/stop';

type Props = ExhibitionGuideStopPageProps & {
  serverData: SimplifiedServerData; // TODO should we enforce this?
};

const Page: FunctionComponent<Props> = (
  props: ExhibitionGuideStopPageProps
) => {
  return <ExhibitionGuideStopPage {...props} />;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const { id, type, stop } = context.query;

  if (!looksLikePrismicId(id) || !isValidExhibitionGuideType(type)) {
    return { notFound: true };
  }

  const client = createClient(context);

  const exhibitionHighlightTourQuery = await fetchExhibitionHighlightTour(
    client,
    id
  );

  if (isNotUndefined(exhibitionHighlightTourQuery)) {
    const serverData = await getServerData(context);
    const exhibitionHighlightTour = transformExhibitionHighlightTours(
      exhibitionHighlightTourQuery
    );
    const exhibitionTitle = exhibitionHighlightTour.title;
    const jsonLd = exhibitionGuideLd(exhibitionHighlightTour);
    const stopNumberServerSide = Number(stop);

    const allStops = isFilledSliceZone(exhibitionHighlightTour.stops)
      ? exhibitionHighlightTour.stops.map(transformGuideStopSlice)
      : undefined;
    const rawCurrentStop = isFilledSliceZone(exhibitionHighlightTour.stops)
      ? exhibitionHighlightTour.stops.find(
          s => s.primary.number === stopNumberServerSide
        )
      : undefined;
    const currentStopServerSide =
      rawCurrentStop && transformGuideStopSlice(rawCurrentStop);

    if (!currentStopServerSide || !allStops) {
      return { notFound: true };
    }

    return {
      props: serialiseProps<Props>({
        currentStopServerSide,
        jsonLd,
        serverData,
        type,
        stopNumberServerSide,
        exhibitionTitle,
        exhibitionGuideId: exhibitionHighlightTour.id,
        exhibitionGuide: exhibitionHighlightTour,
        allStops,
      }),
    };
  }

  return { notFound: true };
};

export default Page;
