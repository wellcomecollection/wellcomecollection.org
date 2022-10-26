import {
  prismicApiError,
  prismicFetch,
  notFound,
  PrismicQueryProps,
  prismicQuery,
  prismicRefFetch,
} from '../catalogue';

import { Toggles } from '@weco/toggles';
import {
  Story,
  PrismicApiError,
  StoryResultsList,
} from '@weco/common/model/story';

type GetArticleProps = {
  id?: string;
};

type PrismicResponse = Story | PrismicApiError;

// TODO: clear up terminology - is this an article or a story?
export async function getArticle({
  id,
}: GetArticleProps): Promise<PrismicResponse> {
  const headers = {
    Authorization: `Bearer ${process.env.PRISMIC_TOKEN}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const prismicRef = await prismicRefFetch(
    'https://wellcomecollection.prismic.io/api/v2',
    headers
  );
  const { refs } = await prismicRef.json();
  const { ref } = refs[0];
  headers['Prismic-ref'] = ref;

  const graphQuery = `query {
  allArticless(id: "${id}") {
    edges {
      node {
        title
        contributors {
          contributor {
            ...on People {
              name
            }
          }
        }
        body {
          ...on ArticlesBodyStandfirst {
            primary {
              text
            }
          }
        }
        promo {
          ...on ArticlesPromoEditorialimage {
            primary {
              image
              link
              caption
            }
          }
        }
      }
    }
  }
}`;

  const url = `https://wellcomecollection.prismic.io/graphql?query=${graphQuery}`;

  const options = {
    method: 'GET',
    headers: headers,
    data: {
      query: { graphQuery },
    },
    url: url,
  };

  const res = await prismicFetch(options);

  if (res.status === 404) {
    return notFound();
  }

  try {
    return await res.data;
    // return await res.json();
  } catch (e) {
    return prismicApiError();
  }
}

export async function getArticles(
  props: PrismicQueryProps
): Promise<StoryResultsList<Story> | PrismicApiError> {
  return prismicQuery('stories', props);
}
