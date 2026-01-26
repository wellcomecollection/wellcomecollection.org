import { pageDescriptions } from '@weco/common/data/microcopy';
import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import CollectionsTypesAndTechniquesPage, {
  Props as TypesAndTechniquesPageProps,
} from '@weco/content/views/pages/collections/types-and-techniques';

type Props = ServerSideProps<TypesAndTechniquesPageProps>;

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

  return {
    props: serialiseProps<Props>({
      serverData,
      title: 'Types and techniques', // TODO confirm
      description: pageDescriptions.collections.typesAndTechniques,
      pageMeta: {
        urlPathname: '/types-and-techniques',
      },
    }),
  };
};

export default CollectionsTypesAndTechniquesPage;
