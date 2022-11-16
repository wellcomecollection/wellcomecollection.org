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
import Sort from '@weco/catalogue/components/Sort/Sort';

type Props = {
  storyResponseList: PrismicResultsList<Story>;
  queryString: string;
  pageview: Pageview;
};

const Wrapper = styled.div`
  background-color: ${props => props.theme.color('neutral.200')};
`;

const PaginationWrapper = styled(Space).attrs({
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
  className: font('intb', 5),
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const TotalResultsCopy = styled.span`
  ${props =>
    props.theme.media('medium', 'max-width')`
    flex: 1 1 50%;
  `}
`;

const SortPaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  ${props => props.theme.media('medium', 'max-width')`
    flex: 1 1 50%;
    justify-content: flex-end;
  `}
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

const sortOptions = [
  { value: '', text: 'A -> Z' },
  { value: 'title_DESC', text: 'Z -> A' },
  { value: 'meta_firstPublicationDate_DESC', text: 'Last published' },
  { value: 'meta_firstPublicationDate_ASC', text: 'First published' },
];

export const SearchPage: NextPageWithLayout<Props> = ({
  storyResponseList,
  queryString,
}) => {
  return (
    <Wrapper>
      <h1 className="visually-hidden">Stories Search Page</h1>

      {storyResponseList.totalResults === 0 && (
        <SearchNoResults query={queryString} hasFilters={false} />
      )}

      {storyResponseList.totalResults > 0 && (
        <div className="container">
          {/* TODO make pagination - cursor based pagination with graphql query */}
          <PaginationWrapper>
            {storyResponseList.totalResults > 0 && (
              <TotalResultsCopy>{`${storyResponseList.totalResults} result${
                storyResponseList.totalResults > 1 ? 's' : ''
              }`}</TotalResultsCopy>
            )}

            <SortPaginationWrapper>
              <Sort
                form="searchPageForm"
                options={sortOptions}
                jsLessOptions={{
                  sortOrder: sortOptions,
                }}
              />
              <SearchPagination
                totalPages={storyResponseList.totalPages}
                isHiddenMobile
              />
            </SortPaginationWrapper>
          </PaginationWrapper>

          <main>
            {storyResponseList.results.map(story => {
              return (
                <Container key={story.id}>
                  <StoryWrapper href={story.url}>
                    <ImageWrapper>
                      <img src={story.image.url} alt="" />

                      {story.type && (
                        <MobileLabel>
                          <LabelsList labels={[story.label]} />
                        </MobileLabel>
                      )}
                    </ImageWrapper>
                    <Details>
                      {story.label && (
                        <DesktopLabel>
                          <LabelsList labels={[story.label]} />
                        </DesktopLabel>
                      )}
                      <h3 className={font('wb', 4)}>{story.title}</h3>
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
                              {story.contributors.map(contributor => (
                                <span key={contributor}>{contributor}</span>
                              ))}
                            </StoryInformationItem>
                          )}
                        </StoryInformation>
                      )}
                      {story.summary && (
                        <p className={font('intr', 5)}>{story.summary}</p>
                      )}
                    </Details>
                  </StoryWrapper>
                </Container>
              );
            })}
          </main>

          {/* TODO make pagination work... */}
          <BottomPaginationWrapper>
            <SearchPagination totalPages={storyResponseList.totalPages} />
          </BottomPaginationWrapper>
        </div>
      )}
    </Wrapper>
  );
};

SearchPage.getLayout = getSearchLayout;

export const getServerSideProps: GetServerSideProps<
  Record<string, unknown> | AppErrorProps
> = async context => {
  const serverData = await getServerData(context);
  const fullQuery = context.query;

  if (!serverData.toggles.searchPage) {
    return { notFound: true };
  }

  const defaultProps = removeUndefinedProps({
    serverData,
    storyResponseList: { totalResults: 0 },
    queryString: fullQuery.query,
    pageview: {
      name: 'stories',
      properties: {},
    },
  });

  // Stop here if no query has been entered
  if (!fullQuery.query)
    return {
      props: defaultProps,
    };

  // Fetch stories
  const pageSize = 6;
  const storyResponseList: PrismicResultsList<Story> | PrismicApiError =
    await getStories({
      query: fullQuery,
      pageSize,
    });

  return {
    props: removeUndefinedProps({
      ...defaultProps,
      storyResponseList,
      pageview: {
        name: 'stories',
        properties: {
          totalResults:
            storyResponseList?.type === 'ResultList'
              ? storyResponseList.totalResults
              : 0,
        },
      },
    }),
  };
};

export default SearchPage;
