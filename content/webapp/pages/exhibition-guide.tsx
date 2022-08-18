import {
  ExhibitionGuide,
  ExhibitionGuideBasic,
  ExhibitionGuideComponent,
} from '../types/exhibition-guides';
import { getCookie, hasCookie, setCookie } from 'cookies-next';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { createClient } from '../services/prismic/fetch';
import {
  fetchExhibitionGuide,
  fetchExhibitionGuides,
} from '../services/prismic/fetch/exhibition-guides';
import {
  transformExhibitionGuide,
  transformExhibitionGuideToExhibitionGuideBasic,
} from '../services/prismic/transformers/exhibition-guides';
import { transformQuery } from '../services/prismic/transformers/paginated-results';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { FC, SyntheticEvent } from 'react';
import { IconSvg } from '@weco/common/icons/types';
import { font, classNames } from '@weco/common/utils/classnames';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { exhibitionGuideLd } from '../services/prismic/transformers/json-ld';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import CardGrid from '../components/CardGrid/CardGrid';
import ExhibitionCaptions from '../components/ExhibitionCaptions/ExhibitionCaptions';
import { GetServerSideProps } from 'next';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import styled from 'styled-components';
import { exhibitionGuidesLinks } from '@weco/common/views/components/Header/Header';
import AudioPlayer from '@weco/common/views/components/AudioPlayer/AudioPlayer';
import VideoEmbed from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import GridFactory from '@weco/content/components/Body/GridFactory';
import { themeValues } from '@weco/common/views/themes/config';
import Icon from '@weco/common/views/components/Icon/Icon';
import {
  britishSignLanguage,
  audioDescribed,
  speechToText,
} from '@weco/common/icons';

const PromoContainer = styled.div`
  background: ${props => props.theme.color('cream')};
`;
type StopProps = {
  width: number;
};

const Stop = styled(Space).attrs({
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})<StopProps>`
  background: ${props => props.theme.color('cream')};
`;

const TypeList = styled.ul.attrs({
  className: 'plain-list no-margin no-padding flex flex--wrap',
})`
  gap: 20px;
  ${props => props.theme.media.medium`
    gap: 50px;
  `}
`;

const TypeItem = styled.li`
  flex-basis: 100%;
  flex-grow: 0;
  flex-shrink: 0;
  position: relative;
  ${props => props.theme.media.medium`
    flex-basis: calc(50% - 25px);
  `}
`;

const TypeLink = styled.a`
  display: block;
  height: 100%;
  width: 100%;
  text-decoration: none;
  background: ${props => props.theme.color(props.color)};

  &:hover,
  &:focus {
    background: ${props => props.theme.color('marble')};
  }
`;

type TypeOptionProps = {
  url: string;
  title: string;
  text: string;
  color:
    | 'newPaletteOrange'
    | 'newPaletteMint'
    | 'newPaletteSalmon'
    | 'newPaletteBlue';
  icon?: IconSvg;
  onClick?: (event: SyntheticEvent<HTMLAnchorElement>) => void;
};

const TypeOption: FC<TypeOptionProps> = ({
  url,
  title,
  text,
  color,
  icon,
  onClick,
}) => (
  <TypeItem>
    <TypeLink href={url} color={color} onClick={onClick}>
      <Space
        v={{ size: 'm', properties: ['padding-top', 'padding-bottom'] }}
        h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
      >
        <h2 className="h2">{title}</h2>
        <p className={`${font('hnr', 5)}`}>{text}</p>
        {icon && <Icon icon={icon} />}
      </Space>
    </TypeLink>
  </TypeItem>
);

const Header = styled(Space).attrs({
  v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
})`
  background: ${props => props.theme.color(props.color)};
`;

const typeNames = [
  'bsl',
  'audio-with-descriptions',
  'audio-without-descriptions',
  'captions-and-transcripts',
] as const;
type GuideType = typeof typeNames[number];

function isValidType(type) {
  return typeNames.includes(type);
}

type Props = {
  exhibitionGuide: ExhibitionGuide;
  jsonLd: JsonLdObj;
  type?: GuideType;
  otherExhibitionGuides: PaginatedResults<ExhibitionGuideBasic>;
  userPreferenceSet: string | string[] | undefined;
};

