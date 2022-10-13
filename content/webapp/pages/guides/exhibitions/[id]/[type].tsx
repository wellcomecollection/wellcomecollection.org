import {
  ExhibitionGuide,
  ExhibitionGuideType,
  isValidType,
} from '../../../../types/exhibition-guides';
import { deleteCookie, getCookie } from 'cookies-next';
import * as prismicT from '@prismicio/types';
import { FC } from 'react';
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
import { GetServerSideProps } from 'next';
import { AppErrorProps } from '@weco/common/services/app';
import styled from 'styled-components';
import { exhibitionGuidesLinks } from '@weco/common/views/components/Header/Header';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import { themeValues, PaletteColor } from '@weco/common/views/themes/config';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import cookies from '@weco/common/data/cookies';
import ExhibitionGuideStops from '../../../../components/ExhibitionGuideStops/ExhibitionGuideStops';
import { getTypeColor } from '../../../../components/ExhibitionCaptions/ExhibitionCaptions';

const Header = styled(Space).attrs({
  v: {
    size: 'xl',
    properties: ['padding-top', 'padding-bottom', 'margin-bottom'],
  },
})<{ color: PaletteColor }>`
  background: ${props => props.theme.color(props.color)};
`;

type Props = {
  exhibitionGuide: ExhibitionGuide;
  jsonLd: JsonLdObj;
  type: ExhibitionGuideType;
  userPreferenceSet?: string | string[];
};

function getTypeTitle(type: ExhibitionGuideType): string {
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
    const { id, type, usingQRCode, userPreferenceSet, stopId } = context.query;
    const { res, req } = context;

    if (!looksLikePrismicId(id) || !serverData.toggles.exhibitionGuides) {
      return { notFound: true };
    }

    if (!isValidType(type)) {
      return { notFound: true };
    }

    const client = createClient(context);
    const exhibitionGuideQuery = await fetchExhibitionGuide(client, id);

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

      <ExhibitionGuideStops type={type} stops={exhibitionGuide.components} />
    </PageLayout>
  );
};

export default ExhibitionGuidePage;
