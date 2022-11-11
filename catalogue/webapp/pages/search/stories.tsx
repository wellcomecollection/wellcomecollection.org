import { GetServerSideProps } from 'next';
import styled from 'styled-components';

import Space from '@weco/common/views/components/styled/Space';
import { getSearchLayout } from '@weco/catalogue/components/SearchPageLayout/SearchPageLayout';
import SearchPagination from '@weco/common/views/components/SearchPagination/SearchPagination';
import SearchNoResults from '@weco/catalogue/components/SearchNoResults/SearchNoResults';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';

import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import { font } from '@weco/common/utils/classnames';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { AppErrorProps } from '@weco/common/services/app';
import { getServerData } from '@weco/common/server-data';
import { getStories } from '@weco/catalogue/services/prismic/fetch/articles';
import { Story } from '@weco/catalogue/services/prismic/types/story';
import {
  PrismicApiError,
  PrismicResultsList,
} from '@weco/catalogue/services/prismic/types';
import { Pageview } from '@weco/common/services/conversion/track';

type Props = {
  storyResponseList: PrismicResultsList<Story>;
  totalPages: number;
  query: string;
  pageview: Pageview;
};

const Wrapper = styled.div`
  background-color: ${props => props.theme.color('neutral.200')};
`;

const PaginationWrapper = styled(Space).attrs({
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BottomPaginationWrapper = styled(PaginationWrapper)`
  justify-content: flex-end;
`;

const Container = styled(Space).attrs({
  v: { size: 'xl', properties: ['padding-bottom'] },
})`
  &:last-child {
    padding-bottom: 0;
  }
`;

const StoryWrapper = styled.a`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  text-decoration: none;

  ${props => props.theme.media('medium')`
    flex-wrap: nowrap;
  `}
`;

const ImageWrapper = styled.div`
  position: relative;
  flex: 1 1 100%;
  margin-bottom: ${props => props.theme.spacingUnit * 2}px;

  max-height: 250px;
  max-width: 100%;
  width: auto;
  height: auto;

  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  ${props => props.theme.media('medium')`
    flex: 1 0 40%;
    margin-right: 1rem;
    max-height: 155px;
    max-width: 275px;
    width: 100%;
  `}
`;

const Details = styled.div`
  flex: 1 1 100%;

  ${props => props.theme.media('medium')`
    max-width: 820px;
  `}
`;

const DesktopLabel = styled(Space).attrs({
  v: { size: 's', properties: ['margin-bottom'] },
})`
  ${props => props.theme.media('medium', 'max-width')`
    display:none;
  `}
`;

const MobileLabel = styled(Space)`
  position: absolute;
  bottom: 0;
  left: 0;

  ${props => props.theme.media('medium')`
    display: none;
  `}
`;

const StoryInformation = styled(Space).attrs({
  className: font('intr', 5),
  v: { size: 'xs', properties: ['margin-bottom'] },
})`
  color: ${props => props.theme.color('neutral.600')};
`;

const StoryInformationItem = styled.span`
  &:not(:first-child)::before {
    content: ' | ';
    margin: 0 4px;
  }

  span {
    &:not(:first-child)::before {
      content: ', ';
    }
  }
`;

export const SearchPage: NextPageWithLayout<Props> = ({
  storyResponseList,
  totalPages,
  query,
}) => {
  return (
    <Wrapper>
      <h1 className="visually-hidden">Stories Search Page</h1>
      <div className="container">
        <Space v={{ size: 'l', properties: ['padding-top', 'padding-bottom'] }}>
          <div>Sort Component?</div>
        </Space>
      </div>
      {storyResponseList.totalResults > 0 && (
        <div className="container" role="main">
          {/* TODO make pagination work... */}
          <PaginationWrapper>
            {storyResponseList.totalResults > 0 && (
              <div>{storyResponseList.totalResults} results</div>
            )}
            <SearchPagination totalPages={totalPages} />
          </PaginationWrapper>

          <main>
            {storyResponseList.results.map(story => {
              return (
                <Container key={story.id}>
                  {/* TODO add link once we have it */}
                  <StoryWrapper href="#">
                    <ImageWrapper>
                      <img src={story.image.url} alt="" />

                      {story.type && (
                        <MobileLabel>
                          {/* TODO add labels once we have them */}
                          <LabelsList labels={[{ text: 'Article' }]} />
                        </MobileLabel>
                      )}
                    </ImageWrapper>
                    <Details>
                      {story.type && (
                        <DesktopLabel>
                          {/* TODO add labels once we have them */}
                          <LabelsList labels={[{ text: 'Article' }]} />
                        </DesktopLabel>
                      )}
                      <h3 className={font('wb', 4)}>{story.title}</h3>
                      {/* TODO update when we get new contributors array and new publication date */}
                      {(story.firstPublicationDate ||
                        !!story.contributors.length) && (
                        <StoryInformation>
                          {story.firstPublicationDate && (
                            <StoryInformationItem>
                              <HTMLDate
                                date={new Date(story.firstPublicationDate)}
                              />
                            </StoryInformationItem>
                          )}
                          {!!story.contributors.length && (
                            <StoryInformationItem>
                              {/* TODO update when we type contributors to match Prismic structure */}
                              {/* {story.contributors.map(contributor => {
                                return (
                                  <span key={contributor.contributor.name}>
                                    {contributor.contributor.name}
                                  </span>
                                );
                              })} */}
                              <span>Jane Smith, John Smith</span>
                            </StoryInformationItem>
                          )}
                        </StoryInformation>
                      )}
                      {/* TODO replace with promo? */}
                      {story.summary && (
                        <p className={font('intr', 5)}>{story.summary}</p>
                      )}
                    </Details>
                  </StoryWrapper>
                </Container>
              );
            })}
          </main>

          <Space
            v={{
              size: 'l',
              properties: ['padding-top', 'padding-bottom'],
            }}
          >
            {/* TODO make pagination work... */}
            <BottomPaginationWrapper>
              <SearchPagination totalPages={totalPages} />
            </BottomPaginationWrapper>
          </Space>
        </div>
      )}
      {storyResponseList.totalResults === 0 && (
        <SearchNoResults query={query} hasFilters={false} />
      )}
    </Wrapper>
  );
};

SearchPage.getLayout = getSearchLayout;

export const getServerSideProps: GetServerSideProps<
  Record<string, unknown> | AppErrorProps
> = async context => {
  const serverData = await getServerData(context);
  const { query } = context.query;

  if (!serverData.toggles.searchPage) {
    return { notFound: true };
  }

  // TODO cleanup all below when we determine what should be optional in Mel's branch (feat/prismic-transform-updates)
  if (!query)
    return {
      props: removeUndefinedProps({
        serverData,
        storyResponseList: { totalResults: 0 },
        query,
        pageview: {
          name: 'stories',
          properties: {},
        },
      }),
    };

  const pageSize = 6;

  const storyResponseList: PrismicResultsList<Story> | PrismicApiError =
    await getStories({
      query: query as string,
      pageSize,
    });

  if (storyResponseList?.type === 'ResultList') {
    return {
      props: removeUndefinedProps({
        serverData,
        storyResponseList,
        query,
        totalPages: Math.ceil(storyResponseList.results.length / pageSize),
        pageview: {
          name: 'stories',
          properties: { totalResults: storyResponseList.totalResults },
        },
      }),
    };
  }

  return {
    props: removeUndefinedProps({
      serverData,
      storyResponseList: { totalResults: 0 },
      query,
      pageview: {
        name: 'stories',
        properties: {},
      },
    }),
  };
};

export default SearchPage;
