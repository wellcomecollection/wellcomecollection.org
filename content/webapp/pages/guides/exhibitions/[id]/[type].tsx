import { getCookie, deleteCookie } from 'cookies-next';
import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { GetServerSideProps } from 'next';
import {
  ExhibitionGuide,
  ExhibitionText,
  ExhibitionHighlightTour,
  ExhibitionGuideType,
  isValidType,
} from '@weco/content/types/exhibition-guides';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchExhibitionGuide } from '@weco/content/services/prismic/fetch/exhibition-guides';
import { fetchExhibitionText } from '@weco/content/services/prismic/fetch/exhibition-texts';
import { fetchExhibitionHighlightTour } from '@weco/content/services/prismic/fetch/exhibition-highlight-tours';
import {
  filterExhibitionGuideComponents,
  transformExhibitionGuide,
} from '@weco/content/services/prismic/transformers/exhibition-guides';
import { transformExhibitionTexts } from '@weco/content/services/prismic/transformers/exhibition-texts';
import { transformExhibitionHighlightTours } from '@weco/content/services/prismic/transformers/exhibition-highlight-tours';
import { serialiseProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { exhibitionGuideLd } from '@weco/content/services/prismic/transformers/json-ld';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { AppErrorProps } from '@weco/common/services/app';
import cookies from '@weco/common/data/cookies';
import useHotjar from '@weco/content/hooks/useHotjar';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { useToggles } from '@weco/common/server-data/Context';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { pageDescriptions } from '@weco/common/data/microcopy';
import Layout, {
  gridSize10,
  gridSize8,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import { exhibitionGuidesLinks } from '@weco/common/views/components/Header/Header';
import Button from '@weco/common/views/components/Buttons';
import { themeValues, PaletteColor } from '@weco/common/views/themes/config';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import ExhibitionGuideStops from '@weco/content/components/ExhibitionGuideStops/ExhibitionGuideStops';
import { getTypeColor } from '@weco/content/components/ExhibitionCaptions/ExhibitionCaptions';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { font } from '@weco/common/utils/classnames';
import { SliceZone } from '@prismicio/react';
import { components } from '@weco/common/views/slices';
import { Container } from '@weco/common/views/components/styled/Container';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';
import RelevantGuideIcons from '@weco/content/components/ExhibitionGuideRelevantIcons';

const ButtonWrapper = styled(Space).attrs({
  $v: { size: 's', properties: ['margin-bottom'] },
  $h: { size: 's', properties: ['margin-right'] },
})`
  display: inline-block;
`;

const Header = styled(Space).attrs({
  $v: {
    size: 'xl',
    properties: ['padding-top', 'padding-bottom', 'margin-bottom'],
  },
})<{ $backgroundColor: PaletteColor }>`
  background: ${props => props.theme.color(props.$backgroundColor)};
`;

const isExhibitionGuide = (
  item: ExhibitionGuide | ExhibitionText | ExhibitionHighlightTour
): item is ExhibitionGuide => {
  return 'components' in item;
};

const isExhibitionHighlightTour = (
  item: ExhibitionGuide | ExhibitionText | ExhibitionHighlightTour
): item is ExhibitionHighlightTour => {
  return 'stops' in item;
};

const isExhibitionText = (
  item: ExhibitionGuide | ExhibitionText | ExhibitionHighlightTour
): item is ExhibitionText => {
  return 'textItems' in item;
};

function getTypeTitle(type: ExhibitionGuideType, egWork?: boolean): string {
  switch (type) {
    case 'bsl':
      return egWork
        ? 'British Sign Language tour with subtitles'
        : 'British Sign Language videos';
    case 'audio-without-descriptions':
      return egWork ? 'Audio highlight tour with transcripts' : 'Audio';
    case 'captions-and-transcripts':
      return egWork ? 'Exhibition text' : 'Captions and transcripts';
  }
}

type Props = {
  exhibitionGuide: ExhibitionGuide | ExhibitionText | ExhibitionHighlightTour;
  jsonLd: JsonLdObj;
  type: ExhibitionGuideType;
  userPreferenceSet?: string | string[];
  stopId?: string;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const { id, type, usingQRCode, userPreferenceSet, stopId } = context.query;

  if (!looksLikePrismicId(id) || !isValidType(type)) {
    return { notFound: true };
  }
  const { res, req } = context;

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

  const [
    exhibitionGuideQuery,
    exhibitionTextQuery,
    exhibitionHighlightTourQuery,
  ] = await Promise.all([
    exhibitionGuideQueryPromise,
    exhibitionTextQueryPromise,
    exhibitionHighlightTourQueryPromise,
  ]);

  const userPreferenceGuideType = getCookie(cookies.exhibitionGuideType, {
    req,
    res,
  });

  /** When a user opens an exhibition guide on their smartphone, they can
   * choose which guide to read.  To avoid somebody having to repeatedly select
   * the same exhibition guide, we "remember" which guide they select in a cookie,
   * and redirect them the next time they open the guide.
   *
   * This logic is deliberately conservative, to avoid causing more confusion:
   *
   *    - We only redirect users who've scanned a QR code in the gallery
   *    - We only redirect users who've expressed an explicit preference for
   *      a non-default guide type
   *
   * == Historical note ==
   *
   * The original implementation of this was more aggressive: in particular,
   * it would redirect a user who landed on a guide page, even if they didn't
   * come from scanning a QR code.
   *
   * We changed it after discovering it broke the "Back" button:
   *
   *    1.  A user goes to an exhibition guide overview page `/guides/exhibitions/[id]`
   *    2.  They click to select a particular guide, say `/guides/exhibitions/[id]/audio`.
   *        This sets a preference cookie telling us the user wants audio guides.
   *    3.  They click the "Back" button in their browser because they want to see the
   *        page they were just looking at. This takes them to `/guides/exhibitions/[id]`
   *        … where we redirect them back to the guide they were just looking at.
   *
   * We only create QR codes that link to the audio guides, not the overview page, so
   * this prevents somebody getting stuck in this sort of redirect loop.
   *
   */

  if (
    usingQRCode &&
    typeof userPreferenceGuideType === 'string' &&
    userPreferenceGuideType !== type &&
    typeof stopId === 'string'
  ) {
    return {
      redirect: {
        permanent: false,
        // We do a simple replace on the URL so we preserve all other URL information
        // (e.g. UTM tracking parameters).
        destination: context.resolvedUrl.replace(
          `/${type}`,
          `/${userPreferenceGuideType}`
        ),
      },
    };
  }

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
          stopId: stopId as string | undefined,
        }),
      };
    }

    // If we're dealing with and ExhibitionText
    if (isNotUndefined(exhibitionTextQuery)) {
      const exhibitionText = transformExhibitionTexts(exhibitionTextQuery);
      const jsonLd = exhibitionGuideLd(exhibitionText);
      return {
        props: serialiseProps({
          exhibitionGuide: exhibitionText,
          jsonLd,
          serverData,
          type,
          userPreferenceSet,
          stopId: stopId as string | undefined,
        }),
      };
    }

    // If we're dealing with an ExhibitionHighlightTour
    if (isNotUndefined(exhibitionHighlightTourQuery)) {
      const exhibitionHighlightTour = transformExhibitionHighlightTours(
        exhibitionHighlightTourQuery
      );
      const jsonLd = exhibitionGuideLd(exhibitionHighlightTour);
      return {
        props: serialiseProps({
          exhibitionGuide: exhibitionHighlightTour,
          jsonLd,
          serverData,
          type,
          userPreferenceSet,
          stopId: stopId as string | undefined,
        }),
      };
    }
  }

  return { notFound: true };
};

