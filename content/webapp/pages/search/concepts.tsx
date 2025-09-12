import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { appError } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { emptyResultList } from '@weco/content/services/wellcome';
import { getConcepts } from '@weco/content/services/wellcome/catalogue/concepts';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';
import { looksLikeSpam } from '@weco/content/utils/spam-detector';
import { fromQuery } from '@weco/content/views/components/SearchPagesLink/Concepts';
import ConceptsSearchPage, {
  Props as ConceptsSearchPageProps,
} from '@weco/content/views/pages/search/concepts';

const Page: NextPage<ConceptsSearchPageProps> = props => {
  return <ConceptsSearchPage {...props} />;
};

type Props = ServerSideProps<ConceptsSearchPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res, cacheTTL.search);
  const serverData = await getServerData(context);
  
  // Redirect to main search page if concepts search toggle is disabled
  if (!serverData.toggles.conceptsSearch?.value) {
    return {
      redirect: {
        destination: '/search',
        permanent: false,
      },
    };
  }
  
  const query = context.query;
  const params = fromQuery(query);

  const defaultProps = serialiseProps({
    serverData,
    conceptsRouteProps: params,
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
        concepts: emptyResultList(),
        pageview: {
          name: 'concepts',
          properties: {
            looksLikeSpam: 'true',
          },
        },
        apiToolbarLinks: [],
      }),
    };
  }

  const concepts = await getConcepts({
    params,
    pageSize: 25,
    toggles: serverData.toggles,
  });

  if (concepts.type === 'Error') {
    return appError(
      context,
      concepts.httpStatus,
      concepts.description || concepts.label
    );
  }

  return {
    props: serialiseProps<Props>({
      ...defaultProps,
      concepts,
      pageview: {
        name: 'concepts',
        properties: { totalResults: concepts.totalResults },
      },
      apiToolbarLinks: [
        {
          id: 'catalogue-api',
          label: 'Catalogue API query',
          link: concepts._requestUrl,
        },
      ],
    }),
  };
};

export default Page;