function getTypeTitle(type: GuideType): string {
  switch (type) {
    case 'bsl':
      return 'BSL';
    case 'audio-with-descriptions':
      return 'Audio with descriptions';
    case 'audio-without-descriptions':
      return 'Audio without descriptions';
    case 'captions-and-transcripts':
      return 'Captions and transcripts';
  }
}

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const { id, type, usingQRCode, userPreferenceSet } = context.query;
    const { res, req } = context;

    if (
      !looksLikePrismicId(id) ||
      !serverData.toggles.exhibitionGuides ||
      (type && !isValidType(type))
    ) {
      return { notFound: true };
    }

    const client = createClient(context);
    const exhibitionGuideQueryPromise = fetchExhibitionGuide(
      client,
      id as string
    );
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

    // We want to set a user preference cookie if the qr code url contains a guide type
    // 28000 is 8 hours (the maximum length of time the collection is open for in a day)
    if (usingQRCode) {
      setCookie('WC_userPreferenceGuideType', type, {
        res,
        req,
        maxAge: 8 * 60 * 60,
      });
    }

    // We want to check for a user guide type preference cookie, and redirect to the appropriate type
    if (hasUserPreference && req.url === `/guides/exhibitions/${id}`) {
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
          type: isValidType(type) ? (type as GuideType) : undefined,
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

type StopsProps = {
  stops: ExhibitionGuideComponent[];
  type?: GuideType;
};

const Stops: FC<StopsProps> = ({ stops, type }) => {
  const stopWidth = type === 'bsl' ? 50 : 33;

  return (
    <GridFactory
      items={stops.map((stop, index) => {
        const {
          title,
          number,
          audioWithDescription,
          audioWithoutDescription,
          bsl,
        } = stop;
        const hasContentOfDesiredType =
          (type === 'audio-with-descriptions' && audioWithDescription?.url) ||
          (type === 'audio-without-descriptions' &&
            audioWithoutDescription?.url) ||
          (type === 'bsl' && bsl?.embedUrl);
        return (
          <Stop key={index} width={stopWidth}>
            {hasContentOfDesiredType ? (
              <>
                {type === 'audio-with-descriptions' &&
                  audioWithDescription?.url && (
                    <AudioPlayer
                      title={`${number}. ${stop.title}`}
                      audioFile={audioWithDescription.url}
                    />
                  )}
                {type === 'audio-without-descriptions' &&
                  audioWithoutDescription?.url && (
                    <AudioPlayer
                      title={`${number}. ${stop.title}`}
                      audioFile={audioWithoutDescription.url}
                    />
                  )}
                {type === 'bsl' && bsl?.embedUrl && (
                  <VideoEmbed embedUrl={bsl.embedUrl as string} />
                )}
              </>
            ) : (
              <>
                <span className={font('hnb', 5)}>
                  {number}. {title}
                </span>
                <p>There is no content to display</p>
              </>
            )}
          </Stop>
        );
      })}
    />
  );
};

const ExhibitionStops: FC<StopsProps> = ({ stops, type }) => {
  switch (type) {
    case 'bsl':
    case 'audio-with-descriptions':
    case 'audio-without-descriptions':
      return <Stops stops={stops} type={type} />;
    case 'captions-and-transcripts':
      return (
        <div className="container">
          <ExhibitionCaptions stops={stops} />
        </div>
      );
    default:
      return null;
  }
};

type ExhibitionLinksProps = {
  stops: ExhibitionGuideComponent[];
  pathname: string;
};

function cookieHandler(key, data) {
  // We set the cookie to expire in 8 hours (the maximum length of time the collection is open for in a day)
  const options = { maxAge: 8 * 60 * 60 };
  setCookie(key, data, options);
}

const ExhibitionLinks: FC<ExhibitionLinksProps> = ({ stops, pathname }) => {
  const hasBSLVideo = stops.some(
    stop => stop.bsl.embedUrl // it can't be undefined can it?
  );
  const hasCaptionsOrTranscripts = stops.some(
    stop => stop.caption.length > 0 || stop.transcription.length > 0
  );
  const hasAudioWithoutDescriptions = stops.some(
    stop => stop.audioWithoutDescription?.url
  );
  const hasAudioWithDescriptions = stops.some(
    stop => stop.audioWithDescription?.url
  );

  return (
    <TypeList>
      {hasAudioWithoutDescriptions && (
        <TypeOption
          url={`/${pathname}/audio-without-descriptions`}
          title="Listen, without audio descriptions"
          text="Find out more about the exhibition with short audio tracks."
          color="newPaletteOrange"
          onClick={event => {
            event.stopPropagation();
            cookieHandler(
              'WC_userPreferenceGuideType',
              'audio-without-descriptions'
            );
          }}
        />
      )}
      {hasAudioWithDescriptions && (
        <TypeOption
          url={`/${pathname}/audio-with-descriptions`}
          title="Listen, with audio descriptions"
          text="Find out more about the exhibition with short audio tracks,
        including descriptions of the objects."
          color="newPaletteSalmon"
          icon={audioDescribed}
          onClick={event => {
            event.stopPropagation();
            cookieHandler(
              'WC_userPreferenceGuideType',
              'audio-with-descriptions'
            );
          }}
        />
      )}
      {hasCaptionsOrTranscripts && (
        <TypeOption
          url={`/${pathname}/captions-and-transcripts`}
          title="Read captions and transcripts"
          text="All the wall and label texts from the gallery, and images of the
              objects, great for those without headphones."
          color="newPaletteMint"
          icon={speechToText}
          onClick={event => {
            event.stopPropagation();
            cookieHandler(
              'WC_userPreferenceGuideType',
              'captions-and-transcripts'
            );
          }}
        />
      )}
      {hasBSLVideo && (
        <TypeOption
          url={`/${pathname}/bsl`}
          title="Watch BSL videos"
          text="Commentary about the exhibition in British Sign Language videos."
          color="newPaletteBlue"
          icon={britishSignLanguage}
          onClick={event => {
            event.stopPropagation();
            cookieHandler('WC_userPreferenceGuideType', 'bsl');
          }}
        />
      )}
    </TypeList>
  );
};

function getTypeColor(type) {
  switch (type) {
    case 'bsl':
      return 'newPaletteBlue';
    case 'audio-without-descriptions':
      return 'newPaletteOrange';
    case 'audio-with-descriptions':
      return 'newPaletteSalmon';
    case 'captions-and-transcripts':
      return 'newPaletteMint';
    default:
      return 'newPaletteMint';
  }
}

const ExhibitionGuidePage: FC<Props> = props => {
  const {
    exhibitionGuide,
    jsonLd,
    type,
    otherExhibitionGuides,
    userPreferenceSet,
  } = props;
  const pathname = `guides/exhibitions/${exhibitionGuide.id}${
    type ? `/${type}` : ''
  }`;
  const typeColor = getTypeColor(type);

  return (
    <PageLayout
      title={`${exhibitionGuide.title} guide` || ''}
      description={pageDescriptions.exhibitionGuides}
      url={{ pathname: pathname }}
      jsonLd={jsonLd}
      openGraphType={'website'}
      siteSection={'exhibition-guides'}
      image={exhibitionGuide.image || undefined}
      headerProps={{
        customNavLinks: exhibitionGuidesLinks,
        showLibraryLogin: false,
      }}
      hideNewsletterPromo={true}
      hideFooter={true}
    >
      {!type ? (
        <Layout10 isCentered={false}>
          <SpacingSection>
            <Space
              v={{ size: 'l', properties: ['margin-top'] }}
              className={classNames({
                [font('wb', 1)]: true,
              })}
            >
              <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
                <h1 className="no-margin">
                  {`Choose the ${exhibitionGuide.title} guide for you`}
                </h1>
              </Space>
            </Space>
            <Space v={{ size: 'l', properties: ['margin-top'] }}>
              <ExhibitionLinks
                stops={exhibitionGuide.components}
                pathname={pathname}
              />
            </Space>
          </SpacingSection>
        </Layout10>
      ) : (
        <>
          <Header color={typeColor}>
            <Layout8 shift={false}>
              <>
                <h2 className="h0 no-margin">{exhibitionGuide.title}</h2>
                <h3 className="h1">{getTypeTitle(type)}</h3>
                {exhibitionGuide.relatedExhibition && (
                  <p>{exhibitionGuide.relatedExhibition.description}</p>
                )}
                <Space
                  as="span"
                  h={{ size: 's', properties: ['margin-right'] }}
                >
                  <ButtonSolidLink
                    colors={themeValues.buttonColors.charcoalWhiteCharcoal}
                    text="Change guide type"
                    link={`/guides/exhibitions/${exhibitionGuide.id}`}
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
          <Space v={{ size: 'xl', properties: ['margin-top'] }}>
            {userPreferenceSet ? (
              // TODO: implement delete cookie on click of Change guide type
              <p>
                This exhibition has {exhibitionGuide.components.length} stops.
                You have indicated a preference for this guide type, to select
                another type select Change guide type.
              </p>
            ) : (
              <p>
                This exhibition has {exhibitionGuide.components.length} stops.
              </p>
            )}
            <ExhibitionStops type={type} stops={exhibitionGuide.components} />
          </Space>
        </>
      )}
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
