import {
  ExhibitionGuide,
  ExhibitionText,
  ExhibitionHighlightTour,
  ExhibitionGuideType,
} from '@weco/content/types/exhibition-guides';
import { deleteCookie } from 'cookies-next';
import { FunctionComponent } from 'react';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import Layout, {
  gridSize10,
  gridSize8,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import { exhibitionGuidesLinks } from '@weco/common/views/components/Header/Header';
import Button from '@weco/common/views/components/Buttons';
import { themeValues, PaletteColor } from '@weco/common/views/themes/config';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import cookies from '@weco/common/data/cookies';
import ExhibitionGuideStops from '@weco/content/components/ExhibitionGuideStops/ExhibitionGuideStops';
import { getTypeColor } from '@weco/content/components/ExhibitionCaptions/ExhibitionCaptions';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { font } from '@weco/common/utils/classnames';
import { SliceZone } from '@prismicio/react';
import { components } from '@weco/common/views/slices';
import { Container } from '@weco/common/views/components/styled/Container';

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

type Props = {
  exhibitionGuide: ExhibitionGuide | ExhibitionText | ExhibitionHighlightTour;
  jsonLd: JsonLdObj;
  type: ExhibitionGuideType;
  userPreferenceSet?: string | string[];
  stopId?: string;
};

function getTypeTitle(type: ExhibitionGuideType): string {
  switch (type) {
    case 'bsl':
      return 'British Sign Language videos';
    case 'audio-with-descriptions':
      return 'Audio with wayfinding';
    case 'audio-without-descriptions':
      return 'Audio';
    case 'captions-and-transcripts':
      return 'Captions and transcripts';
  }
}

const CurrentExhibitionGuideType: FunctionComponent<Props> = props => {
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
      title={`${exhibitionGuide.title} ${type ? getTypeTitle(type) : ''}` || ''}
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
      <Header $backgroundColor={typeColor}>
        <Layout gridSizes={gridSize8(false)}>
          <>
            <h1 className={font('wb', 1)}>
              {exhibitionGuide.title}{' '}
              <div className={font('wb', 2)}>{getTypeTitle(type)}</div>
            </h1>

            {exhibitionGuide.introText?.length > 0 ? (
              <PrismicHtmlBlock html={exhibitionGuide.introText} />
            ) : (
              exhibitionGuide.relatedExhibition?.description && (
                <p>{exhibitionGuide.relatedExhibition.description}</p>
              )
            )}
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
        </Layout>
      </Header>
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
              context={{ type }}
            />
          </div>
        </Container>
      )}
    </PageLayout>
  );
};

export default CurrentExhibitionGuideType;
