import { SliceZone } from '@prismicio/react';
import { NextPage } from 'next';
import { ReactElement } from 'react';
import styled from 'styled-components';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { ThemeCardsListSlice as RawThemeCardsListSlice } from '@weco/common/prismicio-types';
import { font } from '@weco/common/utils/classnames';
import {
  ApiToolbarLink,
  createPrismicLink,
} from '@weco/common/views/components/ApiToolbar';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { components } from '@weco/common/views/slices';
import {
  RelatedConcept,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import { Article } from '@weco/content/types/articles';
import { Page } from '@weco/content/types/pages';
import CollaboratorCards from '@weco/content/views/components/CollaboratorCards';
import InPageNavigation from '@weco/content/views/components/InPageNavigation';
import WorkCards from '@weco/content/views/components/WorkCards';
import ThematicBrowsingLayout from '@weco/content/views/layouts/ThematicBrowsingLayout';
// TODO: centralise
import { SectionData } from '@weco/content/views/pages/concepts/concept/concept.helpers';

import SubThemeImages from './sub-theme.Images';
import SubThemeRelatedTopics from './sub-theme.RelatedTopics';
import SubThemeStories from './sub-theme.Stories';
import SubThemeWorks from './sub-theme.Works';

const Title = styled.h2.attrs({ className: font('sans-bold', 2) })<{
  $hasDarkBackground?: boolean;
}>`
  color: ${props =>
    props.$hasDarkBackground ? props.theme.color('white') : 'inherit'};
`;

const SectionWrapper = styled(Space).attrs({
  $v: { size: 'lg', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('neutral.700')};
`;

const StretchWrapper = styled.div<{ $hasDarkBackground?: boolean }>`
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

export type Props = {
  thematicBrowsingPage: Page;
  apiToolbarLinks: ApiToolbarLink[];
  curatedUid: string;
  categoryThemeCardsList?: RawThemeCardsListSlice;
  newOnlineWorks: WorkBasic[];
  frequentCollaborators: RelatedConcept[];
  relatedStories: Article[];
  // This type is not great but this whole section will
  // probably be removed when we have a better idea of
  // what we want to show on these pages.
  worksAndImagesAbout: SectionData & {
    works?: { workTypes: unknown[] };
  };
  relatedTopics: RelatedConcept[];
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
  children: React.ReactNode;
}) => {
  return (
    <ConditionalWrapper
      condition={!!hasDarkBackground}
      wrapper={children => <SectionWrapper>{children}</SectionWrapper>}
    >
      <Space $v={{ size: 'xl', properties: ['padding-top'] }}>
        <Title id={id} $hasDarkBackground={hasDarkBackground}>
          {title}
        </Title>
        {children}
      </Space>
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
  relatedStories,
  worksAndImagesAbout,
  relatedTopics,
}) => {
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
    ...(relatedStories.length > 0
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
      <Grid style={{ background: 'white', rowGap: 0 }}>
        <InPageNavigation
          variant="sticky"
          links={onThisPage}
          sizeMap={{ s: [12], m: [12], l: [3], xl: [3] }}
          isOnWhite
        />

        <GridCell $sizeMap={{ s: [12], m: [12], l: [9], xl: [9] }}>
          <Space $v={{ size: 'sm', properties: ['padding-top'] }}>
            {/* TODO does it not appear in the side menu? It has no heading. */}
            {categoryThemeCardsList && (
              <StretchWrapper>
                <SliceZone
                  slices={[categoryThemeCardsList]}
                  components={components}
                  context={{ hasNoShim: true }}
                />
              </StretchWrapper>
            )}

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
                title={`Frequent collaborators on ${lowerCasePageTitle}`}
                id="frequent-collaborators"
              >
                <CollaboratorCards collaborators={frequentCollaborators} />
              </SectionContainer>
            )}

            {relatedStories?.length !== 0 && (
              <SectionContainer
                title={`Stories about ${lowerCasePageTitle}`}
                id="stories"
              >
                <SubThemeStories relatedStories={relatedStories} />
              </SectionContainer>
            )}

            {worksAndImagesAbout.images &&
              worksAndImagesAbout.images.totalResults > 0 && (
                <>
                  <StretchWrapper $hasDarkBackground>
                    <SectionWrapper>
                      <Title id="images-about" $hasDarkBackground>
                        Images about {lowerCasePageTitle}
                      </Title>

                      <SubThemeImages images={worksAndImagesAbout.images} />
                    </SectionWrapper>
                  </StretchWrapper>
                </>
              )}

            {worksAndImagesAbout.works &&
              worksAndImagesAbout.works.totalResults > 0 && (
                <SectionContainer
                  title={`Works about ${lowerCasePageTitle}`}
                  id="images-about"
                >
                  <SubThemeWorks works={worksAndImagesAbout.works} />
                </SectionContainer>
              )}

            {relatedTopics && relatedTopics.length > 0 && (
              <SectionContainer title="Related topics" id="related-topics">
                <SubThemeRelatedTopics relatedTopics={relatedTopics} />
              </SectionContainer>
            )}
          </Space>
        </GridCell>
      </Grid>
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
    >
      {page}
    </ThematicBrowsingLayout>
  );
};

export default WellcomeSubThemePage;
