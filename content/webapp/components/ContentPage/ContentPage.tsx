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
      'https://wellcomecollection-polly.s3.eu-west-1.amazonaws.com/b1f894e8-4f9f-49e7-a316-609695d84a9d.mp3',
  },
  // History of condoms from animal to rubber
  {
    articleId: 'W88vXBIAAOEyzwO_',
    audioUrl:
      'https://wellcomecollection-polly.s3.eu-west-1.amazonaws.com/1dc31cd0-17fd-4dab-ae31-f4a3981c9949.mp3',
  },
  // The shocking ‘treatment’ to make lesbians straight
  // A lot of quotes, only the ones in a blockquote will be read as different. A word in quotes won't be.
  {
    articleId: 'XhWjZhAAACUAOpV2',
    audioUrl:
      'https://wellcomecollection-polly.s3.eu-west-1.amazonaws.com/7650fe7f-303e-4124-ab87-5699d7469a7b.mp3',
  },
  // Nymphomania and hypersexuality in women and men
  {
    articleId: 'W_v8XxQAACgA_WKS',
    audioUrl:
      'https://wellcomecollection-polly.s3.eu-west-1.amazonaws.com/7e178861-37bb-4e64-a5b8-93745501dc27.mp3',
  },
  // Getting sexy with cinnamon
  // The addendum at the bottom of the article is read out as is, since it's rich text.
  {
    articleId: 'WilSbykAANoWFUhP',
    audioUrl:
      'https://wellcomecollection-polly.s3.eu-west-1.amazonaws.com/674123cd-33a0-4c0c-8556-a2ce7257b1a1.mp3',
  },
  // Befriending heavy breathers
  // Quotes with newscaster voice
  {
    articleId: 'XqKkYxAAACMATUnN',
    audioUrl:
      'https://wellcomecollection-polly.s3.eu-west-1.amazonaws.com/5a9868db-31ed-475a-890b-b6d6aa712cae.mp3',
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
  // What is hysteria?
  {
    articleId: 'W89GZBIAAN4yz1hQ',
    audioUrl:
      'https://wellcomecollection-polly.s3.eu-west-1.amazonaws.com/e9894177-8290-4912-a5ef-dd73ff092ac1.mp3',
  },
  // Race, religion and the Black Madonna
  // There is a lot of copy in the image captions that isn't being read.
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
                      title="Listen to this story"
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
