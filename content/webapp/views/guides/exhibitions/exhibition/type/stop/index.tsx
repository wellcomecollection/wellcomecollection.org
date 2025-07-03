import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { arrow, cross } from '@weco/common/icons';
import { getCrop } from '@weco/common/model/image';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import AudioPlayer from '@weco/common/views/components/AudioPlayer';
import CollapsibleContent from '@weco/common/views/components/CollapsibleContent';
import Icon from '@weco/common/views/components/Icon';
import ImagePlaceholder, {
  placeholderBackgroundColor,
} from '@weco/common/views/components/ImagePlaceholder';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import {
  ContaineredLayout,
  gridSize8,
} from '@weco/common/views/components/Layout';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import VideoEmbed from '@weco/common/views/components/VideoEmbed';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import {
  ExhibitionGuideType,
  ExhibitionHighlightTour,
  GuideHighlightTour,
} from '@weco/content/types/exhibition-guides';

import {
  AlignCenter,
  AudioPlayerNewWrapper,
  FlushContainer,
  Header,
  HeaderInner,
  Page,
  PrevNext,
  StickyPlayer,
} from './stop.styles';

export type Props = {
  jsonLd: JsonLdObj;
  type: ExhibitionGuideType;
  currentStopServerSide: GuideHighlightTour;
  exhibitionGuideId: string;
  exhibitionTitle: string;
  stopNumberServerSide: number;
  exhibitionGuide: ExhibitionHighlightTour;
  allStops: GuideHighlightTour[];
};

const ExhibitionGuideStopPage: FunctionComponent<Props> = ({
  jsonLd,
  type,
  currentStopServerSide,
  exhibitionGuideId,
  exhibitionTitle,
  stopNumberServerSide,
  exhibitionGuide,
  allStops,
}) => {
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
        <Header ref={headerRef}>
          <Container>
            <HeaderInner>
              <div>
                <span>{exhibitionTitle}</span>
                <h1 style={{ marginBottom: '0' }}>
                  Stop {stopNumber}/{allStops.length}: {currentStop.title}
                </h1>
              </div>
              <span>
                <NextLink href={`${guideTypeUrl}#${currentStop.number}`}>
                  <Icon icon={cross} />
                  <span className="visually-hidden">Back to list of stops</span>
                </NextLink>
              </span>
            </HeaderInner>
          </Container>
        </Header>
        <div>
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
              {type === 'bsl' && (
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
              )}
            </StickyPlayer>
            {/* Make sure we can scroll content into view if it's behind the fixed position footer (paddingBottom: 100px) */}

            {!!relatedText?.length && (
              <Space
                $v={{
                  size: 'xl',
                  properties: ['padding-bottom', 'margin-bottom'],
                }}
                style={{ paddingBottom: '200px' }}
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

        {type === 'audio-without-descriptions' && currentStop.audio && (
          <AudioPlayerNewWrapper>
            <Container>
              <AudioPlayer audioFile={currentStop.audio} isDark={true} />
            </Container>
          </AudioPlayerNewWrapper>
        )}

        <PrevNext>
          <Container>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                {stopNumber > 1 && (
                  <NextLink
                    style={{
                      textDecoration: 'none',
                      display: 'inline-block',
                    }}
                    href={`${guideTypeUrl}/${stopNumber - 1}`}
                    shallow={true}
                  >
                    <Space
                      $v={{
                        size: 's',
                        properties: ['padding-top', 'padding-bottom'],
                        overrides: { small: 4, medium: 4, large: 4 },
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
                  >
                    <Space
                      $v={{
                        size: 's',
                        properties: ['padding-top', 'padding-bottom'],
                        overrides: { small: 4, medium: 4, large: 4 },
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

export default ExhibitionGuideStopPage;
