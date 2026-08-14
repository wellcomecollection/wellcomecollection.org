import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { appError } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { isString } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { getArchiveTypes } from '@weco/content/server-data/archiveTypes';
import { fetchArchiveTypeWorks } from '@weco/content/services/wellcome/catalogue/archiveTypes';
import { getPage } from '@weco/content/utils/query-params';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import ArchiveTypePage, {
  Props as ArchiveTypePageProps,
} from '@weco/content/views/pages/collections/archives/archive-type';

const Page: NextPage<ArchiveTypePageProps> = props => {
  return <ArchiveTypePage {...props} />;
};

type Props = ServerSideProps<ArchiveTypePageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);

  if (!serverData.toggles.featureFlags.archiveBrowsing) {
    return { notFound: true };
  }

  const { id } = context.query;
  if (!isString(id)) {
    return { notFound: true };
  }

  const page = getPage(context.query);
  if (typeof page !== 'number') {
    return appError(context, 400, page.message);
  }

  const archiveTypes = await getArchiveTypes();
  const archiveType = archiveTypes.find(type => type.id === id);

  if (!archiveType) {
    return { notFound: true };
  }

  const works = await fetchArchiveTypeWorks({
    id,
    page,
    shouldUseStagingApi: serverData.toggles.featureFlags.stagingApi,
    pipelineCluster: serverData.toggles.modes.cataloguePipeline ?? undefined,
  });

  if ('type' in works) {
    return appError(
      context,
      works.httpStatus,
      works.description || works.label
    );
  }

  return {
    props: serialiseProps<Props>({
      serverData,
      archiveType,
      works,
    }),
  };
};

export default Page;
