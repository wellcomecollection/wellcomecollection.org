import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';

import { removeUndefinedProps } from '@weco/common/utils/json';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { getServerData } from '@weco/common/server-data';
import Space from '@weco/common/views/components/styled/Space';
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import { getSearchLayout } from '@weco/catalogue/components/SearchPageLayout/SearchPageLayout';
import { Pageview } from '@weco/common/services/conversion/track';
// TODO do we have these functions in all different types?
import { fromQuery } from '@weco/common/views/components/WorksLink/WorksLink';
import { getStories } from '@weco/catalogue/services/prismic/fetch/articles';
import {
  PrismicApiError,
  PrismicResultsList,
} from '@weco/catalogue/services/prismic/types';
import { Story } from '@weco/catalogue/services/prismic/types/story';
import { getWorks } from '@weco/catalogue/services/catalogue/works';
import { getImages } from 'services/catalogue/images';
import {
  CatalogueResultsList,
  Image,
  Work,
} from '@weco/common/model/catalogue';

type Props = {
  works?: CatalogueResultsList<Work>;
  images?: CatalogueResultsList<Image>;
  stories?: Story[];
  pageview: Pageview;
};

export const SearchPage: NextPageWithLayout<Props> = ({
  works,
  images,
  stories,
}) => {
  console.log({
    works,
    images,
    stories,
  });
  return (
    <div className="container">
      <Space v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}>
        <pre
          style={{
            maxWidth: '600px',
            margin: '0 auto 24px',
            fontSize: '14px',
          }}
        >
          <details>
            <summary>WORKS</summary>
            {/* eslint-disable-next-line no-restricted-syntax */}
            {JSON.stringify(works, null, 1)}
          </details>

          <details>
            <summary>IMAGES</summary>
            {/* eslint-disable-next-line no-restricted-syntax */}
            {JSON.stringify(images, null, 1)}
          </details>

          <details>
            <summary>STORIES</summary>
            {/* eslint-disable-next-line no-restricted-syntax */}
            {JSON.stringify(stories, null, 1)}
          </details>
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

    // Stories
    const stories: PrismicResultsList<Story> | PrismicApiError =
      await getStories({
        query,
        pageSize: 3,
      });

    // Works

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

    const works = await getWorks({
      params: worksApiProps,
      pageSize: 3,
      toggles: serverData.toggles,
    });

    if (works.type === 'Error') {
      return appError(
        context,
        works.httpStatus,
        works.description || works.label
      );
    }

    // Images
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
    const images = await getImages({
      params: apiProps,
      toggles: serverData.toggles,
      pageSize: 3,
    });

    if (images && images.type === 'Error') {
      return appError(context, images.httpStatus, 'Images API error');
    }

    return {
      props: { ...defaultProps, works, stories, images },
    };
  };

export default SearchPage;
