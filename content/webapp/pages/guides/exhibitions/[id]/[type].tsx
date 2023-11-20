import {
  ExhibitionGuide,
  ExhibitionGuideType,
  isValidType,
} from '@weco/content/types/exhibition-guides';
import { deleteCookie, getCookie } from 'cookies-next';
import { FunctionComponent } from 'react';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchExhibitionGuide } from '@weco/content/services/prismic/fetch/exhibition-guides';
import {
  filterExhibitionGuideComponents,
  transformExhibitionGuide,
} from '@weco/content/services/prismic/transformers/exhibition-guides';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { serialiseProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { exhibitionGuideLd } from '@weco/content/services/prismic/transformers/json-ld';
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
import ExhibitionGuideStops from '@weco/content/components/ExhibitionGuideStops/ExhibitionGuideStops';
import { getTypeColor } from '@weco/content/components/ExhibitionCaptions/ExhibitionCaptions';
import useHotjar from '@weco/content/hooks/useHotjar';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import { font } from '@weco/common/utils/classnames';
import { isNotUndefined } from '@weco/common/utils/type-guards';

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

type Props = {
  exhibitionGuide: ExhibitionGuide;
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

  if (isNotUndefined(exhibitionGuideQuery)) {
    const serverData = await getServerData(context);
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

  return { notFound: true };
};

const ExhibitionGuidePage: FunctionComponent<Props> = props => {
  useHotjar(true);

  const { exhibitionGuide, jsonLd, type, userPreferenceSet } = props;
  const pathname = `guides/exhibitions/${exhibitionGuide.id}/${type}`;
  const typeColor = getTypeColor(type);
  const numberedStops = exhibitionGuide.components.filter(c => c.number);

  const thisStopTitle = props.stopId
    ? exhibitionGuide.components.find(c => c.anchorId === props.stopId)
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
      hideFooter={true}
      apiToolbarLinks={[createPrismicLink(exhibitionGuide.id)]}
      skipToContentLinks={skipToContentLinks}
    >
      <Header $backgroundColor={typeColor}>
        <Layout8 shift={false}>
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
              <ButtonSolidLink
                colors={themeValues.buttonColors.charcoalWhiteCharcoal}
                text="Change guide type"
                link={`/guides/exhibitions/${exhibitionGuide.id}`}
                clickHandler={() => {
                  deleteCookie(cookies.exhibitionGuideType);
                }}
              />
            </ButtonWrapper>
            <ButtonSolidLink
              colors={themeValues.buttonColors.charcoalWhiteCharcoal}
              text="Change exhibition"
              link="/guides/exhibitions"
            />
          </>
        </Layout8>
      </Header>

      <Space $v={{ size: 'l', properties: ['margin-top'] }}>
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
