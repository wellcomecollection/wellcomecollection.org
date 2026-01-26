import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import CollectionsPeoplePage from '@weco/content/views/pages/collections/people-and-organisations';

export const getServerSideProps: ServerSidePropsOrAppError<
  ServerSideProps
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);

  if (!serverData.toggles.thematicBrowsing.value) {
    return {
      notFound: true,
    };
  }

  return {
    props: serialiseProps<ServerSideProps>({
      serverData,
    }),
  };
};

export default CollectionsPeoplePage;
