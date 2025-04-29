import { SliceZone } from '@prismicio/react';
import { deleteCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import cookies from '@weco/common/data/cookies';
import { pageDescriptions } from '@weco/common/data/microcopy';
import {
  ExhibitionHighlightToursDocument,
  ExhibitionTextsDocument,
} from '@weco/common/prismicio-types';
import { getServerData } from '@weco/common/server-data';
import { AppErrorProps } from '@weco/common/services/app';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { font } from '@weco/common/utils/classnames';
import { serialiseProps } from '@weco/common/utils/json';
import { toMaybeString } from '@weco/common/utils/routes';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { exhibitionGuidesLinks } from '@weco/common/views/components/Header';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import {
  ContaineredLayout,
  gridSize10,
  gridSize8,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import PageLayout from '@weco/common/views/components/PageLayout';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { components } from '@weco/common/views/slices';
import RelevantGuideIcons from '@weco/content/components/ExhibitionGuideRelevantIcons';
import ExhibitionGuideStops from '@weco/content/components/ExhibitionGuideStops';
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
import {
  ExhibitionGuide,
  ExhibitionGuideType,
  ExhibitionHighlightTour,
  ExhibitionText,
  isValidExhibitionGuideType,
} from '@weco/content/types/exhibition-guides';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

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

function getTypeTitle(type: ExhibitionGuideType): string | undefined {
  switch (type) {
    case 'bsl':
      return 'British Sign Language tour with subtitles';
    case 'audio-without-descriptions':
      return 'Audio highlight tour with transcripts';
    case 'captions-and-transcripts':
      return 'Exhibition text';
    default:
      return undefined;
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

const ExhibitionGuidePage: FunctionComponent<Props> = props => {
  const { exhibitionGuide, jsonLd, type, userPreferenceSet } = props;
  const pathname = `${linkResolver(exhibitionGuide)}/${type}`;

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
      title={`${exhibitionGuide.title} ${getTypeTitle(type) || ''}`}
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
              url: linkResolver(exhibitionGuide),
              isHidden: !exhibitionGuide.relatedExhibition,
            },
          ],
          noHomeLink: true,
        }}
        isSlim
      />

      <ContaineredLayout gridSizes={gridSize8(false)}>
        <h2 className={font('intsb', 4)}>{getTypeTitle(type)}</h2>

        {exhibitionGuide.introText?.length > 0 ? (
          <PrismicHtmlBlock html={exhibitionGuide.introText} />
        ) : (
          exhibitionGuide.relatedExhibition?.description && (
            <p>{exhibitionGuide.relatedExhibition.description}</p>
          )
        )}

        <RelevantGuideIcons types={[type]} />
      </ContaineredLayout>

      <Space $v={{ size: 'l', properties: ['margin-top'] }}>
        <ContaineredLayout gridSizes={gridSize10(false)}>
          {userPreferenceSet && (
            <p>
              You selected this type of guide previously, but you can also
              select{' '}
              <a
                href={linkResolver(exhibitionGuide)}
                onClick={() => {
                  deleteCookie(cookies.exhibitionGuideType);
                }}
              >
                another type of guide.
              </a>
            </p>
          )}
        </ContaineredLayout>
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
          <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
            <Grid>
              <SliceZone
                slices={exhibitionGuide.stops}
                components={components}
                context={{ type, exhibitionGuide }}
              />
            </Grid>
          </Space>
        </Container>
      )}
    </PageLayout>
  );
};

export default ExhibitionGuidePage;