const ExhibitionGuidePage: FunctionComponent<Props> = props => {
  useHotjar(true);

  const { egWork } = useToggles();
  const { exhibitionGuide, jsonLd, type, userPreferenceSet } = props;
  const pathname = `guides/exhibitions/${exhibitionGuide.id}/${type}`;
  const typeColor = getTypeColor(type);
  const numberOfStops =
    (isExhibitionGuide(exhibitionGuide) &&
      exhibitionGuide.components?.filter(c => c.number).length) ||
    (isExhibitionHighlightTour(exhibitionGuide) &&
      exhibitionGuide.stops?.length);

  const thisStopTitle = props.stopId
    ? isExhibitionGuide(exhibitionGuide) &&
      exhibitionGuide.components.find(c => c.anchorId === props.stopId)
        ?.displayTitle
    : undefined;

  const skipToContentLinks =
    props.stopId && thisStopTitle
      ? [
          {
            anchorId: props.stopId,
            label: `Skip to '${thisStopTitle}'`,
          },
        ]
      : [];

  return (
    <PageLayout
      title={
        `${exhibitionGuide.title} ${type ? getTypeTitle(type, egWork) : ''}` ||
        ''
      }
      description={pageDescriptions.exhibitionGuides}
      url={{ pathname }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection="exhibition-guides"
      image={exhibitionGuide.image}
      headerProps={{
        customNavLinks: exhibitionGuidesLinks,
        isMinimalHeader: true,
      }}
      hideNewsletterPromo={true}
      apiToolbarLinks={[createPrismicLink(exhibitionGuide.id)]}
      skipToContentLinks={skipToContentLinks}
    >
      <ConditionalWrapper
        condition={!egWork}
        wrapper={children => (
          <Header $backgroundColor={typeColor}>{children}</Header>
        )}
      >
        {egWork && (
          <PageHeader
            title={exhibitionGuide.title}
            breadcrumbs={{
              items: [
                {
                  text: 'Digital Guides',
                  url: `/guides/exhibitions`,
                },
                {
                  text: `${exhibitionGuide.relatedExhibition?.title} Digital Guides`,
                  url: `/guides/exhibitions/${exhibitionGuide.id}`,
                  isHidden: !exhibitionGuide.relatedExhibition,
                },
              ],
              noHomeLink: true,
            }}
            isSlim
          />
        )}

        <Layout gridSizes={gridSize8(false)}>
          {egWork ? (
            <h2 className={font('intsb', 3)}>{getTypeTitle(type, egWork)}</h2>
          ) : (
            <h1 className={font('wb', 1)}>
              {exhibitionGuide.title}{' '}
              <div className={font('wb', 2)}>{getTypeTitle(type, egWork)}</div>
            </h1>
          )}

          {exhibitionGuide.introText?.length > 0 ? (
            <PrismicHtmlBlock html={exhibitionGuide.introText} />
          ) : (
            exhibitionGuide.relatedExhibition?.description && (
              <p>{exhibitionGuide.relatedExhibition.description}</p>
            )
          )}

          {egWork ? (
            <RelevantGuideIcons types={[type]} />
          ) : (
            <>
              <ButtonWrapper>
                <Button
                  variant="ButtonSolidLink"
                  colors={themeValues.buttonColors.charcoalWhiteCharcoal}
                  text="Change guide type"
                  link={`/guides/exhibitions/${exhibitionGuide.id}`}
                  clickHandler={() => {
                    deleteCookie(cookies.exhibitionGuideType);
                  }}
                />
              </ButtonWrapper>
              <Button
                variant="ButtonSolidLink"
                colors={themeValues.buttonColors.charcoalWhiteCharcoal}
                text="Change exhibition"
                link="/guides/exhibitions"
              />
            </>
          )}
        </Layout>
      </ConditionalWrapper>

      <Space $v={{ size: 'l', properties: ['margin-top'] }}>
        <Layout gridSizes={gridSize10(false)}>
          {userPreferenceSet ? (
            <p>
              {type !== 'captions-and-transcripts' && (
                <>This exhibition has {numberOfStops} stops. </>
              )}
              You selected this type of guide previously, but you can also
              select{' '}
              <a
                href={`/guides/exhibitions/${exhibitionGuide.id}`}
                onClick={() => {
                  deleteCookie(cookies.exhibitionGuideType);
                }}
              >
                another type of guide.
              </a>
            </p>
          ) : (
            <>
              {type !== 'captions-and-transcripts' && (
                <p>This exhibition has {numberOfStops} stops.</p>
              )}
            </>
          )}
        </Layout>
      </Space>

      {/* For deprecated ExhibitionGuides */}
      {isExhibitionGuide(exhibitionGuide) &&
        exhibitionGuide.components?.length > 0 && (
          <ExhibitionGuideStops
            type={type}
            stops={exhibitionGuide.components}
          />
        )}
      {/* For ExhibitionTexts */}
      {isExhibitionText(exhibitionGuide) && (
        <SliceZone slices={exhibitionGuide.textItems} components={components} />
      )}
      {/* For ExhibitionHighlightTours - audio/video */}
      {isExhibitionHighlightTour(exhibitionGuide) && (
        <Container>
          <div className="grid">
            <SliceZone
              slices={exhibitionGuide.stops}
              components={components}
              context={{ type, id: exhibitionGuide.id }}
            />
          </div>
        </Container>
      )}
    </PageLayout>
  );
};

export default ExhibitionGuidePage;
