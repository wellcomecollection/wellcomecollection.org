import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';
import * as prismic from '@prismicio/client';
import {
  ExhibitionGuide,
  ExhibitionGuideBasic,
  ExhibitionText,
  ExhibitionHighlightTour,
} from '@weco/content/types/exhibition-guides';
import { GuideStopSlice } from '@weco/common/prismicio-types';
import { createClient } from '@weco/content/services/prismic/fetch';
import {
  fetchExhibitionGuide,
  fetchExhibitionGuides,
} from '@weco/content/services/prismic/fetch/exhibition-guides';
import {
  fetchExhibitionText,
  fetchExhibitionTexts,
} from '@weco/content/services/prismic/fetch/exhibition-texts';
import {
  fetchExhibitionHighlightTour,
  fetchExhibitionHighlightTours,
} from '@weco/content/services/prismic/fetch/exhibition-highlight-tours';
import { transformExhibitionGuide } from '@weco/content/services/prismic/transformers/exhibition-guides';
import {
  transformExhibitionTexts,
  transformExhibitionTextsQuery,
} from '@weco/content/services/prismic/transformers/exhibition-texts';
import {
  transformExhibitionHighlightTours,
  transformExhibitionHighlightToursQuery,
} from '@weco/content/services/prismic/transformers/exhibition-highlight-tours';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import { isFilledLinkToMediaField } from '@weco/common/services/prismic/types/';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { font } from '@weco/common/utils/classnames';
import { serialiseProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { exhibitionGuideLd } from '@weco/content/services/prismic/transformers/json-ld';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import Layout, { gridSize10 } from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import { AppErrorProps } from '@weco/common/services/app';
import { exhibitionGuidesLinks } from '@weco/common/views/components/Header/Header';
import OtherExhibitionGuides from '@weco/content/components/OtherExhibitionGuides/OtherExhibitionGuides';
import {
  ExhibitionGuideLinks,
  ExhibitionResourceLinks,
} from '@weco/content/components/ExhibitionGuideLinks/ExhibitionGuideLinks';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { allGuides } from '@weco/content/pages/guides/exhibitions';

// N.B. There are quite a lot of requests to Prismic for this page, which are necessary in order to maintain the url structure
// while supporting both the deprecated ExhibitionGuide type and new custom types
// We are looking to change the url structure for this and related pages, see: https://docs.google.com/document/d/17xPEfOFAFzBeFopkKUAWUTyBo89lPzoSSV5o_4Ri8NQ/edit#heading=h.l7pem7f5wz3f
// At which point we'll have the exhibition id in the url and can query the types directly, filtering by the exhibition id

type Props = {
  exhibitionGuide?: ExhibitionGuide;
  exhibitionText?: ExhibitionText;
  exhibitionHighlightTour?: ExhibitionHighlightTour;
  jsonLd: JsonLdObj;
  otherExhibitionGuides: ExhibitionGuideBasic[];
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const { id } = context.query;

  if (!looksLikePrismicId(id)) {
    return { notFound: true };
  }

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

  // We fetch all the guides so that we can display links to other guides
  const exhibitionGuidesQueryPromise = fetchExhibitionGuides(client, {
    page: 1,
  });
  const exhibitionTextsQueryPromise = fetchExhibitionTexts(client, {
    page: 1,
  });
  const exhibitionHighlightToursQueryPromise = fetchExhibitionHighlightTours(
    client,
    {
      page: 1,
    }
  );

  const [
    exhibitionGuideQuery,
    exhibitionTextQuery,
    exhibitionHighlightTourQuery,
    exhibitionGuidesQuery,
    exhibitionTextsQuery,
    exhibitionHighlightToursQuery,
  ] = await Promise.all([
    exhibitionGuideQueryPromise,
    exhibitionTextQueryPromise,
    exhibitionHighlightTourQueryPromise,
    exhibitionGuidesQueryPromise,
    exhibitionTextsQueryPromise,
    exhibitionHighlightToursQueryPromise,
  ]);

  if (
    isNotUndefined(exhibitionGuideQuery || exhibitionTextQuery) ||
    exhibitionHighlightTourQuery
  ) {
    const serverData = await getServerData(context);

    const exhibitionGuides = transformQuery(
      exhibitionGuidesQuery,
      transformExhibitionGuide
    );

    const exhibitionTexts = transformQuery(
      exhibitionTextsQuery,
      transformExhibitionTexts
    );

    const exhibitionHighlightTours = transformQuery(
      exhibitionHighlightToursQuery,
      transformExhibitionHighlightTours
    );

    const guides = allGuides({
      exhibitionTexts,
      exhibitionHighlightTours,
      exhibitionGuides,
    });

    // If we're dealing with the deprecated ExhibitionGuides
    if (isNotUndefined(exhibitionGuideQuery)) {
      // We don't need to send data about individual components to the page, so
      // remove it here.
      const exhibitionGuide = {
        ...transformExhibitionGuide(exhibitionGuideQuery),
        components: [],
      };

      const jsonLd = exhibitionGuideLd(exhibitionGuide);

      return {
        props: serialiseProps({
          exhibitionGuide,
          jsonLd,
          serverData,
          otherExhibitionGuides: guides.results.filter(
            result => result.title !== exhibitionGuide?.title
          ),
        }),
      };
    }

    // If we're dealing with the custom types that replaced the deprecated ExhibitionGuides
    if (isNotUndefined(exhibitionTextQuery) || exhibitionHighlightTourQuery) {
      const exhibitionText = exhibitionTextQuery && {
        ...transformExhibitionTexts(exhibitionTextQuery),
        components: [],
      };
      const exhibitionHighlightTour = exhibitionHighlightTourQuery && {
        ...transformExhibitionHighlightTours(exhibitionHighlightTourQuery),
        components: [],
      };

      // If we have an exhibitionText, there may be a exhibitionHiglightTour
      // associated to the same exhibition, or vice versa.
      // So we try to fetch those.
      let exhibitionTexts;
      let exhibitionHighlightTours;

      const relatedExhibitionId =
        exhibitionText?.relatedExhibition?.id ||
        exhibitionHighlightTour?.relatedExhibition?.id;

      if (relatedExhibitionId) {
        try {
          const exhibitionTextsQuery =
            !exhibitionTextQuery &&
            fetchExhibitionTexts(client, {
              filters: [
                prismic.filter.at(
                  'my.exhibition-texts.related_exhibition',
                  relatedExhibitionId
                ),
              ],
            });
          exhibitionTexts = exhibitionTextsQuery
            ? transformExhibitionTextsQuery(await exhibitionTextsQuery)
            : undefined;
        } catch (e) {
          exhibitionTexts = undefined;
        }

        try {
          const exhibitionHighlightToursQuery =
            !exhibitionHighlightTourQuery &&
            fetchExhibitionHighlightTours(client, {
              filters: [
                prismic.filter.at(
                  'my.exhibition-highlight-tours.related_exhibition',
                  relatedExhibitionId
                ),
              ],
            });

          exhibitionHighlightTours = exhibitionHighlightToursQuery
            ? transformExhibitionHighlightToursQuery(
                await exhibitionHighlightToursQuery
              )
            : undefined;
        } catch (e) {
          exhibitionHighlightTours = undefined;
        }
      }

      const jsonLd =
        exhibitionTexts || exhibitionHighlightTours
          ? exhibitionGuideLd(exhibitionTexts || exhibitionHighlightTours)
          : { '@type': 'Thing' };

      return {
        props: serialiseProps({
          jsonLd,
          serverData,
          exhibitionText: exhibitionText || exhibitionTexts?.results[0], // There should only ever be one of these, so we take the first
          exhibitionHighlightTour:
            exhibitionHighlightTour || exhibitionHighlightTours?.results[0], // There should only ever be one of these, so we take the first
          otherExhibitionGuides: guides.results.filter(
            result =>
              result.title !== exhibitionText?.title &&
              result.title !== exhibitionHighlightTour?.title
          ),
        }),
      };
    }
  }

  return { notFound: true };
};

const ExhibitionGuidePage: FunctionComponent<Props> = ({
  exhibitionGuide,
  exhibitionText,
  exhibitionHighlightTour,
  jsonLd,
  otherExhibitionGuides,
}) => {
  const pageId =
    exhibitionGuide?.id || exhibitionText?.id || exhibitionHighlightTour?.id;
  const pageTitle =
    exhibitionGuide?.title ||
    exhibitionText?.title ||
    exhibitionHighlightTour?.title;
  const pathname = `guides/exhibitions/${pageId}`;

  const highlightStops = exhibitionHighlightTour?.stops;
  const hasVideo =
    exhibitionHighlightTour?.id &&
    highlightStops?.some(
      (stop: GuideStopSlice) => stop.primary.bsl_video.provider_url
    );

  const hasAudio =
    exhibitionHighlightTour?.id &&
    highlightStops?.some(
      (stop: GuideStopSlice) =>
        isFilledLinkToMediaField(stop.primary.audio_with_description) &&
        stop.primary.audio_with_description.url
    );

  const textPathname = exhibitionText?.id
    ? `guides/exhibitions/${exhibitionText.id}/captions-and-transcripts`
    : undefined;
  const audioPathname = hasAudio
    ? `guides/exhibitions/${exhibitionHighlightTour.id}/audio-without-descriptions`
    : undefined;
  const videoPathname = hasVideo
    ? `guides/exhibitions/${exhibitionHighlightTour.id}/bsl`
    : undefined;

  return (
    <PageLayout
      title={pageTitle || ''}
      description={pageDescriptions.exhibitionGuides}
      url={{ pathname }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection="exhibition-guides"
      image={exhibitionGuide?.image}
      headerProps={{
        customNavLinks: exhibitionGuidesLinks,
        isMinimalHeader: true,
      }}
      apiToolbarLinks={[createPrismicLink(pageId || '')]}
      hideNewsletterPromo={true}
    >
      <Layout gridSizes={gridSize10(false)}>
        <SpacingSection>
          <Space
            $v={{ size: 'l', properties: ['margin-top'] }}
            className={font('wb', 1)}
          >
            <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
              <h1
                className={font('wb', 0)}
              >{`Choose the ${pageTitle} guide for you`}</h1>
            </Space>
          </Space>
          <Space $v={{ size: 'l', properties: ['margin-top'] }}>
            {/* Links to ExhibitionTexts and ExhibitionHighlightTours */}
            {Boolean(textPathname || audioPathname || videoPathname) && (
              <ExhibitionResourceLinks
                textPathname={textPathname}
                audioPathname={audioPathname}
                videoPathname={videoPathname}
              />
            )}
            {/* Links to deprecated ExhibitionGuides */}
            {exhibitionGuide && (
              <ExhibitionGuideLinks
                availableTypes={exhibitionGuide.availableTypes}
                pathname={pathname}
              />
            )}
          </Space>
        </SpacingSection>
      </Layout>
      {otherExhibitionGuides?.length > 0 && (
        <OtherExhibitionGuides otherExhibitionGuides={otherExhibitionGuides} />
      )}
    </PageLayout>
  );
};

export default ExhibitionGuidePage;
