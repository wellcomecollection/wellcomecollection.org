import { thematicBrowsingPaths } from '@weco/common/data/hardcoded-ids';
import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { getGenericPageProps } from '@weco/content/pages/pages/[pageId]';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchPage } from '@weco/content/services/prismic/fetch/pages';
import { transformPage } from '@weco/content/services/prismic/transformers/pages';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import { ThematicBrowsingCategoryPageProps } from '@weco/content/views/layouts/ThematicBrowsingLayout';
import CollectionsTypesPage from '@weco/content/views/pages/collections/types-and-techniques';

type Props = ServerSideProps<ThematicBrowsingCategoryPageProps>;

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
    'thematic-browsing-types'
  );

  if (isNotUndefined(thematicBrowsingPage)) {
    const pageDoc = transformPage(thematicBrowsingPage);

    const genericPageProps = await getGenericPageProps({
      page: pageDoc,
      serverData,
      canonicalUrl: thematicBrowsingPaths.typesAndTechniques,
    });

    return {
      props: serialiseProps<Props>({
        ...genericPageProps,
        serverData,
        thematicBrowsingPage: pageDoc,
      }),
    };
  }

  return { notFound: true };
};

export default CollectionsTypesPage;
