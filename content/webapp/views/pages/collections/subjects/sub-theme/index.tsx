import { SliceZone } from '@prismicio/react';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import styled from 'styled-components';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { ThemeCardsListSlice as RawThemeCardsListSlice } from '@weco/common/prismicio-types';
import { font } from '@weco/common/utils/classnames';
import { ReturnedResults } from '@weco/common/utils/search';
import {
  ApiToolbarLink,
  createPrismicLink,
} from '@weco/common/views/components/ApiToolbar';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { components } from '@weco/common/views/slices';
import {
  Image as ImageType,
  RelatedConcept,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import { Page } from '@weco/content/types/pages';
import CollaboratorCards from '@weco/content/views/components/CollaboratorCards';
import ImageModal, {
  useExpandedImage,
} from '@weco/content/views/components/ImageModal';
import InPageNavigation from '@weco/content/views/components/InPageNavigation';
import WorkCards from '@weco/content/views/components/WorkCards';
import ThematicBrowsingLayout from '@weco/content/views/layouts/ThematicBrowsingLayout';

import SubThemeImages from './sub-theme.Images';
import SubThemeRelatedTopics from './sub-theme.RelatedTopics';
import SubThemeStories from './sub-theme.Stories';
import SubThemeWorks from './sub-theme.Works';

const PageGrid = styled(Grid)`
  background: ${props => props.theme.color('white')};
  row-gap: 0;
`;

const Title = styled(Space).attrs({
  className: font('sans-bold', 2),
  as: 'h2',
  $v: { size: 'md', properties: ['margin-bottom'] },
})<{
  $hasDarkBackground?: boolean;
}>`
  color: ${props =>
    props.$hasDarkBackground ? props.theme.color('white') : 'inherit'};
`;

const SpacingWrapper = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
})`
  &:first-child {
    padding-top: 0;
  }
`;

