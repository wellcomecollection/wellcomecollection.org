import { pageDescriptions } from '@weco/common/data/microcopy';
import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import CollectionsPlacesPage, {
  Props as PlacesPageProps,
} from '@weco/content/views/pages/collections/places';

type Props = ServerSideProps<PlacesPageProps>;

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
      title: 'Places', // TODO confirm
      description: pageDescriptions.collections.places,
      pageMeta: {
        urlPathname: '/places',
      },
    }),
  };
};

export default CollectionsPlacesPage;
