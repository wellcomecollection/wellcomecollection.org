import { FunctionComponent } from 'react';
import NextLink from 'next/link';
import { isFilledSliceZone } from '@weco/common/services/prismic/types';
import { GetServerSideProps } from 'next';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import {
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
import Icon from '@weco/common/views/components/Icon/Icon';
import {
  map,
  audioDescribed,
  britishSignLanguage,
  cross,
  arrow,
} from '@weco/common/icons';

type Props = {
  jsonLd: JsonLdObj;
  type: ExhibitionGuideType;
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

      const rawCurrentStop = isFilledSliceZone(exhibitionHighlightTour.stops)
        ? exhibitionHighlightTour.stops.find(
            s => s.primary.number === stopNumber
          )
        : undefined;
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

  const Page = styled.div`
    background-color: ${props => props.theme.color('black')};
    color: ${props => props.theme.color('white')};
    min-height: 100vh;
  `;

  const Header = styled.header`
    background-color: ${props => props.theme.color('neutral.700')};
    position: sticky;
    top: 0;
    z-index: 1;
  `;

  const HeaderInner = styled(Space).attrs({
    $v: {
      size: 's',
      properties: ['padding-top', 'padding-bottom', 'margin-bottom'],
    },
  })`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;

  const PrevNext = styled(Space).attrs({
    $v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
  })`
    position: fixed;
    bottom: 0;
    width: 100%;
    background: ${props => props.theme.color('neutral.700')};
  `;

  const AlignCenter = styled.div`
    display: flex;
    align-items: center;
  `;

  const AudioPlayerWrapper = styled(Space).attrs({
    $h: { size: 'm', properties: ['padding-left', 'padding-right'] },
    $v: { size: 'm', properties: ['padding-bottom', 'padding-top'] },
  })`
    color: ${props => props.theme.color('black')};
    background-color: ${props => props.theme.color('neutral.200')};
  `;

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
      <Page>
        <Header>
          <Container>
            <HeaderInner>
              <div>
                <AlignCenter>
                  <Space
                    $h={{ size: 's', properties: ['margin-right'] }}
                    style={{ display: 'flex' }}
                  >
                    <Icon
                      matchText={true}
                      icon={
                        type === 'bsl' ? britishSignLanguage : audioDescribed
                      }
                    />
                  </Space>
                  <span>{exhibitionTitle}</span>
                </AlignCenter>
                <AlignCenter>
                  <Space
                    $h={{ size: 's', properties: ['margin-right'] }}
                    style={{ display: 'flex' }}
                  >
                    <Icon matchText={true} icon={map} />
                  </Space>
                  <AlignCenter>
                    <Space
                      $h={{ size: 's', properties: ['margin-right'] }}
                      style={{ display: 'inline-block' }}
                    >
                      Stop {stopNumber}/{totalStops}:
                    </Space>
                    <h1 style={{ display: 'inline-block', marginBottom: '0' }}>
                      {currentStop.title}
                    </h1>
                  </AlignCenter>
                </AlignCenter>
              </div>
              <span>
                <NextLink href={`${guideTypeUrl}#${stopNumber}`} shallow={true}>
                  <Icon icon={cross} />
                  <span className="visually-hidden">Back to list of stops</span>
                </NextLink>
              </span>
            </HeaderInner>
          </Container>
        </Header>
        {/* Make sure we can scroll content into view if it's behind the fixed position footer (paddingBottom: 100px) */}
        <Container style={{ paddingBottom: '100px' }}>
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
            <>
              {currentStop.video && <VideoEmbed embedUrl={currentStop.video} />}
            </>
          ) : (
            <>
              {currentStop.audio && (
                <AudioPlayerWrapper>
                  <AudioPlayer title="" audioFile={currentStop.audio} />
                </AudioPlayerWrapper>
              )}
            </>
          )}
        </Container>
        <PrevNext>
          <Container>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {stopNumber > 1 && (
                  <AlignCenter>
                    <Icon icon={arrow} rotate={180} />
                    <a
                      style={{ textDecoration: 'none' }}
                      href={`${guideTypeUrl}/${stopNumber - 1}`}
                    >
                      Previous
                    </a>
                  </AlignCenter>
                )}
              </div>
              <div>
                {stopNumber < totalStops && (
                  <AlignCenter>
                    <a
                      style={{ textDecoration: 'none' }}
                      href={`${guideTypeUrl}/${stopNumber + 1}`}
                    >
                      Next
                    </a>
                    <Icon icon={arrow} />
                  </AlignCenter>
                )}
              </div>
            </div>
          </Container>
        </PrevNext>
      </Page>
    </PageLayout>
  );
};

export default ExhibitionGuidePage;
