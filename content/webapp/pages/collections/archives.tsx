import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { getArchiveCategories } from '@weco/content/server-data/archiveCategories';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import ArchivesPage, {
  Props as ArchivesPageProps,
} from '@weco/content/views/pages/collections/archives';

const Page: NextPage<ArchivesPageProps> = props => {
  return <ArchivesPage {...props} />;
};

type Props = ServerSideProps<ArchivesPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);

  if (!serverData.toggles.featureFlags.archiveBrowsing) {
    return {
      notFound: true,
    };
  }

  const archiveCategories = await getArchiveCategories();

  return {
    props: serialiseProps<Props>({
      serverData,
      archiveCategories,
    }),
  };
};

export default Page;
