import { FunctionComponent } from 'react';

import {
  exhibitionGuideLinkText,
  visualStoryLinkText,
} from '@weco/common/data/microcopy';
import { getServerData } from '@weco/common/server-data';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchExhibition } from '@weco/content/services/prismic/fetch/exhibitions';
import { transformExhibition } from '@weco/content/services/prismic/transformers/exhibitions';
import { exhibitionLd } from '@weco/content/services/prismic/transformers/json-ld';
import { transformPage } from '@weco/content/services/prismic/transformers/pages';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';
import ExhibitionPage, {
  Props as ExhibitionPageProps,
} from '@weco/content/views/exhibitions/exhibition';

/**
 * Please note that the /exhibitions/{period} routes do not arrive here
 * but instead are rewritten to the index file. Please observe
 * this setup in the next.config file for this app
 */
const Page: FunctionComponent<ExhibitionPageProps> = props => {
  return <ExhibitionPage {...props} />;
};

type Props = ServerSideProps<ExhibitionPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res, cacheTTL.events);
  const { exhibitionId } = context.query;

  if (!looksLikePrismicId(exhibitionId)) {
    return { notFound: true };
  }

  const client = createClient(context);
  const exhibitionDocument = await fetchExhibition(client, exhibitionId);

  if (isNotUndefined(exhibitionDocument?.exhibition)) {
    const {
      exhibition,
      pages,
      visualStories,
      allGuides,
      exhibitionTexts,
      exhibitionHighlightTours,
    } = exhibitionDocument;

    const serverData = await getServerData(context);
    const exhibitionDoc = transformExhibition(exhibition);
    const relatedPages = transformQuery(pages, transformPage);

    const visualStoriesLinks = visualStories.results.map(visualStory => {
      const url = linkResolver(visualStory);
      return {
        text: visualStoryLinkText,
        url,
        type: 'visual-story',
      };
    });

    const exhibitionGuidesLinks = allGuides.map(exhibitionGuide => {
      const url = linkResolver(exhibitionGuide);
      return {
        text: exhibitionGuideLinkText,
        url,
        type: 'exhibition-guide',
      };
    });

    const jsonLd = exhibitionLd(exhibitionDoc);

    return {
      props: serialiseProps<Props>({
        exhibition: exhibitionDoc,
        pages: relatedPages?.results || [],
        accessResourceLinks: [...exhibitionGuidesLinks, ...visualStoriesLinks],
        exhibitionTexts,
        exhibitionHighlightTours,
        jsonLd,
        serverData,
        pageview: {
          name: 'exhibition',
          properties: {},
        },
      }),
    };
  }

  return { notFound: true };
};

export default Page;
