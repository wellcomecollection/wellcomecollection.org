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
import {
  archiveTypeWorksSortFields,
  fetchArchiveTypeWorks,
} from '@weco/content/services/wellcome/catalogue/works';
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
  const archiveType = archiveTypes.find(type => type.slug === id.toLowerCase());

  if (!archiveType) {
    return { notFound: true };
  }

  const { sort: sortQuery, sortOrder: sortOrderQuery } = context.query;
  const sort = archiveTypeWorksSortFields.find(field => field === sortQuery);
  const sortOrder = sortOrderQuery === 'desc' ? 'desc' : 'asc';

  const works = await fetchArchiveTypeWorks({
    id: archiveType.id,
    page,
    sort,
    sortOrder,
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
      sort: isString(sortQuery) ? sortQuery : undefined,
      sortOrder: isString(sortOrderQuery) ? sortOrderQuery : undefined,
    }),
  };
};

export default Page;
