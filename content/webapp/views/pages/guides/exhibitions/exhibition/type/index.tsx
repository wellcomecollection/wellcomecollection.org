import { SliceZone } from '@prismicio/react';
import { deleteCookie } from 'cookies-next';
import { NextPage } from 'next';

import cookies from '@weco/common/data/cookies';
import { pageDescriptions } from '@weco/common/data/microcopy';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { font } from '@weco/common/utils/classnames';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { exhibitionGuidesLinks } from '@weco/common/views/components/Header';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import {
  ContaineredLayout,
  gridSize10,
  gridSize8,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { components } from '@weco/common/views/slices';
import {
  ExhibitionGuide,
  ExhibitionGuideType,
  ExhibitionHighlightTour,
  ExhibitionText,
} from '@weco/content/types/exhibition-guides';
import RelevantGuideIcons from '@weco/content/views/components/ExhibitionGuideRelevantIcons';

import ExhibitionGuideStops from './type.ExhibitionGuideStops';

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

export type Props = {
  exhibitionGuide: ExhibitionGuide | ExhibitionText | ExhibitionHighlightTour;
  jsonLd: JsonLdObj;
  type: ExhibitionGuideType;
  userPreferenceSet?: string | string[];
  stopId?: string;
};

const ExhibitionGuideTypePage: NextPage<Props> = ({
  exhibitionGuide,
  jsonLd,
  type,
  userPreferenceSet,
  stopId,
}) => {
  const pathname = `${linkResolver(exhibitionGuide)}/${type}`;

  const thisStopTitle = stopId
    ? isExhibitionGuide(exhibitionGuide) &&
      exhibitionGuide.components.find(c => c.anchorId === stopId)?.displayTitle
    : undefined;

  const skipToContentLinks =
    stopId && thisStopTitle
      ? [
          {
            anchorId: stopId,
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
        variant="basic"
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
        <h2 className={font('sans-bold', 0)}>{getTypeTitle(type)}</h2>

        {exhibitionGuide.introText?.length > 0 ? (
          <PrismicHtmlBlock html={exhibitionGuide.introText} />
        ) : (
          exhibitionGuide.relatedExhibition?.description && (
            <p>{exhibitionGuide.relatedExhibition.description}</p>
          )
        )}

        <RelevantGuideIcons types={[type]} />
      </ContaineredLayout>

      <Space $v={{ size: 'md', properties: ['margin-top'] }}>
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
          <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
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

export default ExhibitionGuideTypePage;
