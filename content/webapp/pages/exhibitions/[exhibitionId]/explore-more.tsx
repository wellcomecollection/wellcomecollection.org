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
import { fetchExhibition } from '@weco/content/services/prismic/fetch/exhibitions';
import { fetchExploreMore } from '@weco/content/services/prismic/fetch/explore-more';
import { transformExhibition } from '@weco/content/services/prismic/transformers/exhibitions';
import { transformExploreMore } from '@weco/content/services/prismic/transformers/explore-more';
import { exhibitionLd } from '@weco/content/services/prismic/transformers/json-ld';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';
import ExploreMorePage, {
  Props as ExploreMorePageProps,
} from '@weco/content/views/pages/exhibitions/explore-more';

const Page: NextPage<ExploreMorePageProps> = props => {
  return <ExploreMorePage {...props} />;
};

type Props = ServerSideProps<ExploreMorePageProps>;

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

  if (!isNotUndefined(exhibitionDocument?.exhibition)) {
    return { notFound: true };
  }

  const { exhibition } = exhibitionDocument;
  const exploreMore = await fetchExploreMore(client, exhibition.id);

  if (!exploreMore) {
    return { notFound: true };
  }

  const serverData = await getServerData(context);
  const exhibitionDoc = transformExhibition(exhibition);
  const exploreMoreDoc = transformExploreMore(exploreMore);
  const jsonLd = exhibitionLd(exhibitionDoc);

  return {
    props: serialiseProps<Props>({
      exhibition: exhibitionDoc,
      exploreMore: exploreMoreDoc,
      jsonLd,
      serverData,
    }),
  };
};

export default Page;
