import { SliceZone } from '@prismicio/react';
import { NextPage } from 'next';
import { ReactElement, useMemo } from 'react';
import styled from 'styled-components';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { ThemeCardsListSlice as RawThemeCardsListSlice } from '@weco/common/prismicio-types';
import { font } from '@weco/common/utils/classnames';
import { pluralize } from '@weco/common/utils/grammar';
import {
  ApiToolbarLink,
  createPrismicLink,
} from '@weco/common/views/components/ApiToolbar';
import Button from '@weco/common/views/components/Buttons';
import { Container } from '@weco/common/views/components/styled/Container';
import {
  Grid,
  GridCell,
  GridCellScroll,
  GridScroll,
} from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { components } from '@weco/common/views/slices';
import { themeValues } from '@weco/common/views/themes/config';
import {
  RelatedConcept,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import { Article } from '@weco/content/types/articles';
import { Page } from '@weco/content/types/pages';
import CatalogueImageGallery from '@weco/content/views/components/CatalogueImageGallery';
import InPageNavigation from '@weco/content/views/components/InPageNavigation';
import StoryCard from '@weco/content/views/components/StoryCard';
import WorkCards from '@weco/content/views/components/WorkCards';
import WorksSearchResults from '@weco/content/views/components/WorksSearchResults';
import ThematicBrowsingLayout from '@weco/content/views/layouts/ThematicBrowsingLayout';
// TODO: centralise type
import { SectionData } from '@weco/content/views/pages/concepts/concept/concept.helpers';

export type Props = {
  thematicBrowsingPage: Page;
  apiToolbarLinks: ApiToolbarLink[];
  curatedUid: string;
  categoryThemeCardsList?: RawThemeCardsListSlice;
  newOnlineWorks: WorkBasic[];
  relatedStories: Article[];
  worksAndImagesAbout: SectionData;
  relatedTopics: RelatedConcept[];
};

const PageGrid = styled(Grid)`
  background: ${props => props.theme.color('white')};
  row-gap: 0;
`;

const Title = styled.h2.attrs({ className: font('sans-bold', 2) })<{
  $hasDarkBackground?: boolean;
}>`
  color: ${props =>
    props.$hasDarkBackground ? props.theme.color('white') : 'inherit'};
`;

const StoryCardContainer = styled.div`
  -webkit-overflow-scrolling: touch;

  /* former .container--scroll */
  ${props =>
    props.theme.mediaBetween(
      'zero',
      'sm'
    )(`
    max-width: none;
    width: auto;
    overflow: auto;

    &::-webkit-scrollbar {
      height: 18px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 0;
      border-style: solid;
      border-width: 0 ${props.theme.containerPadding} 12px;
      background: ${props.theme.color('neutral.400')};
    }
  `)}

  &::-webkit-scrollbar {
    background: ${props => props.theme.color('warmNeutral.300')};
  }

  &::-webkit-scrollbar-thumb {
    border-color: ${props => props.theme.color('warmNeutral.300')};
  }
`;

const ThemeImagesWrapper = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-bottom'] },
})`
  background-color: ${props => props.theme.color('neutral.700')};
`;

const RelatedConceptsContainer = styled.div.attrs({
  className: font('sans-bold', -1),
})`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${props => props.theme.spacingUnits['100']};
`;
const RelatedConceptItem = styled.div.attrs({
  className: font('sans', -2),
})`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacingUnits['100']};
`;

