import { SliceZone } from '@prismicio/react';
import { NextPage } from 'next';
import { ReactElement } from 'react';
import styled from 'styled-components';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { ThemeCardsListSlice as RawThemeCardsListSlice } from '@weco/common/prismicio-types';
import { font } from '@weco/common/utils/classnames';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { Container } from '@weco/common/views/components/styled/Container';
import {
  Grid,
  GridCell,
  GridCellScroll,
  GridScroll,
} from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { components } from '@weco/common/views/slices';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import { Article } from '@weco/content/types/articles';
import { Page } from '@weco/content/types/pages';
import InPageNavigation from '@weco/content/views/components/InPageNavigation';
import StoryCard from '@weco/content/views/components/StoryCard';
import WorkCards from '@weco/content/views/components/WorkCards';
import ThematicBrowsingLayout from '@weco/content/views/layouts/ThematicBrowsingLayout';

export type Props = {
  thematicBrowsingPage: Page;
  curatedUid: string;
  categoryThemeCardsList?: RawThemeCardsListSlice;
  newOnlineWorks: WorkBasic[];
  relatedStories: Article[];
};

const Title = styled.h2.attrs({ className: font('sans-bold', 2) })``;

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

const WellcomeSubThemePage: NextPage<Props> & {
  getLayout?: (page: ReactElement<Props>) => ReactElement;
} = ({
  thematicBrowsingPage,
  categoryThemeCardsList,
  newOnlineWorks,
  relatedStories,
}) => {
  const lcPageTitle = thematicBrowsingPage.title.toLowerCase();
  //TODO add conditionals
  const onThisPage = [
    {
      text: `New works in ${lcPageTitle}`,
      url: `#new-online`,
    },
    { text: `Stories about ${lcPageTitle}`, url: `#stories` },
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

        <GridCell $sizeMap={{ s: [12], m: [12], l: [9], xl: [7] }}>
          <Space $v={{ size: 'sm', properties: ['padding-top'] }}>
            {categoryThemeCardsList && (
              <SliceZone
                slices={[categoryThemeCardsList]}
                components={components}
              />
            )}

            {newOnlineWorks.length > 0 && (
              <Space
                $v={{ size: 'xl', properties: ['padding-top'] }}
                id="new-online"
              >
                <Space $v={{ size: 'md', properties: ['margin-top'] }}>
                  <Title>New works in {lcPageTitle}</Title>

                  <Space $v={{ size: 'md', properties: ['margin-top'] }}>
                    <WorkCards works={newOnlineWorks} columns={3} />
                  </Space>
                </Space>
              </Space>
            )}

            {relatedStories?.length > 0 && (
              <Space
                $v={{ size: 'xl', properties: ['padding-top'] }}
                id="stories"
              >
                <Title>Stories about {lcPageTitle}</Title>

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
      apiToolbarLinks={[createPrismicLink(page.props.thematicBrowsingPage.id)]}
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
