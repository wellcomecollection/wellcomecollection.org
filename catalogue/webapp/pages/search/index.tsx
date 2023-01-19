import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
import styled from 'styled-components';
import { ParsedUrlQuery } from 'querystring';

import Space from '@weco/common/views/components/styled/Space';
import SearchNoResults from '@weco/catalogue/components/SearchNoResults/SearchNoResults';
import StoriesGrid from '@weco/catalogue/components/StoriesGrid/StoriesGrid';
import ImageEndpointSearchResults from '@weco/catalogue/components/ImageEndpointSearchResults/ImageEndpointSearchResults';
import WorksSearchResults from '@weco/catalogue/components/WorksSearchResults/WorksSearchResults';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import { arrowSmall } from '@weco/common/icons';

import { getSearchLayout } from '@weco/catalogue/components/SearchPageLayout/SearchPageLayout';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { getServerData } from '@weco/common/server-data';
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import { Pageview } from '@weco/common/services/conversion/track';
import { getStories } from '@weco/catalogue/services/prismic/fetch/articles';
import { Story } from '@weco/catalogue/services/prismic/types/story';
import { font } from '@weco/common/utils/classnames';
import { getWorks } from '@weco/catalogue/services/catalogue/works';
import { Query } from '@weco/catalogue/types/search';
import { getImages } from '@weco/catalogue/services/catalogue/images';
import { Image, Work } from '@weco/common/model/catalogue';
import { getQueryResults } from '@weco/catalogue/utils/search';
import {
  decodeQuery,
  FromCodecMap,
  stringCodec,
} from '@weco/common/utils/routes';

// Creating this version of fromQuery for the overview page only
// No filters or pagination required.
const codecMap = { query: stringCodec };
type CodecMapProps = FromCodecMap<typeof codecMap>;
const fromQuery: (params: ParsedUrlQuery) => CodecMapProps = params => {
  return decodeQuery<CodecMapProps>(params, codecMap);
};

type Props = {
  works?: Work[];
  images?: Image[];
  stories?: Story[];
  query: Query;
  pageview: Pageview;
};

const StoriesSection = styled(Space).attrs({
  v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('neutral.200')};
`;

const ImagesSection = styled(Space).attrs({
  v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('black')};
  color: ${props => props.theme.color('white')};
`;

const WorksSection = styled(Space).attrs({
  v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
})``;

const SectionTitle = ({ sectionName }: { sectionName: string }) => {
  return (
    <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
      <h3 className={font('intb', 2)}>{sectionName}</h3>
    </Space>
  );
};

export const SearchPage: NextPageWithLayout<Props> = ({
  works,
  images,
  stories,
  query,
}) => {
  const { query: queryString } = query;

  // If there is no query, return an empty page
  if (!queryString) {
    return (
      <Space
        v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
      ></Space>
    );
  }

  const SeeMoreButton = ({
    text,
    pathname,
  }: {
    text: string;
    pathname: string;
  }) => (
    <ButtonSolidLink
      text={text}
      link={{
        href: {
          pathname,
          query: { query: queryString },
        },
        as: {
          pathname,
          query: { query: queryString },
        },
      }}
      icon={arrowSmall}
      isIconAfter={true}
      colors={{
        border: 'yellow',
        background: 'yellow',
        text: 'black',
      }}
      hoverUnderline={true}
    />
  );

  return (
    <main>
      <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
        {!stories && !images && !works ? (
          <div className="container">
            <SearchNoResults query={queryString} hasFilters={false} />
          </div>
        ) : (
          <>
            {stories && (
              <StoriesSection as="section">
                <div className="container">
                  <SectionTitle sectionName="Stories" />

                  <StoriesGrid
                    stories={stories}
                    dynamicImageSizes={{
                      xlarge: 1 / 5,
                      large: 1 / 5,
                      medium: 1 / 2,
                      small: 1 / 2,
                    }}
                  />

                  <Space v={{ size: 'l', properties: ['padding-top'] }}>
                    <SeeMoreButton
                      text="All stories"
                      pathname="/search/stories"
                    />
                  </Space>
                </div>
              </StoriesSection>
            )}

            {images && (
              <ImagesSection>
                <div className="container">
                  <SectionTitle sectionName="Images" />

                  <ImageEndpointSearchResults images={images} />

                  <Space v={{ size: 'l', properties: ['padding-top'] }}>
                    <SeeMoreButton
                      text="All images"
                      pathname="/search/images"
                    />
                  </Space>
                </div>
              </ImagesSection>
            )}

            {works && (
              <WorksSection>
                <div className="container">
                  <SectionTitle sectionName="Catalogue" />

                  <WorksSearchResults works={works} />

                  <Space v={{ size: 'l', properties: ['padding-top'] }}>
                    <SeeMoreButton text="Catalogue" pathname="/search/works" />
                  </Space>
                </div>
              </WorksSection>
            )}
          </>
        )}
      </Space>
    </main>
  );
};

SearchPage.getLayout = getSearchLayout;

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);

    if (!serverData.toggles.searchPage) {
      return { notFound: true };
    }

    const query = context.query;
    const params = fromQuery(query);

    const defaultProps = removeUndefinedProps({
      serverData,
      query,

      pageview: {
        name: 'search',
        properties: {},
      },
    });

    // Stop here if no query has been entered
    if (!params.query) {
      return {
        props: defaultProps,
      };
    }

    try {
      // Stories
      const storiesResults = await getStories({
        query,
        pageSize: 4,
      });
      const stories = getQueryResults('stories', storiesResults);

      // Works
      const _worksQueryType = getCookie('_queryType') as string | undefined;
      const worksResults = await getWorks({
        params: {
          ...params,
          _queryType: _worksQueryType,
        },
        pageSize: 5,
        toggles: serverData.toggles,
      });
      const works = getQueryResults('works', worksResults);

      // Images
      const imagesResults = await getImages({
        params,
        toggles: serverData.toggles,
        pageSize: 10,
      });
      const images = getQueryResults('images', imagesResults);

      // If all three queries fail, return an error page
      if (
        imagesResults.type === 'Error' &&
        worksResults.type === 'Error' &&
        storiesResults.type === 'Error'
      ) {
        return appError(context, 500, 'Search results error');
      }

      return {
        props: {
          ...defaultProps,
          ...(stories?.length && { stories }),
          ...(images?.length && { images }),
          ...(works?.length && { works }),
        },
      };
    } catch (error) {
      return appError(context, error.httpStatus, 'Search results error');
    }
  };

export default SearchPage;