const WellcomeSubThemePage: NextPage<Props> & {
  getLayout?: (page: ReactElement<Props>) => ReactElement;
} = ({
  thematicBrowsingPage,
  categoryThemeCardsList,
  newOnlineWorks,
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

  const firstTenImages = useMemo(
    () => worksAndImagesAbout.images?.pageResults.slice(0, 10) || [],
    [worksAndImagesAbout]
  );

  return (
    <Container>
      <PageGrid>
        <InPageNavigation
          variant="sticky"
          links={onThisPage}
          sizeMap={{ s: [12], m: [12], l: [3], xl: [3] }}
          isOnWhite
        />

        <GridCell $sizeMap={{ s: [12], m: [12], l: [9], xl: [7] }}>
          <Space $v={{ size: 'sm', properties: ['padding-top'] }}>
            {/* TODO this doesn't work within the container. */}
            {/* Also, does it not appear in the side menu? It has no heading. */}
            {categoryThemeCardsList && (
              <SliceZone
                slices={[categoryThemeCardsList]}
                components={components}
              />
            )}

            {newOnlineWorks.length > 0 && (
              <Space $v={{ size: 'xl', properties: ['padding-top'] }}>
                <Title id="new-online">New works in {lowerCasePageTitle}</Title>

                <Space $v={{ size: 'md', properties: ['margin-top'] }}>
                  <WorkCards works={newOnlineWorks} columns={3} />
                </Space>
              </Space>
            )}

            {/* TODO this uses Content List, which doesn't return labels or Part of */}
            {/* Figure out what solution we'd like to go with... */}
            {relatedStories?.length > 0 && (
              <Space $v={{ size: 'xl', properties: ['padding-top'] }}>
                <Title id="stories">Stories about {lowerCasePageTitle}</Title>

                <StoryCardContainer>
                  <Space $v={{ size: 'md', properties: ['padding-bottom'] }}>
                    <GridScroll className="card-theme card-theme--transparent">
                      {relatedStories.map(article => (
                        <GridCellScroll
                          key={article.id}
                          $sizeMap={{ m: [6], l: [4], xl: [4] }}
                        >
                          <Space
                            $v={{ size: 'sm', properties: ['margin-bottom'] }}
                          >
                            <StoryCard variant="prismic" article={article} />
                          </Space>
                        </GridCellScroll>
                      ))}
                    </GridScroll>
                  </Space>
                </StoryCardContainer>
              </Space>
            )}

            {worksAndImagesAbout && (
              <>
                {/* TODO this doesn't work within the container. */}
                {worksAndImagesAbout.images &&
                  worksAndImagesAbout.images.pageResults.length > 0 && (
                    <Space $v={{ size: 'xl', properties: ['padding-top'] }}>
                      <ThemeImagesWrapper>
                        <Title id="images-about" $hasDarkBackground>
                          Images about {lowerCasePageTitle}
                        </Title>

                        <CatalogueImageGallery
                          // Show the first 10 images, unless the total is 12 or fewer, in which case show all images
                          images={
                            worksAndImagesAbout.images.totalResults > 12
                              ? firstTenImages
                              : worksAndImagesAbout.images.pageResults
                          }
                          detailsCopy={`${pluralize(worksAndImagesAbout.images.totalResults, 'image')} from works`}
                          variant="scrollable"
                        />

                        {/* TODO add View more button */}
                      </ThemeImagesWrapper>
                    </Space>
                  )}

                {worksAndImagesAbout.works &&
                  worksAndImagesAbout.works.pageResults.length > 0 && (
                    <Space $v={{ size: 'xl', properties: ['padding-top'] }}>
                      <Title id="works-about">
                        Works about {lowerCasePageTitle}
                      </Title>

                      {/* TODO add tabs */}

                      <Space $v={{ size: 'md', properties: ['margin-top'] }}>
                        <WorksSearchResults
                          works={worksAndImagesAbout.works.pageResults}
                        />
                      </Space>
                      {/* TODO add View more button */}
                    </Space>
                  )}
              </>
            )}

            {relatedTopics && relatedTopics.length > 0 && (
              <>
                <Space $v={{ size: 'xl', properties: ['padding-top'] }}>
                  <Title id="related-topics">Related topics</Title>
                  <Space $v={{ size: 'md', properties: ['margin-top'] }}>
                    <RelatedConceptsContainer>
                      {relatedTopics.map(item => (
                        <RelatedConceptItem key={item.id}>
                          <Space className={font('sans', -1)}>
                            <Button
                              // TODO add the relevant tracking info
                              // {...(dataGtmTriggerName && {
                              //   dataGtmProps: {
                              //     trigger: dataGtmTriggerName,
                              //     'position-in-list': `${index + 1}`,
                              //   },
                              // })}
                              variant="ButtonSolidLink"
                              colors={
                                themeValues.buttonColors.slateTransparentBlack
                              }
                              text={item.label}
                              link={`/concepts/${item.id}`}
                              size="small"
                            />
                          </Space>
                        </RelatedConceptItem>
                      ))}
                    </RelatedConceptsContainer>
                  </Space>
                </Space>
              </>
            )}
          </Space>
        </GridCell>
      </PageGrid>
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
