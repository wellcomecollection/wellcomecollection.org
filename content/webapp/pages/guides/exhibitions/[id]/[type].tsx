import {
  ExhibitionGuide,
  ExhibitionGuideComponent,
} from '../../../../types/exhibition-guides';
import { setCookie, deleteCookie } from 'cookies-next';
import * as prismicT from '@prismicio/types';
import { ReactElement, FC } from 'react';
import { createClient } from '../../../../services/prismic/fetch';
import { fetchExhibitionGuide } from '../../../../services/prismic/fetch/exhibition-guides';
import { transformExhibitionGuide } from '../../../../services/prismic/transformers/exhibition-guides';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { exhibitionGuideLd } from '../../../../services/prismic/transformers/json-ld';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import Space from '@weco/common/views/components/styled/Space';
import ExhibitionCaptions from '../../../../components/ExhibitionCaptions/ExhibitionCaptions';
import { GetServerSideProps } from 'next';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import styled from 'styled-components';
import { exhibitionGuidesLinks } from '@weco/common/views/components/Header/Header';
import AudioPlayer from '@weco/common/views/components/AudioPlayer/AudioPlayer';
import VideoEmbed from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import GridFactory, {
  threeUpGridSizesMap,
  twoUpGridSizesMap,
} from '@weco/content/components/Body/GridFactory';
import { themeValues, PaletteColor } from '@weco/common/views/themes/config';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import { dasherizeShorten } from '@weco/common/utils/grammar';
import cookies from '@weco/common/data/cookies';

const Stop = styled(Space).attrs({
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})`
  background: ${props => props.theme.color('warmNeutral.300')};
  height: 100%;
`;

const Header = styled(Space).attrs({
  v: {
    size: 'xl',
    properties: ['padding-top', 'padding-bottom', 'margin-bottom'],
  },
})<{ color: PaletteColor }>`
  background: ${props => props.theme.color(props.color)};
`;

const typeNames = [
  'bsl',
  'audio-with-descriptions',
  'audio-without-descriptions',
  'captions-and-transcripts',
] as const;
type GuideType = typeof typeNames[number];

function isValidType(type: string | string[] | undefined): type is GuideType {
  return typeNames.includes(type as any);
}

type Props = {
  exhibitionGuide: ExhibitionGuide;
  jsonLd: JsonLdObj;
  type: GuideType;
  userPreferenceSet?: string | string[];
};

function getTypeTitle(type: GuideType): string {
  switch (type) {
    case 'bsl':
      return 'Watch BSL videos';
    case 'audio-with-descriptions':
    case 'audio-without-descriptions':
      return 'Listen to audio'; // We don't yet have any audio with descriptions so don't want to imply that we do
    case 'captions-and-transcripts':
      return 'Captions and transcripts';
  }
}

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const { id, type, usingQRCode, userPreferenceSet } = context.query;
    const { res, req } = context;

    if (!looksLikePrismicId(id) || !serverData.toggles.exhibitionGuides) {
      return { notFound: true };
    }

    if (!isValidType(type)) {
      return { notFound: true };
    }

    const client = createClient(context);
    const exhibitionGuideQuery = await fetchExhibitionGuide(client, id);

    // We want to set a user preference cookie if the qr code url contains a guide type
    // 8 hours (the maximum length of time the collection is open for in a day)
    if (usingQRCode) {
      setCookie(cookies.exhibitionGuideType, type, {
        res,
        req,
        maxAge: 8 * 60 * 60,
        path: '/',
      });
    }

    if (exhibitionGuideQuery) {
      const exhibitionGuide = transformExhibitionGuide(exhibitionGuideQuery);

      const jsonLd = exhibitionGuideLd(exhibitionGuide);

      return {
        props: removeUndefinedProps({
          exhibitionGuide,
          jsonLd,
          serverData,
          type,
          userPreferenceSet,
        }),
      };
    } else {
      return { notFound: true };
    }
  };

type StopsProps = {
  stops: ExhibitionGuideComponent[];
  type: GuideType;
  id?: number;
};

