import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import CollectionsPlacesPage, {
  Props as CollectionsPlacesPageProps,
} from '@weco/content/views/pages/collections/places';

const Page: NextPage<CollectionsPlacesPageProps> = props => {
  return <CollectionsPlacesPage {...props} />;
};

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

  return {
    props: serialiseProps<Props>({
      serverData,
      apiToolbarLinks: [],
    }),
  };
};

export default Page;
