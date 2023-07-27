import styled from 'styled-components';
import { Children, createContext, ReactNode, ReactElement } from 'react';
import { sectionLevelPages } from '@weco/common/data/hardcoded-ids';
import { Season } from '@weco/content/types/seasons';
import { ElementFromComponent } from '@weco/common/utils/utility-types';
import { MultiContent } from '@weco/content/types/multi-content';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import PageHeader, {
  headerSpaceSize,
} from '@weco/common/views/components/PageHeader/PageHeader';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import Space from '@weco/common/views/components/styled/Space';
import BannerCard from '../BannerCard/BannerCard';
import Contributors from '../Contributors/Contributors';
import Outro from '../Outro/Outro';
import { Contributor } from '@weco/content/types/contributors';
import AudioPlayer from '@weco/common/views/components/AudioPlayer/AudioPlayer';
import { useToggles } from '@weco/common/server-data/Context';

export const PageBackgroundContext = createContext<'warmNeutral.300' | 'white'>(
  'white'
);

// TODO delete once we get rid of the Polly Experiment
const pollyRecordings: { articleId: string; audioUrl: string }[] = [
  // A brief history of tattoos
  {
    articleId: 'W9m2QxcAAF8AFvE5',
    audioUrl:
      'https://wellcomecollection-polly.s3.eu-west-1.amazonaws.com/42235d89-05f4-40f5-899d-4e61a7a4b15a.mp3',
  },
  // History of condoms from animal to rubbers
  {
    articleId: 'W88vXBIAAOEyzwO_',
    audioUrl:
      'https://wellcomecollection-polly.s3.eu-west-1.amazonaws.com/a088b205-4736-404c-96c8-c485c7fc0aa5.mp3',
  },
  // TODO: The shocking ‘treatment’ to make lesbians straight
  // A lot of quotes + how to treat intonation when a word is in quotes
  {
    articleId: 'XhWjZhAAACUAOpV2',
    audioUrl: '',
  },
  // Nymphomania and hypersexuality in women and men
  {
    articleId: 'W_v8XxQAACgA_WKS',
    audioUrl:
      'https://wellcomecollection-polly.s3.eu-west-1.amazonaws.com/7e178861-37bb-4e64-a5b8-93745501dc27.mp3',
  },
  // TODO: Getting sexy with cinnamon
  // How to do item list?
  {
    articleId: 'WilSbykAANoWFUhP',
    audioUrl: '',
  },
  // TODO: Befriending heavy breathers
  //
  {
    articleId: 'XqKkYxAAACMATUnN',
    audioUrl: '',
  },
  // The side effects of lithium mining
  {
    articleId: 'YTdnPhIAACIAGuF3',
    audioUrl:
      'https://wellcomecollection-polly.s3.eu-west-1.amazonaws.com/9d05c353-948f-496e-8a9a-740d81d13962.mp3',
  },
  // Drugs in Victorian Britain
  {
    articleId: 'W87wthIAACQizfap',
    audioUrl:
      'https://wellcomecollection-polly.s3.eu-west-1.amazonaws.com/c98f030e-1fd2-4442-add8-e1fb45acb95a.mp3',
  },
  // TODO: What is hysteria?
  // How to do list items
  {
    articleId: 'W89GZBIAAN4yz1hQ',
    audioUrl: '',
  },
  // Race, religion and the Black Madonna
  // A lot of copy in the image captions that isn't being read
  {
    articleId: 'WpmW_yUAAKUUF6mV',
    audioUrl:
      'https://wellcomecollection-polly.s3.eu-west-1.amazonaws.com/adb5e6fd-601b-45cc-80ae-c838f4f42cfe.mp3',
  },
];

type Props = {
  id: string;
  isCreamy?: boolean;
  Header: ElementFromComponent<typeof PageHeader>;
  Body?: ReactElement<{ body: { type: string }[] }>;
  // This is used for content type specific components e.g. InfoBox
  children?: ReactNode;
  RelatedContent?: ReactNode[];
  outroProps?: {
    researchLinkText?: string;
    researchItem?: MultiContent;
    readLinkText?: string;
    readItem?: MultiContent;
    visitLinkText?: string;
    visitItem?: MultiContent;
  };
  postOutroContent?: ReactNode;
  seasons?: Season[];
  contributors?: Contributor[];
  contributorTitle?: string;
  hideContributors?: true;
};

const Wrapper = styled.div<{ isCreamy: boolean }>`
  overflow: auto;
  ${props =>
    props.isCreamy &&
    `background-color: ${props.theme.color('warmNeutral.300')}`};
`;

const ContentPage = ({
  id,
  isCreamy = false,
  Header,
  Body,
  children,
  RelatedContent = [],
  outroProps,
  postOutroContent,
  seasons = [],
  contributors,
  contributorTitle,
  hideContributors,
}: Props): ReactElement => {
  const toggles = useToggles();

  // We don't want to add a spacing unit if there's nothing to render
  // in the body (we don't render the 'standfirst' here anymore).
  function shouldRenderBody() {
    if (!Body) return false;

    if (
      Body.props.body.length === 1 &&
      Body.props.body[0].type === 'standfirst'
    )
      return false;
    if (Body.props.body.length > 0) return true;
  }

  const hasPollyRecording = pollyRecordings.find(
    ({ articleId, audioUrl }) => articleId === id && !!audioUrl
  );

  return (
    <PageBackgroundContext.Provider
      value={isCreamy ? 'warmNeutral.300' : 'white'}
    >
      <article data-wio-id={id}>
        {sectionLevelPages.includes(id) ? (
          Header
        ) : (
          // This space is coupled to the `bottom` value in PageHeader.js
          <Space v={{ size: headerSpaceSize, properties: ['padding-bottom'] }}>
            {Header}
          </Space>
        )}
        <Wrapper isCreamy={isCreamy}>
          {shouldRenderBody() && (
            <SpacingSection>
              {/* TODO: Remove after Polly Experiment */}
              {toggles.polly && hasPollyRecording && (
                <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
                  <Layout8>
                    <AudioPlayer
                      title="Listen to this article"
                      audioFile={hasPollyRecording.audioUrl}
                    />
                  </Layout8>
                </Space>
              )}
              {/*  */}

              {Body}
            </SpacingSection>
          )}
          {children && (
            <SpacingSection>
              {Children.map(children, child => (
                <>
                  {child && (
                    <SpacingComponent>
                      <Layout8>{child}</Layout8>
                    </SpacingComponent>
                  )}
                </>
              ))}
            </SpacingSection>
          )}
          {!hideContributors && contributors && contributors.length > 0 && (
            <SpacingSection>
              <Layout8>
                <Contributors
                  contributors={contributors}
                  titleOverride={contributorTitle}
                />
              </Layout8>
            </SpacingSection>
          )}
        </Wrapper>
      </article>
      <Wrapper isCreamy={isCreamy}>
        {RelatedContent.length > 0 && (
          <SpacingSection>
            {Children.map(RelatedContent, child => (
              <>{child}</>
            ))}
          </SpacingSection>
        )}

        {outroProps && (
          <SpacingSection>
            <Layout8>
              <Outro {...outroProps} />
            </Layout8>
          </SpacingSection>
        )}

        {postOutroContent && <Layout8>{postOutroContent}</Layout8>}

        {seasons.length > 0 &&
          seasons.map(season => (
            <SpacingSection key={season.id}>
              <Layout12>
                <BannerCard item={season} />
              </Layout12>
            </SpacingSection>
          ))}
      </Wrapper>
    </PageBackgroundContext.Provider>
  );
};

export default ContentPage;
