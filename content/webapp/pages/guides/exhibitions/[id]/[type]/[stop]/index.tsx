import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { arrow, cross } from '@weco/common/icons';
import { getCrop } from '@weco/common/model/image';
import { getServerData } from '@weco/common/server-data';
import { useToggles } from '@weco/common/server-data/Context';
import { AppErrorProps } from '@weco/common/services/app';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { isFilledSliceZone } from '@weco/common/services/prismic/types';
import { font } from '@weco/common/utils/classnames';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import CollapsibleContent from '@weco/common/views/components/CollapsibleContent';
import Icon from '@weco/common/views/components/Icon/Icon';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import {
  ContaineredLayout,
  gridSize8,
} from '@weco/common/views/components/Layout';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import VideoEmbed from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import AudioPlayer from '@weco/content/components/AudioPlayer/AudioPlayer';
import AudioPlayerNew from '@weco/content/components/AudioPlayerNew/AudioPlayer';
import ImagePlaceholder, {
  placeholderBackgroundColor,
} from '@weco/content/components/ImagePlaceholder/ImagePlaceholder';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchExhibitionHighlightTour } from '@weco/content/services/prismic/fetch/exhibition-highlight-tours';
import {
  transformExhibitionHighlightTours,
  transformGuideStopSlice,
} from '@weco/content/services/prismic/transformers/exhibition-highlight-tours';
import { exhibitionGuideLd } from '@weco/content/services/prismic/transformers/json-ld';
import {
  ExhibitionGuideType,
  ExhibitionHighlightTour,
  GuideHighlightTour,
  isValidExhibitionGuideType,
} from '@weco/content/types/exhibition-guides';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

type Props = {
  jsonLd: JsonLdObj;
  type: ExhibitionGuideType;
  currentStopServerSide: GuideHighlightTour;
  exhibitionGuideId: string;
  exhibitionTitle: string;
  stopNumberServerSide: number;
  exhibitionGuide: ExhibitionHighlightTour;
  allStops: GuideHighlightTour[];
};

const Page = styled.div`
  background-color: ${props => props.theme.color('black')};
  color: ${props => props.theme.color('white')};
  min-height: 100vh;
`;

const FlushContainer = styled(Container)`
  ${props =>
    props.theme.mediaBetween(
      'small',
      'medium'
    )(`
        padding: 0;
    `)}
`;

const Header = styled.header.attrs({
  className: font('intr', 5),
})`
  background-color: ${props => props.theme.color('neutral.700')};
  position: sticky;
  top: 0;
  z-index: 2;
`;

