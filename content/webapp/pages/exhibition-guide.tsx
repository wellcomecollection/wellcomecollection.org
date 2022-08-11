import {
  ExhibitionGuide,
  ExhibitionGuideComponent,
} from '../types/exhibition-guides';
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
import { FC } from 'react';
import { IconSvg } from '@weco/common/icons/types';
import { classNames, font } from '@weco/common/utils/classnames';
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
  as: 'li',
  v: { size: 'm', properties: ['margin-bottom'] },
})<StopProps>`
  width: 100%;
  ${props => props.theme.media.large`
    width: calc(50% - 50px);
  `}
  ${props => props.theme.media.xlarge`
    ${props => `width: calc(${props.width}% - 50px)`};
  `}
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
};

const TypeOption: FC<TypeOptionProps> = ({ url, title, text, color, icon }) => (
  <TypeItem>
    <TypeLink href={url} color={color}>
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
  otherExhibitionGuides: any; // TODO
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const { id, type } = context.query;

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
    console.log(exhibitionGuides);

    const basicExhibitionGuides = {
      ...exhibitionGuides,
      results: exhibitionGuides.results.map(
        transformExhibitionGuideToExhibitionGuideBasic
      ),
    };

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
              result => true
              // result => result.id !== id // TODO
            ),
          },
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
    <ul
      className="plain-list no-margin no-padding flex flex--wrap"
      style={{ gap: '50px' }}
    >
      {stops.map((stop, index) => {
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
            <h2>
              {number}. {title}
            </h2>
            {hasContentOfDesiredType ? (
              <>
                {type === 'audio-with-descriptions' &&
                  audioWithDescription?.url && (
                    <AudioPlayer
                      title={stop.title} // TODO option not to display title
                      audioFile={audioWithDescription.url}
                    />
                  )}
                {type === 'audio-without-descriptions' &&
                  audioWithoutDescription?.url && (
                    <AudioPlayer
                      title={title} // TODO option not to display title
                      audioFile={audioWithoutDescription.url}
                    />
                  )}
                {type === 'bsl' && bsl?.embedUrl && (
                  <VideoEmbed embedUrl={bsl.embedUrl as string} />
                )}
              </>
            ) : (
              <>
                <p>There is no content to display</p>
              </>
            )}
          </Stop>
        );
      })}
    </ul>
  );
};

const ExhibitionStops: FC<StopsProps> = ({ stops, type }) => {
  switch (type) {
    case 'bsl':
    case 'audio-with-descriptions':
    case 'audio-without-descriptions':
      return <Stops stops={stops} type={type} />;
    case 'captions-and-transcripts':
      return <ExhibitionCaptions stops={stops} />;
    default:
      return null;
  }
};

type ExhibitionLinksProps = {
  stops: ExhibitionGuideComponent[];
  pathname: string;
};
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
        // TODO pass in correct colours from theme, onnce new colour palette is established
        <TypeOption
          url={`/${pathname}/audio-without-descriptions`}
          title="Listen, without audio descriptions"
          text="Find out more about the exhibition with short audio tracks."
          color="newPaletteOrange"
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
        />
      )}
      {hasBSLVideo && (
        <TypeOption
          url={`/${pathname}/bsl`}
          title="Watch BSL videos"
          text="Commentary about the exhibition in British Sign Language videos."
          color="newPaletteBlue"
          icon={britishSignLanguage}
        />
      )}
    </TypeList>
  );
};

const ExhibitionGuidePage: FC<Props> = props => {
  const { exhibitionGuide, jsonLd, type, otherExhibitionGuides } = props;
  const pathname = `guides/exhibitions/${exhibitionGuide.id}${
    type ? `/${type}` : ''
  }`;

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
        <Layout10>
          <Space v={{ size: 'xl', properties: ['margin-top'] }}>
            <h2>{exhibitionGuide.title}</h2>
          </Space>
          <Space v={{ size: 'xl', properties: ['margin-top'] }}>
            <h3>Introduction</h3>
            {exhibitionGuide.relatedExhibition && (
              <p>{exhibitionGuide.relatedExhibition.description}</p>
            )}
            <p>
              <Space as="span" h={{ size: 's', properties: ['margin-right'] }}>
                <ButtonSolidLink
                  text="Change guide type"
                  link={`/guides/exhibitions/${exhibitionGuide.id}`}
                />
              </Space>
              <ButtonSolidLink
                text="Change exhibition"
                link="/guides/exhibitions"
              />
            </p>
          </Space>
          <Space v={{ size: 'xl', properties: ['margin-top'] }}>
            <ExhibitionStops type={type} stops={exhibitionGuide.components} />
          </Space>
        </Layout10>
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
