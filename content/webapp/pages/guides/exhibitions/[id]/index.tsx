import {
  ExhibitionGuide,
  ExhibitionGuideBasic,
} from '../../../../types/exhibition-guides';
import { getCookie, hasCookie, setCookie } from 'cookies-next';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { FC } from 'react';
import { createClient } from '../../../../services/prismic/fetch';
import {
  fetchExhibitionGuide,
  fetchExhibitionGuides,
} from '../../../../services/prismic/fetch/exhibition-guides';
import {
  transformExhibitionGuide,
  transformExhibitionGuideToExhibitionGuideBasic,
} from '../../../../services/prismic/transformers/exhibition-guides';
import { transformQuery } from '../../../../services/prismic/transformers/paginated-results';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { font } from '@weco/common/utils/classnames';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { exhibitionGuideLd } from '../../../../services/prismic/transformers/json-ld';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import CardGrid from '../../../../components/CardGrid/CardGrid';
import { GetServerSideProps } from 'next';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import styled from 'styled-components';
import { exhibitionGuidesLinks } from '@weco/common/views/components/Header/Header';
import {
  britishSignLanguage,
  audioDescribed,
  speechToText,
} from '@weco/common/icons';
import TypeOption from '../../../../components/ExhibitionGuideTypeOption/ExhibitionGuideTypeOption';

const PromoContainer = styled.div`
  background: ${props => props.theme.color('warmNeutral.300')};
`;

const TypeList = styled.ul`
  list-style: none;
  margin: 0 !important;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  ${props => props.theme.media('medium')`
      gap: 50px;
    `}
`;

type Props = {
  exhibitionGuide: ExhibitionGuide;
  jsonLd: JsonLdObj;
  otherExhibitionGuides: PaginatedResults<ExhibitionGuideBasic>;
  userPreferenceSet?: string | string[];
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const { id, userPreferenceSet } = context.query;
    const { res, req } = context;

    if (!looksLikePrismicId(id) || !serverData.toggles.exhibitionGuides) {
      return { notFound: true };
    }

    const client = createClient(context);
    const exhibitionGuideQueryPromise = fetchExhibitionGuide(client, id);
    const exhibitionGuidesQueryPromise = fetchExhibitionGuides(client, {
      page: 1,
    });

    const [exhibitionGuideQuery, exhibitionGuidesQuery] = await Promise.all([
      exhibitionGuideQueryPromise,
      exhibitionGuidesQueryPromise,
    ]);

    const exhibitionGuides = transformQuery(
      exhibitionGuidesQuery,
      transformExhibitionGuide
    );

    const basicExhibitionGuides = {
      ...exhibitionGuides,
      results: exhibitionGuides.results.map(
        transformExhibitionGuideToExhibitionGuideBasic
      ),
    };

    const userPreferenceGuideType = getCookie('WC_userPreferenceGuideType', {
      req,
      res,
    });
    const hasUserPreference = hasCookie('WC_userPreferenceGuideType', {
      req,
      res,
    });

    // We want to check for a user guide type preference cookie, and redirect to the appropriate type
    if (hasUserPreference) {
      return {
        redirect: {
          permanent: false,
          destination: `${id}/${userPreferenceGuideType}?userPreferenceSet=true`,
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
          otherExhibitionGuides: {
            ...basicExhibitionGuides,
            results: basicExhibitionGuides.results.filter(
              result => result.id !== id
            ),
          },
          userPreferenceSet,
        }),
      };
    } else {
      return { notFound: true };
    }
  };

type ExhibitionLinksProps = {
  pathname: string;
  availableTypes: {
    BSLVideo: boolean;
    captionsOrTranscripts: boolean;
    audioWithoutDescriptions: boolean;
    audioWithDescriptions: boolean;
  };
};

function cookieHandler(key: string, data: string) {
  // We set the cookie to expire in 8 hours (the maximum length of time the collection is open for in a day)
  const options = { maxAge: 8 * 60 * 60, path: '/' };
  setCookie(key, data, options);
}

const ExhibitionLinks: FC<ExhibitionLinksProps> = ({
  pathname,
  availableTypes,
}) => {
  return (
    <TypeList>
      {availableTypes.audioWithoutDescriptions && (
        <TypeOption
          url={`/${pathname}/audio-without-descriptions`}
          title="Listen, without audio descriptions"
          text="Find out more about the exhibition with short audio tracks."
          color="accent.lightSalmon"
          onClick={() => {
            cookieHandler(
              'WC_userPreferenceGuideType',
              'audio-without-descriptions'
            );
          }}
        />
      )}
      {availableTypes.audioWithDescriptions && (
        <TypeOption
          url={`/${pathname}/audio-with-descriptions`}
          title="Listen, with audio descriptions"
          text="Find out more about the exhibition with short audio tracks,
          including descriptions of the objects."
          color="accent.lightPurple"
          icon={audioDescribed}
          onClick={() => {
            cookieHandler(
              'WC_userPreferenceGuideType',
              'audio-with-descriptions'
            );
          }}
        />
      )}
      {availableTypes.captionsOrTranscripts && (
        <TypeOption
          url={`/${pathname}/captions-and-transcripts`}
          title="Read captions and transcripts"
          text="All the wall and label texts from the gallery, and images of the
                objects, great for those without headphones."
          color="accent.lightGreen"
          icon={speechToText}
          onClick={() => {
            cookieHandler(
              'WC_userPreferenceGuideType',
              'captions-and-transcripts'
            );
          }}
        />
      )}
      {availableTypes.BSLVideo && (
        <TypeOption
          url={`/${pathname}/bsl`}
          title="Watch BSL videos"
          text="Commentary about the exhibition in British Sign Language videos."
          color="accent.lightBlue"
          icon={britishSignLanguage}
          onClick={() => {
            cookieHandler('WC_userPreferenceGuideType', 'bsl');
          }}
        />
      )}
    </TypeList>
  );
};

const ExhibitionGuidePage: FC<Props> = ({
  exhibitionGuide,
  jsonLd,
  otherExhibitionGuides,
}) => {
  const pathname = `guides/exhibitions/${exhibitionGuide.id}`;
  return (
    <PageLayout
      title={exhibitionGuide.title}
      description={pageDescriptions.exhibitionGuides}
      url={{ pathname }}
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
      <Layout10 isCentered={false}>
        <SpacingSection>
          <Space
            v={{ size: 'l', properties: ['margin-top'] }}
            className={font('wb', 1)}
          >
            <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
              <h1
                className={font('wb', 0)}
              >{`Choose the ${exhibitionGuide.title} guide for you`}</h1>
            </Space>
          </Space>
          <Space v={{ size: 'l', properties: ['margin-top'] }}>
            <ExhibitionLinks
              availableTypes={exhibitionGuide.availableTypes}
              pathname={pathname}
            />
          </Space>
        </SpacingSection>
      </Layout10>
      {otherExhibitionGuides.results.length > 0 && (
        <PromoContainer>
          <Space
            v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
          >
            <Layout8 shift={false}>
              <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
                <h2 className="h2">Other exhibition guides available</h2>
              </Space>
            </Layout8>
            <CardGrid
              itemsHaveTransparentBackground={true}
              items={otherExhibitionGuides.results.map(result => ({
                ...result,
                type: 'exhibition-guides-links',
              }))}
              itemsPerRow={3}
            />
          </Space>
        </PromoContainer>
      )}
    </PageLayout>
  );
};

export default ExhibitionGuidePage;
