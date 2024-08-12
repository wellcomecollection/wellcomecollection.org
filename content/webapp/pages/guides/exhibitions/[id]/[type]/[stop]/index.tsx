import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import {
  ExhibitionHighlightTour,
  ExhibitionGuideType,
  isValidType,
  GuideHighlightTour,
} from '@weco/content/types/exhibition-guides';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchExhibitionHighlightTour } from '@weco/content/services/prismic/fetch/exhibition-highlight-tours';
import {
  transformExhibitionHighlightTours,
  transformGuideStopSlice,
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
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { Container } from '@weco/common/views/components/styled/Container';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import { getCrop } from '@weco/common/model/image';
import ImagePlaceholder, {
  placeholderBackgroundColor,
} from '@weco/content/components/ImagePlaceholder/ImagePlaceholder';
import AudioPlayer from '@weco/content/components/AudioPlayer/AudioPlayer';
import VideoEmbed from '@weco/common/views/components/VideoEmbed/VideoEmbed';
type Props = {
  exhibitionGuide: ExhibitionHighlightTour;
  jsonLd: JsonLdObj;
  type: ExhibitionGuideType;
  userPreferenceSet?: string | string[];
  currentStop: GuideHighlightTour;
  exhibitionGuideId: string;
  exhibitionTitle: string;
  stopNumber: number;
  totalStops: number;
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

  // TODO: get exhibitionHighlightTourQuery from localStorage if possible

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
      const exhibitionTitle = exhibitionHighlightTour.title;
      const jsonLd = exhibitionGuideLd(exhibitionHighlightTour);
      const stopNumber = Number(stop);
      const rawCurrentStop = exhibitionHighlightTour.stops.find(
        s => s.primary.number === stopNumber
      );
      const totalStops = exhibitionHighlightTour.stops.length;
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
          stopNumber,
          totalStops,
          exhibitionTitle,
          exhibitionGuideId: id,
        }),
      };
    }
  }

  return { notFound: true };
};

const ExhibitionGuidePage: FunctionComponent<Props> = props => {
  const {
    jsonLd,
    type,
    currentStop,
    exhibitionGuideId,
    exhibitionTitle,
    stopNumber,
    totalStops,
  } = props;
  const guideTypeUrl = `/guides/exhibitions/${exhibitionGuideId}/${type}`;
  const pathname = `${guideTypeUrl}/${stopNumber}`;
  const croppedImage =
    (currentStop.image && getCrop(currentStop.image, '16:9')) ||
    currentStop.image;

  return (
    <PageLayout
      title={currentStop.title}
      description={pageDescriptions.exhibitionGuides}
      url={{ pathname }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection="exhibition-guides"
      image={currentStop.image}
      hideHeader={true}
      hideFooter={true}
      hideNewsletterPromo={true}
      apiToolbarLinks={[createPrismicLink(exhibitionGuideId)]}
    >
      <Container>
        <div
          style={{
            display: 'flex',
            alignItems: 'space-between',
            flex: 1,
            width: '100%',
          }}
        >
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', flex: 1, width: '100%' }}>
              <span>icon</span> <span>{exhibitionTitle}</span>
            </div>
            <div style={{ display: 'flex', flex: 1, width: '100%' }}>
              <span>icon</span>{' '}
              <h1>
                Stop {stopNumber}/{totalStops}:{' '}
                <strong>{currentStop.title}</strong>
              </h1>
            </div>
          </div>
          <span>
            <a href={`${guideTypeUrl}#${stopNumber}`}>X</a>
          </span>
        </div>

        {type !== 'bsl' && (
          <>
            {croppedImage ? (
              <PrismicImage quality="low" image={croppedImage} />
            ) : (
              <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                <ImagePlaceholder
                  backgroundColor={placeholderBackgroundColor(stopNumber)}
                />
              </div>
            )}
          </>
        )}

        {type === 'bsl' ? (
          <VideoEmbed embedUrl={currentStop.video} />
        ) : (
          <AudioPlayer title="" audioFile={currentStop.audio} />
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {stopNumber > 1 && (
            <a href={`${guideTypeUrl}/${stopNumber - 1}`}>previous</a>
          )}
          {stopNumber < totalStops && (
            <a href={`${guideTypeUrl}/${stopNumber + 1}`}>next</a>
          )}
        </div>
      </Container>
    </PageLayout>
  );
};

export default ExhibitionGuidePage;