const Stops: FC<StopsProps> = ({ stops, type }) => {
  return (
    <GridFactory
      overrideGridSizes={
        type === 'bsl' ? twoUpGridSizesMap : threeUpGridSizesMap
      }
      items={
        stops
          .map((stop, index) => {
            const {
              number,
              audioWithDescription,
              audioWithoutDescription,
              bsl,
              title,
              standaloneTitle,
            } = stop;
            const hasContentOfDesiredType =
              (type === 'audio-with-descriptions' &&
                audioWithDescription?.url) ||
              (type === 'audio-without-descriptions' &&
                audioWithoutDescription?.url) ||
              (type === 'bsl' && bsl?.embedUrl);
            return hasContentOfDesiredType ? (
              <Stop
                key={index}
                id="apiToolbar"
                data-toolbar-anchor={dasherizeShorten(title)}
              >
                {type === 'audio-with-descriptions' &&
                  audioWithDescription?.url && (
                    <AudioPlayer
                      title={
                        stop.title
                          ? `${number}. ${stop.title}`
                          : `${number}. ${standaloneTitle}`
                      }
                      audioFile={audioWithDescription.url}
                    />
                  )}
                {type === 'audio-without-descriptions' &&
                  audioWithoutDescription?.url && (
                    <AudioPlayer
                      title={
                        stop.title
                          ? `${number}. ${stop.title}`
                          : `${number}. ${standaloneTitle}`
                      }
                      audioFile={audioWithoutDescription.url}
                    />
                  )}
                {type === 'bsl' && bsl.embedUrl && (
                  <VideoEmbed embedUrl={bsl.embedUrl} />
                )}
              </Stop>
            ) : null; // We've decided to omit stops that don't have content for the selected type.
          })
          .filter(Boolean) as ReactElement[]
      }
    />
  );
};

const ExhibitionStops: FC<StopsProps> = ({ stops, type }) => {
  const numberedStops = stops.filter(c => c.number);
  switch (type) {
    case 'bsl':
    case 'audio-with-descriptions':
    case 'audio-without-descriptions':
      return <Stops stops={numberedStops} type={type} />;
    case 'captions-and-transcripts':
      return <ExhibitionCaptions stops={stops} />;
    default:
      return null;
  }
};

function getTypeColor(type?: GuideType): PaletteColor {
  switch (type) {
    case 'bsl':
      return 'accent.lightBlue';
    case 'audio-without-descriptions':
      return 'accent.lightSalmon';
    case 'audio-with-descriptions':
      return 'accent.lightPurple';
    case 'captions-and-transcripts':
    default:
      return 'accent.lightGreen';
  }
}

const ExhibitionGuidePage: FC<Props> = props => {
  const { exhibitionGuide, jsonLd, type, userPreferenceSet } = props;
  const pathname = `guides/exhibitions/${exhibitionGuide.id}/${type}`;
  const typeColor = getTypeColor(type);
  const numberedStops = exhibitionGuide.components.filter(c => c.number);
  return (
    <PageLayout
      title={`${exhibitionGuide.title} ${type ? getTypeTitle(type) : ''}` || ''}
      description={pageDescriptions.exhibitionGuides}
      url={{ pathname: pathname }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection="exhibition-guides"
      image={exhibitionGuide.image || undefined}
      headerProps={{
        customNavLinks: exhibitionGuidesLinks,
        showLibraryLogin: false,
      }}
      hideNewsletterPromo={true}
      hideFooter={true}
    >
      <Header color={typeColor}>
        <Layout8 shift={false}>
          <>
            <h1 className="h0">
              {exhibitionGuide.title}{' '}
              <div className="h1">{getTypeTitle(type)}</div>
            </h1>

            {exhibitionGuide.introText?.length > 0 ? (
              <PrismicHtmlBlock
                html={exhibitionGuide.introText as prismicT.RichTextField}
              />
            ) : (
              exhibitionGuide.relatedExhibition && (
                <p>{exhibitionGuide.relatedExhibition.description}</p>
              )
            )}
            <Space as="span" h={{ size: 's', properties: ['margin-right'] }}>
              <ButtonSolidLink
                colors={themeValues.buttonColors.charcoalWhiteCharcoal}
                text="Change guide type"
                link={`/guides/exhibitions/${exhibitionGuide.id}`}
                clickHandler={() => {
                  deleteCookie(cookies.exhibitionGuideType);
                }}
              />
            </Space>
            <ButtonSolidLink
              colors={themeValues.buttonColors.charcoalWhiteCharcoal}
              text="Change exhibition"
              link="/guides/exhibitions"
            />
          </>
        </Layout8>
      </Header>

      <Space v={{ size: 'l', properties: ['margin-top'] }}>
        <Layout10 isCentered={false}>
          {userPreferenceSet ? (
            <p>
              {type !== 'captions-and-transcripts' && (
                <>This exhibition has {numberedStops.length} stops. </>
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
                <p>This exhibition has {numberedStops.length} stops.</p>
              )}
            </>
          )}
        </Layout10>
      </Space>

      <ExhibitionStops type={type} stops={exhibitionGuide.components} />
    </PageLayout>
  );
};

export default ExhibitionGuidePage;
