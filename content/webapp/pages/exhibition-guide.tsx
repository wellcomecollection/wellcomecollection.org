import {
  ExhibitionGuide,
  ExhibitionGuideComponent,
} from '../types/exhibition-guides';
import { createClient } from '../services/prismic/fetch';
import { fetchExhibitionGuide } from '../services/prismic/fetch/exhibition-guides';
import { transformExhibitionGuide } from '../services/prismic/transformers/exhibition-guides';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { FC } from 'react';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { exhibitionGuideLd } from '../services/prismic/transformers/json-ld';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import Space from '@weco/common/views/components/styled/Space';
import ExhibitionCaptions from '../components/ExhibitionCaptions/ExhibitionCaptions';
import { GetServerSideProps } from 'next';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import styled from 'styled-components';
import { exhibitionGuidesLinks } from '@weco/common/views/components/Header/Header';
import AudioPlayer from '@weco/common/views/components/AudioPlayer/AudioPlayer';
import VideoEmbed from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';

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

const TypeLink = styled.a`
  flex-basis: calc(50% - 20px);
  flex-grow: 0;
  flex-shrink: 0;

  padding: 10px;
  text-decoration: none;
  background: ${props => props.theme.color('turquoise', 'light')};

  &:hover,
  &:focus {
    background: ${props => props.theme.color('marble')};
  }
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
    const exhibitionGuideDocument = await fetchExhibitionGuide(
      client,
      id as string
    );
    if (exhibitionGuideDocument) {
      const exhibitionGuide = transformExhibitionGuide(exhibitionGuideDocument);

      const jsonLd = exhibitionGuideLd(exhibitionGuide);

      return {
        props: removeUndefinedProps({
          exhibitionGuide,
          jsonLd,
          serverData,
          type: isValidType(type) ? (type as GuideType) : undefined,
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

const ExhibitionStops = ({ type, stops }) => {
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

const ExhibitionGuidesPage: FC<Props> = props => {
  const { exhibitionGuide, jsonLd, type } = props;
  const pathname = `guides/exhibitions/${exhibitionGuide.id}${
    type ? `/${type}` : ''
  }`;
  return (
    <PageLayout
      title={exhibitionGuide.title || ''}
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
        <Layout10>
          <Space v={{ size: 'xl', properties: ['margin-top'] }}>
            <h1 className="h1">{`Choose the ${exhibitionGuide.title} guide for you`}</h1>
          </Space>
          <Space
            v={{ size: 'l', properties: ['margin-top'] }}
            className="flex flex--wrap"
            style={{ gap: '10px' }}
          >
            <TypeLink href={`/${pathname}/audio-without-descriptions`}>
              <h2 className="h2">Listen, without audio descriptions</h2>
              <p>Find out more about the exhibition with short audio tracks.</p>
            </TypeLink>
            <TypeLink href={`/${pathname}/audio-with-descriptions`}>
              <h2 className="h2">Listen, with audio descriptions</h2>
              <p>
                Find out more about the exhibition with short audio tracks,
                including descriptions of the objects.
              </p>
            </TypeLink>
            <TypeLink href={`/${pathname}/captions-and-transcripts`}>
              <h2 className="h2">Read captions and transcripts</h2>
              <p>
                All the wall and label texts from the gallery, and images of the
                objects, great for those without headphones.
              </p>
            </TypeLink>
            <TypeLink href={`/${pathname}/bsl`}>
              <h2 className="h2">Watch BSL videos</h2>
              <p>
                Commentary about the exhibition in British Sign Language videos.
              </p>
            </TypeLink>
          </Space>
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
    </PageLayout>
  );
};

export default ExhibitionGuidesPage;
