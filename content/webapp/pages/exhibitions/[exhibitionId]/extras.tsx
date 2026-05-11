import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchArticle } from '@weco/content/services/prismic/fetch/articles';
import { fetchExhibition } from '@weco/content/services/prismic/fetch/exhibitions';
import { transformArticle } from '@weco/content/services/prismic/transformers/articles';
import { toWorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import { getWork } from '@weco/content/services/wellcome/catalogue/works';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';
import ExhibitionExtrasPage, {
  Props as ExhibitionExtrasPageProps,
} from '@weco/content/views/pages/exhibitions/exhibition/extras';

/**
 * Please note that the /exhibitions/{period} routes do not arrive here
 * but instead are rewritten to the index file. Please observe
 * this setup in the next.config file for this app
 */
const Page: NextPage<ExhibitionExtrasPageProps> = props => {
  return <ExhibitionExtrasPage {...props} />;
};

type Props = ServerSideProps<ExhibitionExtrasPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res, cacheTTL.events);
  const { exhibitionId } = context.query;
  const serverData = await getServerData(context);
  if (
    !looksLikePrismicId(exhibitionId) ||
    !serverData.toggles.inGallery.value
  ) {
    return { notFound: true };
  }

  const client = createClient(context);
  const exhibitionDocument = await fetchExhibition(client, exhibitionId);

  if (!exhibitionDocument) {
    return { notFound: true };
  }

  // Get exhibition data from serverData context
  const exhibitionData = serverData.exhibitionExtras[exhibitionId];

  // Fetch works from catalogue API
  const worksPromises =
    exhibitionData?.works?.map(async workId => {
      const work = await getWork({
        id: workId,
        toggles: serverData.toggles,
      });
      return work.type === 'Error' || work.type === 'Redirect'
        ? undefined
        : toWorkBasic(work);
    }) || [];
  const worksResults = await Promise.all(worksPromises);
  const works = worksResults.filter(isNotUndefined);

  // Fetch stories from Prismic
  const storiesPromises =
    exhibitionData?.stories?.map(async storyId => {
      const storyDocument = await fetchArticle(client, storyId);
      return storyDocument ? transformArticle(storyDocument) : undefined;
    }) || [];
  const storiesResults = await Promise.all(storiesPromises);
  const stories = storiesResults.filter(isNotUndefined);

  return {
    props: serialiseProps<Props>({
      stories,
      works,
      exhibitionData: exhibitionData || null,
      serverData,
    }),
  };
};

export default Page;
