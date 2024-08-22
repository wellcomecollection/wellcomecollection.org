import { FunctionComponent, useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/router';
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
import Layout, { gridSize8 } from '@weco/common/views/components/Layout';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import { getCrop } from '@weco/common/model/image';
import ImagePlaceholder, {
  placeholderBackgroundColor,
} from '@weco/content/components/ImagePlaceholder/ImagePlaceholder';
import AudioPlayer from '@weco/content/components/AudioPlayer/AudioPlayer';
import VideoEmbed from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import Icon from '@weco/common/views/components/Icon/Icon';
import CollapsibleContent from '@weco/common/views/components/CollapsibleContent';
import {
  map,
  audioDescribed,
  britishSignLanguage,
  cross,
  arrow,
} from '@weco/common/icons';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';

type Props = {
  jsonLd: JsonLdObj;
  type: ExhibitionGuideType;
  currentStopServerSide: GuideHighlightTour;
  exhibitionGuideId: string;
  exhibitionTitle: string;
  stopNumberServerSide: number;
  allStops: GuideHighlightTour[];
};

const Page = styled.div`
  background-color: ${props => props.theme.color('black')};
  color: ${props => props.theme.color('white')};
  min-height: 100vh;
`;

const Header = styled.header`
  background-color: ${props => props.theme.color('neutral.700')};
  position: sticky;
  top: 0;
  z-index: 2;
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
  z-index: 2;
  bottom: 0;
  width: 100%;
  background: ${props => props.theme.color('neutral.700')};
`;

const AlignCenter = styled.div`
  display: flex;
  align-items: center;
`;

const StickyPlayer = styled.div<{ $sticky: boolean }>`
  position: ${props => (props.$sticky ? 'sticky' : undefined)};

  /* Fallback to 60px if there's no js */
  top: var(--stop-header-height, 60px);
  z-index: 1;
`;

const AudioPlayerWrapper = styled(Space).attrs({
  $h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'm', properties: ['padding-bottom', 'padding-top'] },
})`
  color: ${props => props.theme.color('black')};
  background-color: ${props => props.theme.color('neutral.200')};
`;

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
      props: serialiseProps({
        currentStopServerSide,
        jsonLd,
        serverData,
        type,
        stopNumberServerSide,
        exhibitionTitle,
        exhibitionGuideId: id,
        allStops,
      }),
    };
  }

  return { notFound: true };
};

const ExhibitionGuidePage: FunctionComponent<Props> = props => {
  const {
    jsonLd,
    type,
    currentStopServerSide,
    exhibitionGuideId,
    exhibitionTitle,
    stopNumberServerSide,
    allStops,
  } = props;

  // We use the `shallow` prop with NextLinks to avoid doing an unnecessary
  // `getServerSideProps` using the Previous/Next links, because we already have
  // all the data we need and can work it out client side
  const router = useRouter();
  const [stopNumber, setStopNumber] = useState(stopNumberServerSide);
  const [currentStop, setCurrentStop] = useState(currentStopServerSide);
  const [headerEl, setHeaderEl] = useState<HTMLElement>();

  const headerRef = useCallback((node: HTMLElement) => {
    if (node) setHeaderEl(node);
  }, []);

  useEffect(() => {
    if (!headerEl) return;
    // We measure the height of the Header element with a ResizeObserver and
    // update the sticky top position of the StickyPlayer element any time it
    // changes
    const resizeObserver = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty(
        '--stop-header-height',
        `${entry.contentRect.height}px`
      );
    });
    resizeObserver.observe(headerEl);

    return () => resizeObserver.disconnect();
  }, [headerEl]);

  useEffect(() => {
    setStopNumber(Number(router.query.stop));
    const newStop = allStops.find(s => s.number === Number(router.query.stop));
    if (newStop) {
      setCurrentStop(newStop);
    }
  }, [router.query.stop]);

  const guideTypeUrl = `/guides/exhibitions/${exhibitionGuideId}/${type}`;
  const pathname = `${guideTypeUrl}/${stopNumber}`;
  const controlText = {
    defaultText: type === 'bsl' ? 'Read subtitles' : 'Read audio transcript',
    contentShowingText:
      type === 'bsl' ? 'Hide subtitles' : 'Hide audio transcript',
  };
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
      <Page>
        <Header ref={headerRef}>
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
                      Stop {stopNumber}/{allStops.length}:
                    </Space>
                    <h1 style={{ display: 'inline-block', marginBottom: '0' }}>
                      {currentStop.title}
                    </h1>
                  </AlignCenter>
                </AlignCenter>
              </div>
              <span>
                <NextLink href={`${guideTypeUrl}#${stopNumber}`}>
                  <Icon icon={cross} />
                  <span className="visually-hidden">Back to list of stops</span>
                </NextLink>
              </span>
            </HeaderInner>
          </Container>
        </Header>
        {/* Make sure we can scroll content into view if it's behind the fixed position footer (paddingBottom: 100px) */}
        <Layout gridSizes={gridSize8()}>
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
          <StickyPlayer $sticky={type !== 'bsl'}>
            {type === 'bsl' ? (
              <>
                {currentStop.video && (
                  <VideoEmbed embedUrl={currentStop.video} />
                )}
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
          </StickyPlayer>
          <Space $v={{ size: 'l', properties: ['padding-top'] }}>
            <CollapsibleContent
              controlText={controlText}
              id="stop-transcript"
              darkTheme={true}
            >
              <PrismicHtmlBlock
                html={
                  type === 'bsl'
                    ? currentStop.subtitles!
                    : currentStop.transcript!
                }
              />
            </CollapsibleContent>
          </Space>
        </Layout>
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
                  <NextLink
                    style={{ textDecoration: 'none' }}
                    href={`${guideTypeUrl}/${stopNumber - 1}`}
                    shallow={true}
                  >
                    <AlignCenter>
                      <Icon icon={arrow} rotate={180} />
                      <span>Previous</span>
                    </AlignCenter>
                  </NextLink>
                )}
              </div>
              <div>
                {stopNumber < allStops.length && (
                  <NextLink
                    style={{ textDecoration: 'none' }}
                    href={`${guideTypeUrl}/${stopNumber + 1}`}
                    shallow={true}
                  >
                    <AlignCenter>
                      <span>Next</span>
                      <Icon icon={arrow} />
                    </AlignCenter>
                  </NextLink>
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