const HeaderInner = styled(Space).attrs({
  $v: {
    size: 's',
    properties: ['padding-top', 'padding-bottom'],
  },
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PrevNext = styled.div.attrs({
  className: font('intr', 5),
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

  margin-left: -${props => props.theme.gutter.small}px;
  margin-right: -${props => props.theme.gutter.small}px;

  ${props => props.theme.media('medium')`
    margin-left: 0;
    margin-right: 0;
  `}

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
      props: serialiseProps({
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

const ExhibitionGuidePage: FunctionComponent<Props> = props => {
  const {
    jsonLd,
    type,
    currentStopServerSide,
    exhibitionGuideId,
    exhibitionTitle,
    stopNumberServerSide,
    exhibitionGuide,
    allStops,
  } = props;
  // We use the `shallow` prop with NextLinks to avoid doing an unnecessary
  // `getServerSideProps` using the Previous/Next links, because we already have
  // all the data we need and can work it out client side
  const router = useRouter();
  const [stopNumber, setStopNumber] = useState(stopNumberServerSide);
  const [currentStop, setCurrentStop] = useState(currentStopServerSide);
  const [headerEl, setHeaderEl] = useState<HTMLElement>();
  const guideUrl = linkResolver(exhibitionGuide);
  const guideTypeUrl = `${guideUrl}/${type}`;
  const pathname = `${guideTypeUrl}/${stopNumber}`;
  const { audioPlayer } = useToggles();
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

  const [viewTransitionName, setViewTransitionName] = useState(
    `player-${currentStop.number}`
  );

  // Because we've given the page the appearance of a modal, we handle the case
  // where someone hits 'Escape' as an intention to return to the previous state (page)
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        const prev = `${guideTypeUrl}#${currentStop.number}`;
        setViewTransitionName(`player-${currentStop.number}`);

        if (!document.startViewTransition) {
          router.push(prev);
        }

        document.startViewTransition(() => router.push(prev));
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setStopNumber(Number(router.query.stop));
    const newStop = allStops.find(s => s.number === Number(router.query.stop));
    if (newStop) {
      setCurrentStop(newStop);
      window.scrollTo(0, 0);
    }
  }, [router.query.stop]);

  const controlText = {
    defaultText: type === 'bsl' ? 'Read subtitles' : 'Read audio transcript',
    contentShowingText:
      type === 'bsl' ? 'Hide subtitles' : 'Hide audio transcript',
  };
  const croppedImage =
    (currentStop.image && getCrop(currentStop.image, '16:9')) ||
    currentStop.image;

  const relatedText =
    type === 'bsl' ? currentStop.subtitles : currentStop.transcript;

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
        {/* Header needs a view-transition-name even though it isn't transitioning: https://www.nicchan.me/blog/view-transitions-and-stacking-context/#the-workaround */}
        <Header ref={headerRef} style={{ viewTransitionName: 'header' }}>
          <Container>
            <HeaderInner>
              <div>
                <span>{exhibitionTitle}</span>
                <h1 style={{ marginBottom: '0' }}>
                  Stop {stopNumber}/{allStops.length}: {currentStop.title}
                </h1>
              </div>
              <span>
                <NextLink
                  href={`${guideTypeUrl}#${currentStop.number}`}
                  onFocus={() =>
                    setViewTransitionName(`player-${currentStop.number}`)
                  }
                  onMouseEnter={() =>
                    setViewTransitionName(`player-${currentStop.number}`)
                  }
                >
                  <Icon icon={cross} />
                  <span className="visually-hidden">Back to list of stops</span>
                </NextLink>
              </span>
            </HeaderInner>
          </Container>
        </Header>
        <div style={{ viewTransitionName }}>
          <FlushContainer>
            <Grid>
              <GridCell $sizeMap={gridSize8()}>
                {type !== 'bsl' && (
                  <>
                    {croppedImage ? (
                      <PrismicImage quality="low" image={croppedImage} />
                    ) : (
                      <div
                        style={{
                          aspectRatio: '16/9',
                          overflow: 'hidden',
                        }}
                      >
                        <ImagePlaceholder
                          backgroundColor={placeholderBackgroundColor(
                            stopNumber
                          )}
                        />
                      </div>
                    )}
                  </>
                )}
              </GridCell>
            </Grid>
          </FlushContainer>

          <ContaineredLayout gridSizes={gridSize8()}>
            <StickyPlayer $sticky={type !== 'bsl'}>
              {type === 'bsl' ? (
                <>
                  {currentStop.video && (
                    <VideoEmbed
                      embedUrl={currentStop.video}
                      videoThumbnail={currentStop.videoThumbnail}
                      videoProvider={currentStop.videoProvider}
                      hasFullSizePoster={true}
                    />
                  )}
                </>
              ) : (
                <>
                  {currentStop.audio && (
                    <>
                      {audioPlayer ? (
                        <AudioPlayerNew
                          title=""
                          audioFile={currentStop.audio}
                          isDark={true}
                        />
                      ) : (
                        <AudioPlayerWrapper>
                          <AudioPlayer title="" audioFile={currentStop.audio} />
                        </AudioPlayerWrapper>
                      )}
                    </>
                  )}
                </>
              )}
            </StickyPlayer>
            {/* Make sure we can scroll content into view if it's behind the fixed position footer (paddingBottom: 100px) */}

            {!!relatedText?.length && (
              <Space
                $v={{
                  size: 'xl',
                  properties: ['padding-bottom', 'margin-bottom'],
                }}
              >
                <Space $v={{ size: 'l', properties: ['padding-top'] }}>
                  <CollapsibleContent
                    controlText={controlText}
                    id="stop-transcript"
                    darkTheme={true}
                  >
                    <PrismicHtmlBlock html={relatedText} />
                  </CollapsibleContent>
                </Space>
              </Space>
            )}
          </ContaineredLayout>
        </div>
        {/* PrevNext needs a view-transition-name even though it isn't transitioning: https://www.nicchan.me/blog/view-transitions-and-stacking-context/#the-workaround */}
        <PrevNext style={{ viewTransitionName: 'prevnext' }}>
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
                    style={{
                      textDecoration: 'none',
                      display: 'inline-block',
                    }}
                    href={`${guideTypeUrl}/${stopNumber - 1}`}
                    shallow={true}
                    onFocus={() => setViewTransitionName('player-previous')}
                    onMouseEnter={() =>
                      setViewTransitionName('player-previous')
                    }
                  >
                    <Space
                      $v={{
                        size: 'm',
                        properties: ['padding-top', 'padding-bottom'],
                        overrides: { small: 4 },
                      }}
                    >
                      <AlignCenter>
                        <Space
                          $h={{ size: 'm', properties: ['margin-right'] }}
                          style={{ display: 'flex' }}
                        >
                          <Icon icon={arrow} rotate={180} />
                        </Space>
                        <span>Previous</span>
                      </AlignCenter>
                    </Space>
                  </NextLink>
                )}
              </div>
              <div>
                {stopNumber < allStops.length && (
                  <NextLink
                    style={{
                      textDecoration: 'none',
                      display: 'inline-block',
                    }}
                    href={`${guideTypeUrl}/${stopNumber + 1}`}
                    shallow={true}
                    onFocus={() => setViewTransitionName('player-next')}
                    onMouseEnter={() => setViewTransitionName('player-next')}
                  >
                    <Space
                      $v={{
                        size: 'm',
                        properties: ['padding-top', 'padding-bottom'],
                        overrides: { small: 4 },
                      }}
                    >
                      <AlignCenter>
                        <Space
                          $h={{ size: 'm', properties: ['margin-right'] }}
                          style={{ display: 'flex' }}
                        >
                          <span>Next</span>
                        </Space>
                        <Icon icon={arrow} />
                      </AlignCenter>
                    </Space>
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
