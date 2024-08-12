import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import {
  ExhibitionHighlightTour,
  ExhibitionGuideType,
  isValidType,
} from '@weco/content/types/exhibition-guides';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchExhibitionHighlightTour } from '@weco/content/services/prismic/fetch/exhibition-highlight-tours';
import {
  transformExhibitionHighlightTours,
  transformGuideStopSlice,
  GuideHighlightTour,
} from '@weco/content/services/prismic/transformers/exhibition-highlight-tours';
import { serialiseProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { exhibitionGuideLd } from '@weco/content/services/prismic/transformers/json-ld';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { AppErrorProps } from '@weco/common/services/app';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { exhibitionGuidesLinks } from '@weco/common/views/components/Header/Header';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { Container } from '@weco/common/views/components/styled/Container';

type Props = {
  exhibitionGuide: ExhibitionHighlightTour;
  jsonLd: JsonLdObj;
  type: ExhibitionGuideType;
  userPreferenceSet?: string | string[];
  currentStop: GuideHighlightTour;
  exhibitionId: string;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const { id, type, stop } = context.query;

  if (!looksLikePrismicId(id) || !isValidType(type)) {
    return { notFound: true };
  }

  const client = createClient(context);

  const exhibitionHighlightTourQuery = await fetchExhibitionHighlightTour(
    client,
    id
  );

  if (isNotUndefined(exhibitionHighlightTourQuery)) {
    const serverData = await getServerData(context);

    if (isNotUndefined(exhibitionHighlightTourQuery)) {
      const exhibitionHighlightTour = transformExhibitionHighlightTours(
        exhibitionHighlightTourQuery
      );
      const jsonLd = exhibitionGuideLd(exhibitionHighlightTour);
      const rawCurrentStop = exhibitionHighlightTour.stops.find(
        s => s.primary.number === Number(stop)
      );
      const currentStop = transformGuideStopSlice(rawCurrentStop!);

      if (!currentStop) {
        return { notFound: true };
      }

      return {
        props: serialiseProps({
          currentStop,
          jsonLd,
          serverData,
          type,
          exhibitionId: id,
        }),
      };
    }
  }

  return { notFound: true };
};

const ExhibitionGuidePage: FunctionComponent<Props> = props => {
  const { jsonLd, type, currentStop, exhibitionId } = props;
  const pathname = `guides/exhibitions/${exhibitionId}/${type}`;

  return (
    <PageLayout
      title={currentStop.title}
      description={pageDescriptions.exhibitionGuides}
      url={{ pathname }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection="exhibition-guides"
      image={currentStop.image}
      headerProps={{
        customNavLinks: exhibitionGuidesLinks,
        isMinimalHeader: true,
      }}
      hideNewsletterPromo={true}
      apiToolbarLinks={[createPrismicLink(exhibitionId)]}
    >
      <Container>
        {currentStop.title}
        {type === 'bsl' ? <p>Video player</p> : <p>Audio Player</p>}
      </Container>
    </PageLayout>
  );
};

export default ExhibitionGuidePage;
