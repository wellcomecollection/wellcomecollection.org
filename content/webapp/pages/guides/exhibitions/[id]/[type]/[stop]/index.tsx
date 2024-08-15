import { FunctionComponent, useRef, useEffect, useState } from 'react';
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
  currentStop: GuideHighlightTour;
  exhibitionGuideId: string;
  exhibitionTitle: string;
  stopNumber: number;
  allStops: GuideHighlightTour[];
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
    const exhibitionHighlightTour = transformExhibitionHighlightTours(
      exhibitionHighlightTourQuery
    );
    const exhibitionTitle = exhibitionHighlightTour.title;
    const jsonLd = exhibitionGuideLd(exhibitionHighlightTour);
    const stopNumber = Number(stop);

    const allStops = isFilledSliceZone(exhibitionHighlightTour.stops)
      ? exhibitionHighlightTour.stops.map(transformGuideStopSlice)
      : undefined;
    const rawCurrentStop = isFilledSliceZone(exhibitionHighlightTour.stops)
      ? exhibitionHighlightTour.stops.find(s => s.primary.number === stopNumber)
      : undefined;
    const currentStop =
      rawCurrentStop && transformGuideStopSlice(rawCurrentStop);

    if (!currentStop || !allStops) {
      return { notFound: true };
    }

    return {
      props: serialiseProps({
        currentStop,
        jsonLd,
        serverData,
        type,
        stopNumber,
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
    currentStop,
    exhibitionGuideId,
    exhibitionTitle,
    stopNumber,
    allStops,
  } = props;
  const headerRef = useRef(null);

  // We use the `shallow` prop with NextLinks to avoid doing an unnecessary
  // `getServerSideProps` using the Previous/Next liks, because we already have
  // all the data we need and can work it out client side
  const router = useRouter();
  const [stopNumberClientSide, setStopNumberClientSide] = useState(stopNumber);
  const [currentStopClientSide, setCurrentStopClientSide] =
    useState(currentStop);

  useEffect(() => {
    setStopNumberClientSide(Number(router.query.stop));
    const newStop = allStops.find(s => s.number === Number(router.query.stop));
    if (newStop) {
      setCurrentStopClientSide(newStop);
    }
  }, [router.query.stop]);

  useEffect(() => {
    // We measure the height of the Header element with a ResizeObserver and
    // update the sticky top position of the StickyPlayer element any time it
    // changes
    const resizeObserver = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty(
        '--stop-header-height',
        `${entry.contentRect.height}px`
      );
    });

    if (headerRef.current) {
      resizeObserver.observe(headerRef?.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [headerRef.current]);

  const guideTypeUrl = `/guides/exhibitions/${exhibitionGuideId}/${type}`;
  const pathname = `${guideTypeUrl}/${stopNumberClientSide}`;
  const controlText = {
    defaultText: type === 'bsl' ? 'Read subtitles' : 'Read audio transcript',
    contentShowingText:
      type === 'bsl' ? 'Hide subtitles' : 'Hide audio transcript',
  };
  const croppedImage =
    (currentStopClientSide.image &&
      getCrop(currentStopClientSide.image, '16:9')) ||
    currentStopClientSide.image;

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

  return (
    <PageLayout
      title={currentStopClientSide.title}
      description={pageDescriptions.exhibitionGuides}
      url={{ pathname }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection="exhibition-guides"
      image={currentStopClientSide.image}
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
                      Stop {stopNumberClientSide}/{allStops.length}:
                    </Space>
                    <h1 style={{ display: 'inline-block', marginBottom: '0' }}>
                      {currentStopClientSide.title}
                    </h1>
                  </AlignCenter>
                </AlignCenter>
              </div>
              <span>
                <NextLink href={`${guideTypeUrl}#${stopNumberClientSide}`}>
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
                    backgroundColor={placeholderBackgroundColor(
                      stopNumberClientSide
                    )}
                  />
                </div>
              )}
            </>
          )}
          <StickyPlayer $sticky={type !== 'bsl'}>
            {type === 'bsl' ? (
              <>
                {currentStopClientSide.video && (
                  <VideoEmbed embedUrl={currentStopClientSide.video} />
                )}
              </>
            ) : (
              <>
                {currentStopClientSide.audio && (
                  <AudioPlayerWrapper>
                    <AudioPlayer
                      title=""
                      audioFile={currentStopClientSide.audio}
                    />
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
                    ? currentStopClientSide.subtitles!
                    : currentStopClientSide.transcript!
                }
              />
            </CollapsibleContent>
          </Space>
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
                {stopNumberClientSide > 1 && (
                  <NextLink
                    style={{ textDecoration: 'none' }}
                    href={`${guideTypeUrl}/${stopNumberClientSide - 1}`}
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
                {stopNumberClientSide < allStops.length && (
                  <NextLink
                    style={{ textDecoration: 'none' }}
                    href={`${guideTypeUrl}/${stopNumberClientSide + 1}`}
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
