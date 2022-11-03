import { GetServerSideProps } from 'next';
import styled from 'styled-components';

import Space from '@weco/common/views/components/styled/Space';
import { getSearchLayout } from '@weco/catalogue/components/SearchPageLayout/SearchPageLayout';
import SearchPagination from '@weco/common/views/components/SearchPagination/SearchPagination';
import SearchNoResults from '@weco/catalogue/components/SearchNoResults/SearchNoResults';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';

import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import { getStories } from '@weco/catalogue/services/prismic';
import { font } from '@weco/common/utils/classnames';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { AppErrorProps } from '@weco/common/services/app';
import { getServerData } from '@weco/common/server-data';

type Props = {
  query: string;
  storyResponseList;
  totalPages: number;
};

const Wrapper = styled.div`
  background-color: ${props => props.theme.color('neutral.200')};
`;

const ResultsPaginationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Container = styled(Space).attrs({
  v: { size: 'xl', properties: ['padding-bottom'] },
})``;

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
  query,
  storyResponseList,
  totalPages,
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
          <Space
            v={{
              size: 'l',
              properties: ['padding-top', 'padding-bottom'],
            }}
          >
            {/* TODO make pagination work... */}
            <ResultsPaginationWrapper>
              {storyResponseList.totalResults > 0 && (
                <div>{storyResponseList.totalResults} results</div>
              )}
              <SearchPagination totalPages={totalPages} />
            </ResultsPaginationWrapper>
          </Space>
          <Space v={{ size: 'l', properties: ['padding-top'] }}>
            {storyResponseList.results.map(story => {
              console.log({ story });
              return (
                <Container key={story.id}>
                  <StoryWrapper href={story.url || '#'}>
                    {/* TODO add link */}
                    <ImageWrapper>
                      <img src={story.image.image.url} alt="" />

                      {story.type && (
                        <MobileLabel>
                          <LabelsList labels={[{ text: story.type }]} />
                        </MobileLabel>
                      )}
                    </ImageWrapper>
                    <Details>
                      {story.type && (
                        <DesktopLabel>
                          <LabelsList labels={[{ text: story.type }]} />
                        </DesktopLabel>
                      )}
                      <h3 className={font('wb', 4)}>{story.title[0].text}</h3>
                      {/* TODO update when we get new contributors array and new publication date */}
                      {(story.lastPublicationDate ||
                        !!story.contributors.length) && (
                        <StoryInformation>
                          {story.lastPublicationDate && (
                            <StoryInformationItem>
                              <HTMLDate
                                date={new Date(story.lastPublicationDate)}
                              />
                            </StoryInformationItem>
                          )}
                          {!!story.contributors.length && (
                            <StoryInformationItem>
                              {story.contributors.map(contributor => {
                                return (
                                  <span key={contributor.contributor.name}>
                                    {contributor.contributor.name}
                                  </span>
                                );
                              })}
                            </StoryInformationItem>
                          )}
                        </StoryInformation>
                      )}
                      {/* TODO replace with promo */}
                      {story.standfirst?.text[0].text && (
                        <p className={font('intr', 5)}>
                          {story.standfirst?.text[0].text}
                        </p>
                      )}
                    </Details>
                  </StoryWrapper>
                </Container>
              );
            })}
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
  let storyResponseList = {};

  if (!serverData.toggles.searchPage) {
    return { notFound: true };
  }

  if (!query)
    return {
      props: removeUndefinedProps({
        serverData,
        query,
      }),
    };

  const pageSize = 6;

  storyResponseList = await getStories({
    query,
    pageSize,
  });

  const totalPages = Math.ceil(storyResponseList.results.length / pageSize);

  return {
    props: removeUndefinedProps({
      serverData,
      storyResponseList,
      query,
      totalPages,
    }),
  };
};

export default SearchPage;