const DarkSectionWrapper = styled(Space).attrs({
  $v: { size: 'lg', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('neutral.700')};
`;

const StretchWrapper = styled.section<{ $hasDarkBackground?: boolean }>`
  ${props => props.theme.pageGridOffset('margin-right')};

  ${props =>
    props.$hasDarkBackground &&
    `
    &::before {
      content: '';
      position: absolute;
      width: calc(100vw - 100%);
      top: 0;
      background: ${props.theme.color('neutral.700')};
      bottom: 0;
      right: 100%;
      z-index: 0;
    }
  `}
`;

const ThemeCardsListSection = styled(StretchWrapper)`
  /* Enough space to clear the sticky header 
  This is usually applied to h2 (in typography.ts
  But we don't have one here. */

  scroll-margin-top: 3rem;

  @media (min-width: ${props => props.theme.sizes.md}) {
    /* Align the top of the heading with the top of the side navigation */
    scroll-margin-top: ${props => props.theme.getSpaceValue('md', 'md')};
  }

  ${Container} {
    padding-left: 0;
  }
`;

type TransformedWorkTypeBucket = {
  id: string;
  label: string;
  count: number;
};
export type WorksForTabs = ReturnedResults<WorkBasic> & {
  workTypes: TransformedWorkTypeBucket[];
};

type WorksAndImagesResponse = {
  works?: WorksForTabs;
  images?: ReturnedResults<ImageType>;
  displayLabels: string[];
};

export type Props = {
  thematicBrowsingPage: Page;
  apiToolbarLinks: ApiToolbarLink[];
  curatedUid: string;
  categoryThemeCardsList?: RawThemeCardsListSlice;
  newOnlineWorks: WorkBasic[];
  frequentCollaborators: RelatedConcept[];
  relatedStoriesId: string[];
  worksAndImagesAbout: WorksAndImagesResponse;
  relatedTopics: RelatedConcept[];
  jsonLd: JsonLdObj;
};

const SectionContainer = ({
  title,
  id,
  hasDarkBackground,
  children,
}: {
  title: string;
  id: string;
  hasDarkBackground?: boolean;
  children: ReactNode;
}) => {
  return (
    <ConditionalWrapper
      condition={!!hasDarkBackground}
      wrapper={children => <DarkSectionWrapper>{children}</DarkSectionWrapper>}
    >
      <SpacingWrapper>
        <Title id={id} $hasDarkBackground={hasDarkBackground}>
          {title}
        </Title>
        {children}
      </SpacingWrapper>
    </ConditionalWrapper>
  );
};

const WellcomeSubThemePage: NextPage<Props> & {
  getLayout?: (page: ReactElement<Props>) => ReactElement;
} = ({
  thematicBrowsingPage,
  categoryThemeCardsList,
  newOnlineWorks,
  frequentCollaborators,
  relatedStoriesId,
  worksAndImagesAbout,
  relatedTopics,
}) => {
  const [expandedImage, setExpandedImage] = useExpandedImage(
    worksAndImagesAbout.images?.pageResults || []
  );

  const lowerCasePageTitle = thematicBrowsingPage.title.toLowerCase();
  const onThisPage = [
    ...(newOnlineWorks.length > 0
      ? [
          {
            text: `New works in ${lowerCasePageTitle}`,
            url: `#new-online`,
          },
        ]
      : []),
    ...(frequentCollaborators.length > 0
      ? [
          {
            text: 'Frequent collaborators',
            url: `#frequent-collaborators`,
          },
        ]
      : []),
    ...(relatedStoriesId.length > 0
      ? [
          {
            text: `Stories about ${lowerCasePageTitle}`,
            url: `#stories`,
          },
        ]
      : []),
    ...(worksAndImagesAbout.images &&
    worksAndImagesAbout.images.totalResults > 0
      ? [{ text: `Images from the collections`, url: `#images-about` }]
      : []),
    ...(worksAndImagesAbout.works && worksAndImagesAbout.works.totalResults > 0
      ? [{ text: `Works from the collections`, url: `#works-about` }]
      : []),
    ...(relatedTopics.length > 0
      ? [
          {
            text: `Related topics`,
            url: `#related-topics`,
          },
        ]
      : []),
  ];

  return (
    <Container>
      {categoryThemeCardsList && (
        <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
          <ThemeCardsListSection>
            <SliceZone
              slices={[categoryThemeCardsList]}
              components={components}
              context={{ hasNoShim: true }}
            />
          </ThemeCardsListSection>
        </Space>
      )}

      <PageGrid>
        <InPageNavigation
          links={onThisPage}
          sizeMap={{ s: [12], m: [12], l: [3], xl: [3] }}
          isOnWhite
        />

        <GridCell $sizeMap={{ s: [12], m: [12], l: [9], xl: [9] }}>
          <Space $v={{ size: 'md', properties: ['padding-top'] }}>
            {newOnlineWorks.length > 0 && (
              <SectionContainer
                title={`New works in ${lowerCasePageTitle}`}
                id="new-online"
              >
                <WorkCards works={newOnlineWorks} columns={3} />
              </SectionContainer>
            )}

            {frequentCollaborators.length > 0 && (
              <SectionContainer
                title="Frequent collaborators"
                id="frequent-collaborators"
              >
                <CollaboratorCards collaborators={frequentCollaborators} />
              </SectionContainer>
            )}

            {relatedStoriesId?.length > 0 && (
              <SectionContainer
                title={`Stories about ${lowerCasePageTitle}`}
                id="stories"
              >
                <SubThemeStories relatedStoriesId={relatedStoriesId} />
              </SectionContainer>
            )}

            {worksAndImagesAbout.images &&
              worksAndImagesAbout.images.totalResults > 0 && (
                <StretchWrapper $hasDarkBackground>
                  <DarkSectionWrapper>
                    <Title id="images-about" $hasDarkBackground>
                      Images about {lowerCasePageTitle}
                    </Title>

                    <SubThemeImages
                      subThemeName={lowerCasePageTitle}
                      images={worksAndImagesAbout.images}
                      conceptsDisplayLabels={worksAndImagesAbout.displayLabels}
                    />
                  </DarkSectionWrapper>
                </StretchWrapper>
              )}

            {worksAndImagesAbout.works &&
              worksAndImagesAbout.works.totalResults > 0 && (
                <SectionContainer
                  title={`Works about ${lowerCasePageTitle}`}
                  id="works-about"
                >
                  <SubThemeWorks
                    subThemeName={lowerCasePageTitle}
                    works={worksAndImagesAbout.works}
                    conceptsDisplayLabels={worksAndImagesAbout.displayLabels}
                  />
                </SectionContainer>
              )}

            {relatedTopics && relatedTopics.length > 0 && (
              <SectionContainer title="Related topics" id="related-topics">
                <SubThemeRelatedTopics relatedTopics={relatedTopics} />
              </SectionContainer>
            )}
          </Space>
        </GridCell>
      </PageGrid>

      {worksAndImagesAbout.images &&
        worksAndImagesAbout.images.totalResults > 0 && (
          <>
            {/* https://frontendmasters.com/blog/containers-context/
            A Safari bug is forcing this to live here instead of its parent, ImageResults.
            The bug got fixed in Safari 18.2 (I think) but we support the latest two versions.
            It would be nice to move it back inside ImageResults once we're two versions ahead. */}
            <ImageModal
              images={worksAndImagesAbout.images.pageResults}
              expandedImage={expandedImage}
              setExpandedImage={setExpandedImage}
            />
          </>
        )}
    </Container>
  );
};

WellcomeSubThemePage.getLayout = page => {
  return (
    <ThematicBrowsingLayout
      page={page.props.thematicBrowsingPage}
      apiToolbarLinks={[
        ...page.props.apiToolbarLinks,
        createPrismicLink(page.props.thematicBrowsingPage.id),
      ]}
      currentCategory="subjects"
      subPageUid={page.props.curatedUid}
      extraBreadcrumbs={[
        { url: `/${prismicPageIds.collections}/subjects`, text: 'Subjects' },
      ]}
      jsonLd={page.props.jsonLd}
    >
      {page}
    </ThematicBrowsingLayout>
  );
};

export default WellcomeSubThemePage;
