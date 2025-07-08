import { FunctionComponent } from 'react';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { GuideStopSlice as RawGuideStopSlice } from '@weco/common/prismicio-types';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { isFilledLinkToMediaField } from '@weco/common/services/prismic/types/';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { exhibitionGuidesLinks } from '@weco/common/views/components/Header';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import {
  ContaineredLayout,
  gridSize10,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import {
  ExhibitionGuide,
  ExhibitionGuideBasic,
  ExhibitionHighlightTour,
  ExhibitionText,
} from '@weco/content/types/exhibition-guides';

import GuideLinks from './exhibition.GuideLinks';
import OtherExhibitionGuides from './exhibition.OtherExhibitionGuides';
import { ExhibitionResourceLinks } from './exhibition.ResourceLinks';

export type Props = {
  exhibitionGuide?: ExhibitionGuide;
  exhibitionText?: ExhibitionText;
  exhibitionHighlightTour?: ExhibitionHighlightTour;
  jsonLd: JsonLdObj;
  otherExhibitionGuides: ExhibitionGuideBasic[];
  stopNumber?: string;
};

const ExhibitionGuidePage: FunctionComponent<Props> = ({
  exhibitionGuide,
  exhibitionText,
  exhibitionHighlightTour,
  jsonLd,
  otherExhibitionGuides,
  stopNumber,
}) => {
  const pageId =
    exhibitionGuide?.id || exhibitionText?.id || exhibitionHighlightTour?.id;
  const pageUid =
    exhibitionGuide?.uid || exhibitionText?.uid || exhibitionHighlightTour?.uid;
  const pageTitle =
    exhibitionGuide?.title ||
    exhibitionText?.title ||
    exhibitionHighlightTour?.title;

  const highlightStops = exhibitionHighlightTour?.stops;
  const hasVideo =
    exhibitionHighlightTour?.id &&
    highlightStops?.some(
      (stop: RawGuideStopSlice) => stop.primary.bsl_video.provider_url
    );

  const hasAudio =
    exhibitionHighlightTour?.id &&
    highlightStops?.some(
      (stop: RawGuideStopSlice) =>
        isFilledLinkToMediaField(stop.primary.audio_with_description) &&
        stop.primary.audio_with_description.url
    );

  const textPathname = exhibitionText?.id
    ? linkResolver(exhibitionText)
    : undefined;
  const audioPathname = hasAudio
    ? linkResolver({ ...exhibitionHighlightTour, highlightTourType: 'audio' })
    : undefined;
  const videoPathname = hasVideo
    ? linkResolver({ ...exhibitionHighlightTour, highlightTourType: 'bsl' })
    : undefined;

  return (
    <PageLayout
      title={pageTitle || ''}
      description={pageDescriptions.exhibitionGuides}
      url={{ pathname: `guides/exhibitions/${pageUid}` }}
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
      <PageHeader
        title={`${pageTitle} digital guides`}
        breadcrumbs={{
          items: [
            {
              text: 'Digital Guides',
              url: `/guides/exhibitions`,
            },
          ],
          noHomeLink: true,
        }}
        isSlim
      />
      <ContaineredLayout gridSizes={gridSize10(false)}>
        <SpacingSection>
          <Space $v={{ size: 'l', properties: ['margin-top'] }}>
            {/* Links to ExhibitionTexts and ExhibitionHighlightTours */}
            {/* Or, if there is a stopNumber in the URL, link straight to it */}
            {Boolean(textPathname || audioPathname || videoPathname) && (
              <ExhibitionResourceLinks
                textPathname={textPathname}
                audioPathname={audioPathname}
                videoPathname={videoPathname}
                stopNumber={stopNumber}
              />
            )}
            {/* Links to deprecated ExhibitionGuides */}
            {exhibitionGuide && (
              <GuideLinks exhibitionGuide={exhibitionGuide} />
            )}
          </Space>
        </SpacingSection>
      </ContaineredLayout>

      {otherExhibitionGuides?.length > 0 && (
        <OtherExhibitionGuides otherExhibitionGuides={otherExhibitionGuides} />
      )}
    </PageLayout>
  );
};

export default ExhibitionGuidePage;
