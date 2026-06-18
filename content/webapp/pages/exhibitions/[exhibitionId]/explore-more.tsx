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
import { fetchPage } from '@weco/content/services/prismic/fetch/pages';
import { transformExhibition } from '@weco/content/services/prismic/transformers/exhibitions';
import { exhibitionLd } from '@weco/content/services/prismic/transformers/json-ld';
import { transformPage } from '@weco/content/services/prismic/transformers/pages';
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

  const serverData = await getServerData(context);

  if (!serverData.toggles.modes.kioskMode) {
    return { notFound: true };
  }

  if (!looksLikePrismicId(exhibitionId)) {
    return { notFound: true };
  }

  const client = createClient(context);
  const exhibitionDocument = await fetchExhibition(client, exhibitionId);

  if (!isNotUndefined(exhibitionDocument?.exhibition)) {
    return { notFound: true };
  }

  const { exhibition } = exhibitionDocument;
  const exhibitionDoc = transformExhibition(exhibition);

  const pageDocument = await fetchPage(
    client,
    `${exhibitionDoc.uid}-explore-more`
  );

  if (!pageDocument) {
    return { notFound: true };
  }

  const jsonLd = exhibitionLd(exhibitionDoc);

  return {
    props: serialiseProps<Props>({
      exhibition: exhibitionDoc,
      page: transformPage(pageDocument),
      jsonLd,
      serverData,
    }),
  };
};

export default Page;
