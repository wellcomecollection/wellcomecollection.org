import { Children, createContext, ReactElement, ReactNode } from 'react';
import styled from 'styled-components';

import { sectionLevelPages } from '@weco/common/data/hardcoded-ids';
import { ElementFromComponent } from '@weco/common/utils/utility-types';
import Layout, {
  gridSize12,
  gridSize8,
} from '@weco/common/views/components/Layout';
import PageHeader, {
  headerSpaceSize,
} from '@weco/common/views/components/PageHeader/PageHeader';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import BannerCard from '@weco/content/components/BannerCard/BannerCard';
import { Props as BodyProps } from '@weco/content/components/Body/Body';
import Contributors from '@weco/content/components/Contributors/Contributors';
import { Contributor } from '@weco/content/types/contributors';
import { Season } from '@weco/content/types/seasons';

export const PageBackgroundContext = createContext<'warmNeutral.300' | 'white'>(
  'white'
);

type Props = {
  id: string;
  isCreamy?: boolean;
  Header: ElementFromComponent<typeof PageHeader>;
  Body?: ReactElement<BodyProps>;
  // This is used for content type specific components e.g. InfoBox
  children?: ReactNode;
  RelatedContent?: ReactNode[];
  seasons?: Season[];
  contributors?: Contributor[];
  contributorTitle?: string;
  hideContributors?: true;
};

const Wrapper = styled.div<{ $isCreamy: boolean }>`
  overflow: auto;
  ${props =>
    props.$isCreamy &&
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
  // We don't want to add a spacing unit if there's nothing to render
  // in the body (we don't render the 'standfirst' here anymore).
  function shouldRenderBody() {
    if (!Body) return false;

    if (
      Body.props.untransformedBody.length === 1 &&
      Body.props.untransformedBody[0].slice_type === 'standfirst'
    )
      return false;
    if (Body.props.untransformedBody.length > 0) return true;
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
          <Space $v={{ size: headerSpaceSize, properties: ['padding-bottom'] }}>
            {Header}
          </Space>
        )}
        <Wrapper $isCreamy={isCreamy}>
          {shouldRenderBody() && <SpacingSection>{Body}</SpacingSection>}
          {children && (
            <SpacingSection>
              {Children.map(children, child => (
                <>
                  {child && (
                    <SpacingComponent>
                      <Layout gridSizes={gridSize8()}>{child}</Layout>
                    </SpacingComponent>
                  )}
                </>
              ))}
            </SpacingSection>
          )}
          {!hideContributors && contributors && contributors.length > 0 && (
            <SpacingSection>
              <Layout gridSizes={gridSize8()}>
                <Contributors
                  contributors={contributors}
                  titleOverride={contributorTitle}
                />
              </Layout>
            </SpacingSection>
          )}
        </Wrapper>
      </article>
      <Wrapper $isCreamy={isCreamy}>
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
              <Layout gridSizes={gridSize12()}>
                <BannerCard item={season} />
              </Layout>
            </SpacingSection>
          ))}
      </Wrapper>
    </PageBackgroundContext.Provider>
  );
};

export default ContentPage;
