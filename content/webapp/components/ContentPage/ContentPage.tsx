import styled from 'styled-components';
import {
  Children,
  Fragment,
  createContext,
  ReactNode,
  ReactElement,
} from 'react';
import {
  prismicPageIds,
  sectionLevelPages,
} from '@weco/common/data/hardcoded-ids';
import { Season } from '../../types/seasons';
import { ElementFromComponent } from '@weco/common/utils/utility-types';
import { MultiContent } from '../../types/multi-content';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import PageHeader, {
  headerSpaceSize,
} from '@weco/common/views/components/PageHeader/PageHeader';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import CompactCard from '../CompactCard/CompactCard';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';
import BannerCard from '../BannerCard/BannerCard';
import Contributors from '../Contributors/Contributors';
import Outro from '../Outro/Outro';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { Contributor } from '../../types/contributors';

export const PageBackgroundContext = createContext<'warmNeutral.300' | 'white'>(
  'white'
);

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

const ShameBorder = styled(Space).attrs({
  v: { size: 'l', properties: ['margin-top'] },
})`
  border-bottom: 1px solid ${props => props.theme.color('warmNeutral.400')};
`;
// FIXME: obviously we can't carry on like this!
const ShameWhatWeDoHack = () => (
  <Layout8>
    <ShameBorder />
    <CompactCard
      url="/user-panel"
      title="Join our user panel"
      primaryLabels={[]}
      secondaryLabels={[]}
      description={pageDescriptions.userPanel}
      Image={
        <PrismicImage
          image={{
            // We intentionally omit the alt text on promos, so screen reader
            // users don't have to listen to the alt text before hearing the
            // title of the item in the list.
            //
            // See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
            contentUrl:
              'https://images.prismic.io/wellcomecollection/65334f9d-50d0-433f-a4ac-a780eef352e3_user_research_square.jpg',
            width: 3200,
            height: 3200,
            alt: '',
          }}
          sizes={{
            xlarge: 1 / 6,
            large: 1 / 6,
            medium: 1 / 5,
            small: 1 / 4,
          }}
          quality="low"
        />
      }
      xOfY={{ x: 1, y: 1 }}
    />
  </Layout8>
);

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
              <div>
                <Fragment>{Body}</Fragment>
                {id === prismicPageIds.whatWeDo && <ShameWhatWeDoHack />}
              </div>
            </SpacingSection>
          )}

          {children && (
            <SpacingSection>
              {Children.map(children, child => (
                <Fragment>
                  {child && (
                    <SpacingComponent>
                      <Layout8>{child}</Layout8>
                    </SpacingComponent>
                  )}
                </Fragment>
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
              <Fragment>{child}</Fragment>
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
