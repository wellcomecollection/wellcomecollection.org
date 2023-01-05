import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
import { ParsedUrlQuery } from 'querystring';

import { removeUndefinedProps } from '@weco/common/utils/json';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { getServerData } from '@weco/common/server-data';
import Space from '@weco/common/views/components/styled/Space';
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import { getSearchLayout } from '@weco/catalogue/components/SearchPageLayout/SearchPageLayout';
import { Pageview } from '@weco/common/services/conversion/track';
import { getStories } from '@weco/catalogue/services/prismic/fetch/articles';
import { Story } from '@weco/catalogue/services/prismic/types/story';
import { getWorks } from '@weco/catalogue/services/catalogue/works';
import { getImages } from 'services/catalogue/images';
import { Image, Work } from '@weco/common/model/catalogue';
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
  works: Work[] | undefined;
  images: Image[] | undefined;
  stories: Story[] | undefined;
  pageview: Pageview;
};

export const SearchPage: NextPageWithLayout<Props> = ({
  works,
  images,
  stories,
}) => {
  return (
    <div className="container">
      <Space v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}>
        <pre
          style={{
            fontSize: '14px',
            overflow: 'hidden',
          }}
        >
          {!!works?.length && (
            <details>
              <summary>WORKS</summary>
              {JSON.stringify(works, null, 1)}
            </details>
          )}

          {!!images?.length && (
            <details>
              <summary>IMAGES</summary>
              {JSON.stringify(images, null, 1)}
            </details>
          )}

          {!!stories?.length && (
            <details>
              <summary>STORIES</summary>
              {JSON.stringify(stories, null, 1)}
            </details>
          )}
        </pre>
      </Space>
    </div>
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
      works: undefined,
      images: undefined,
      stories: undefined,
      // TODO Harrison to explore what properties we'd want here
      pageview: {
        name: 'stories',
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
      /*
       * Stories
       */
      const storiesFetch = await getStories({
        query,
        pageSize: 3,
      });

      const stories =
        storiesFetch && storiesFetch.type !== 'Error'
          ? storiesFetch.results
          : undefined;

      // An error shouldn't stop the other results from displaying
      if (storiesFetch.type === 'Error') {
        console.error('Error fetching stories:', storiesFetch.label);
      }

      /*
       * Works
       */
      const worksAggregations = [
        'workType',
        'availabilities',
        'genres.label',
        'languages',
        'subjects.label',
        'contributors.agent.label',
      ];
      const _worksQueryType = getCookie('_queryType') as string | undefined;
      const worksApiProps = {
        ...params,
        _queryType: _worksQueryType,
        aggregations: worksAggregations,
      };
      const worksFetch = await getWorks({
        params: worksApiProps,
        pageSize: 3,
        toggles: serverData.toggles,
      });

      const works =
        worksFetch && worksFetch.type !== 'Error'
          ? worksFetch.results
          : undefined;

      // An error shouldn't stop the other results from displaying
      if (worksFetch.type === 'Error') {
        console.error('Error fetching works:', worksFetch.label);
      }

      /*
       * Images
       */
      const imagesAggregations = [
        'locations.license',
        'source.genres.label',
        'source.subjects.label',
        'source.contributors.agent.label',
      ];
      const apiProps = {
        ...params,
        aggregations: imagesAggregations,
      };

      const imagesFetch = await getImages({
        params: apiProps,
        toggles: serverData.toggles,
        pageSize: 3,
      });

      const images =
        imagesFetch && imagesFetch.type !== 'Error'
          ? imagesFetch.results
          : undefined;

      // An error shouldn't stop the other results from displaying
      if (imagesFetch.type === 'Error') {
        console.error('Error fetching images:', imagesFetch.label);
      }

      /*
       * Return results or undefined for each category
       */
      return {
        props: { ...defaultProps, works, stories, images },
      };
    } catch (error) {
      return appError(context, error.httpStatus, 'Search results fetch error');
    }
  };

export default SearchPage;
