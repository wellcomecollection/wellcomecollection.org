import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchPage } from '@weco/content/services/prismic/fetch/pages';
import { transformPage } from '@weco/content/services/prismic/transformers/pages';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import CollectionsPlacesPage, {
  Props as CollectionsPlacesPageProps,
} from '@weco/content/views/pages/collections/places';

type Props = ServerSideProps<CollectionsPlacesPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);

  if (!serverData.toggles.thematicBrowsing.value) {
    return {
      notFound: true,
    };
  }

  const client = createClient(context);
  const thematicBrowsingPage = await fetchPage(
    client,
    'thematic-browsing-places'
  );

  if (isNotUndefined(thematicBrowsingPage)) {
    const pageDoc = transformPage(thematicBrowsingPage);

    return {
      props: serialiseProps<Props>({
        serverData,
        thematicBrowsingPage: pageDoc,
      }),
    };
  }

  return { notFound: true };
};

export default CollectionsPlacesPage;
