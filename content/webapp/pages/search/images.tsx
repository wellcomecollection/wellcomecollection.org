import { getServerData } from '@weco/common/server-data';
import { appError } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import {
  NextPageWithLayout,
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { emptyResultList } from '@weco/content/services/wellcome';
import { getImages } from '@weco/content/services/wellcome/catalogue/images';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import { looksLikeSpam } from '@weco/content/utils/spam-detector';
import { fromQuery } from '@weco/content/views/components/SearchPagesLink/Images';
import ImagesSearchPage, {
  Props as ImagesSearchPageProps,
} from '@weco/content/views/pages/search/images';

const Page: NextPageWithLayout<ImagesSearchPageProps> = props => {
  return <ImagesSearchPage {...props} />;
};

type Props = ServerSideProps<ImagesSearchPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);
  const query = context.query;
  const params = fromQuery(query);

  const defaultProps = serialiseProps({
    imagesRouteProps: params,
    serverData,
    query,
  });

  // If the request looks like spam, return a 400 error and skip actually fetching
  // the data from the APIs.
  //
  // Users will still see a meaningful error page with instructions about tweaking
  // their query/telling us if they expected results, but they won't be causing load
  // on our back-end APIs.
  //
  // The status code will also allow us to filter out spam-like requests from our analytics.
  if (looksLikeSpam(query.query)) {
    context.res.statusCode = 400;
    return {
      props: serialiseProps<Props>({
        ...defaultProps,
        pageview: {
          name: 'images',
          properties: {
            looksLikeSpam: 'true',
          },
        },
        images: emptyResultList(),
        apiToolbarLinks: [],
      }),
    };
  }

  /**
   * This is here due to the noscript colour element
   * the value provided by the native element will
   * include the "#" symbol.
   */
  if (params.color) {
    params.color = params.color.replace('#', '');
  }

  const aggregations = [
    'locations.license',
    'source.genres.label',
    'source.subjects.label',
    'source.contributors.agent.label',
  ];
  const apiProps = {
    ...params,
    aggregations,
  };
  const images = await getImages({
    params: apiProps,
    toggles: serverData.toggles,
    pageSize: 30,
  });

  if (images.type === 'Error') {
    return appError(
      context,
      images.httpStatus,
      images.description || images.label || 'Images API error'
    );
  }

  return {
    props: serialiseProps<Props>({
      ...defaultProps,
      images,
      pageview: {
        name: 'images',
        properties: { totalResults: images.totalResults },
      },
      apiToolbarLinks: [
        {
          id: 'catalogue-api',
          label: 'Catalogue API query',
          link: images._requestUrl,
        },
      ],
    }),
  };
};

export default Page;
